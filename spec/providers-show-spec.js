'use babel'

import {ProvidersShow} from '../lib/providers-show'

describe('ProvidersShow', function() {
  let providersShow
  let editor

  beforeEach(function() {
    if (providersShow) {
      providersShow.dispose()
    }
    providersShow = new ProvidersShow()
    atom.workspace.destroyActivePane()
    waitsForPromise(function() {
      return atom.workspace.open(__filename).then(function() {
        editor = atom.workspace.getActiveTextEditor()
      })
    })
    atom.packages.activatePackage('language-javascript')
  })

  describe('addProvider', function() {
    it('validates parameters properly', function() {
      expect(function() {
        providersShow.addProvider()
      }).toThrow()
      expect(function() {
        providersShow.addProvider(null)
      }).toThrow()
      expect(function() {
        providersShow.addProvider(1)
      }).toThrow()
      expect(function() {
        providersShow.addProvider(false)
      }).toThrow()
      expect(function() {
        providersShow.addProvider(true)
      }).toThrow()

      expect(function() {
        providersShow.addProvider({
          grammarScopes: false
        })
      }).toThrow()
      expect(function() {
        providersShow.addProvider({
          grammarScopes: null
        })
      }).toThrow()
      expect(function() {
        providersShow.addProvider({
          grammarScopes: true
        })
      }).toThrow()
      expect(function() {
        providersShow.addProvider({
          grammarScopes: 5
        })
      }).toThrow()

      expect(function() {
        providersShow.addProvider({
          grammarScopes: [],
          getIntentions: false
        })
      }).toThrow()
      expect(function() {
        providersShow.addProvider({
          grammarScopes: [],
          getIntentions: null
        })
      }).toThrow()
      expect(function() {
        providersShow.addProvider({
          grammarScopes: [],
          getIntentions: true
        })
      }).toThrow()
      expect(function() {
        providersShow.addProvider({
          grammarScopes: [],
          getIntentions: 20
        })
      }).toThrow()
      providersShow.addProvider({
        grammarScopes: [],
        getIntentions: function() {}
      })
    })
  })
  describe('hasProvider', function() {
    it('works properly', function() {
      const provider = {
        grammarScopes: [],
        getIntentions: function() {}
      }
      expect(providersShow.hasProvider(provider)).toBe(false)
      providersShow.addProvider(provider)
      expect(providersShow.hasProvider(provider)).toBe(true)
    })
  })
  describe('deleteProvider', function() {
    it('works properly', function() {
      providersShow.deleteProvider(true)
      providersShow.deleteProvider(null)
      providersShow.deleteProvider(false)
      providersShow.deleteProvider(50)
      const provider = {
        grammarScopes: [],
        getIntentions: function() {}
      }
      expect(providersShow.hasProvider(provider)).toBe(false)
      providersShow.addProvider(provider)
      expect(providersShow.hasProvider(provider)).toBe(true)
      providersShow.deleteProvider(provider)
      expect(providersShow.hasProvider(provider)).toBe(false)
    })
  })
  describe('trigger', function() {
    it('works properly', function() {
      const intention  = {
        range: [[0, 1], [1, Infinity]],
        class: 'something',
        created: function() {}
      }
      providersShow.addProvider({
        grammarScopes: ['*'],
        getIntentions: function() {
          return [intention]
        }
      })
      waitsForPromise(function() {
        return providersShow.trigger(editor).then(function(results) {
          expect(results).not.toBe(null)
          expect(results instanceof Array).toBe(true)
          expect(results[0]).toBe(intention)
        })
      })
    })
    it('ignores previous result from executed twice instantly', function() {
      let count = 0
      const intentionFirst  = {
        range: [[0, 1], [1, Infinity]],
        class: 'something',
        created: function() {}
      }
      const intentionSecond  = {
        range: [[0, 1], [1, Infinity]],
        created: function() {}
      }
      providersShow.addProvider({
        grammarScopes: ['*'],
        getIntentions: function() {
          if (++count === 1) {
            return [intentionFirst]
          } else return [intentionSecond]
        }
      })
      const promiseFirst = providersShow.trigger(editor)
      const promiseSecond = providersShow.trigger(editor)

      waitsForPromise(function() {
        return promiseFirst.then(function(results) {
          expect(results).toBe(null)
        })
      })
      waitsForPromise(function() {
        return promiseSecond.then(function(results) {
          expect(results).not.toBe(null)
          expect(results instanceof Array).toBe(true)
          expect(results[0]).toBe(intentionSecond)
        })
      })
    })
    it('does not enable it if providers return no results, including non-array ones', function() {
      providersShow.addProvider({
        grammarScopes: ['*'],
        getIntentions: function() {
          return []
        }
      })
      providersShow.addProvider({
        grammarScopes: ['*'],
        getIntentions: function() {
          return null
        }
      })
      providersShow.addProvider({
        grammarScopes: ['*'],
        getIntentions: function() {
          return false
        }
      })
      providersShow.addProvider({
        grammarScopes: ['*'],
        getIntentions: function() {
          return 50
        }
      })
      waitsForPromise(function() {
        return providersShow.trigger(editor).then(function(results) {
          expect(results).toBe(null)
        })
      })
    })
    it('emits an error if provider throws an error', function() {
      providersShow.addProvider({
        grammarScopes: ['*'],
        getIntentions: function() {
          throw new Error('test from provider')
        }
      })
      waitsForPromise(function() {
        return providersShow.trigger(editor).then(function() {
          expect(false).toBe(true)
        }, function(e) {
          expect(e.message).toBe('test from provider')
        })
      })
    })
    it('validates suggestions properly', function() {
      providersShow.addProvider({
        grammarScopes: ['*'],
        getIntentions: function() {
          return [{}]
        }
      })
      waitsForPromise(function() {
        return providersShow.trigger(editor).then(function() {
          expect(false).toBe(true)
        }, function(e) {
          expect(e instanceof Error).toBe(true)
        })
      })
    })
    it('triggers providers based on scope', function() {
      let coffeeCalled = false
      let jsCalled = false
      providersShow.addProvider({
        grammarScopes: ['source.js'],
        getIntentions: function() {
          console.log(arguments)
          jsCalled = true
        }
      })
      providersShow.addProvider({
        grammarScopes: ['source.coffee'],
        getIntentions: function() {
          coffeeCalled = true
        }
      })
      waitsForPromise(function() {
        return providersShow.trigger(editor).then(function() {
          expect(jsCalled).toBe(true)
          expect(coffeeCalled).toBe(false)
        })
      })
    })
  })
})
