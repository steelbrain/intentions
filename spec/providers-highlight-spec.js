/* @flow */

import ProvidersHighlight from '../lib/providers-highlight'

describe('ProvidersHighlight', function() {
  let providersHighlight
  let editor

  beforeEach(function() {
    if (providersHighlight) {
      providersHighlight.dispose()
    }
    providersHighlight = new ProvidersHighlight()
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
        providersHighlight.addProvider()
      }).toThrow()
      expect(function() {
        providersHighlight.addProvider(null)
      }).toThrow()
      expect(function() {
        providersHighlight.addProvider(1)
      }).toThrow()
      expect(function() {
        providersHighlight.addProvider(false)
      }).toThrow()
      expect(function() {
        providersHighlight.addProvider(true)
      }).toThrow()

      expect(function() {
        providersHighlight.addProvider({
          grammarScopes: false,
        })
      }).toThrow()
      expect(function() {
        providersHighlight.addProvider({
          grammarScopes: null,
        })
      }).toThrow()
      expect(function() {
        providersHighlight.addProvider({
          grammarScopes: true,
        })
      }).toThrow()
      expect(function() {
        providersHighlight.addProvider({
          grammarScopes: 5,
        })
      }).toThrow()

      expect(function() {
        providersHighlight.addProvider({
          grammarScopes: [],
          getIntentions: false,
        })
      }).toThrow()
      expect(function() {
        providersHighlight.addProvider({
          grammarScopes: [],
          getIntentions: null,
        })
      }).toThrow()
      expect(function() {
        providersHighlight.addProvider({
          grammarScopes: [],
          getIntentions: true,
        })
      }).toThrow()
      expect(function() {
        providersHighlight.addProvider({
          grammarScopes: [],
          getIntentions: 20,
        })
      }).toThrow()
      providersHighlight.addProvider({
        grammarScopes: [],
        getIntentions() {},
      })
    })
  })
  describe('hasProvider', function() {
    it('works properly', function() {
      const provider = {
        grammarScopes: [],
        getIntentions() {},
      }
      expect(providersHighlight.hasProvider(provider)).toBe(false)
      providersHighlight.addProvider(provider)
      expect(providersHighlight.hasProvider(provider)).toBe(true)
    })
  })
  describe('deleteProvider', function() {
    it('works properly', function() {
      providersHighlight.deleteProvider(true)
      providersHighlight.deleteProvider(null)
      providersHighlight.deleteProvider(false)
      providersHighlight.deleteProvider(50)
      const provider = {
        grammarScopes: [],
        getIntentions() {},
      }
      expect(providersHighlight.hasProvider(provider)).toBe(false)
      providersHighlight.addProvider(provider)
      expect(providersHighlight.hasProvider(provider)).toBe(true)
      providersHighlight.deleteProvider(provider)
      expect(providersHighlight.hasProvider(provider)).toBe(false)
    })
  })
  describe('trigger', function() {
    it('works properly', function() {
      const intention = {
        range: [[0, 1], [1, Infinity]],
        class: 'something',
        created() {},
      }
      providersHighlight.addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          return [intention]
        },
      })
      waitsForPromise(function() {
        return providersHighlight.trigger(editor).then(function(results) {
          expect(results).not.toBe(null)
          expect(results instanceof Array).toBe(true)
          expect(results[0]).toBe(intention)
        })
      })
    })
    it('ignores previous result from executed twice instantly', function() {
      let count = 0
      const intentionFirst = {
        range: [[0, 1], [1, Infinity]],
        class: 'something',
        created() {},
      }
      const intentionSecond = {
        range: [[0, 1], [1, Infinity]],
        created() {},
      }
      providersHighlight.addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          if (++count === 1) {
            return [intentionFirst]
          }
          return [intentionSecond]
        },
      })
      const promiseFirst = providersHighlight.trigger(editor)
      const promiseSecond = providersHighlight.trigger(editor)

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
      providersHighlight.addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          return []
        },
      })
      providersHighlight.addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          return null
        },
      })
      providersHighlight.addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          return false
        },
      })
      providersHighlight.addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          return 50
        },
      })
      waitsForPromise(function() {
        return providersHighlight.trigger(editor).then(function(results) {
          expect(results).toBe(null)
        })
      })
    })
    it('emits an error if provider throws an error', function() {
      providersHighlight.addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          throw new Error('test from provider')
        },
      })
      waitsForPromise(function() {
        return providersHighlight.trigger(editor).then(function() {
          expect(false).toBe(true)
        }, function(e) {
          expect(e.message).toBe('test from provider')
        })
      })
    })
    it('validates suggestions properly', function() {
      providersHighlight.addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          return [{}]
        },
      })
      waitsForPromise(function() {
        return providersHighlight.trigger(editor).then(function() {
          expect(false).toBe(true)
        }, function(e) {
          expect(e instanceof Error).toBe(true)
        })
      })
    })
    it('triggers providers based on scope', function() {
      let coffeeCalled = false
      let jsCalled = false
      providersHighlight.addProvider({
        grammarScopes: ['source.js'],
        getIntentions() {
          jsCalled = true
        },
      })
      providersHighlight.addProvider({
        grammarScopes: ['source.coffee'],
        getIntentions() {
          coffeeCalled = true
        },
      })
      waitsForPromise(function() {
        return providersHighlight.trigger(editor).then(function() {
          expect(jsCalled).toBe(true)
          expect(coffeeCalled).toBe(false)
        })
      })
    })
  })

  it('automatically updates length of decoration everytime coordinates update', function() {
    let element
    let jsCalled = false
    const range = [[2, 0], [2, 5]]
    providersHighlight.addProvider({
      grammarScopes: ['source.js'],
      getIntentions() {
        jsCalled = true
        return [{
          range,
          created({ element: _element }) {
            element = _element
          },
        }]
      },
    })
    waitsForPromise(function() {
      return providersHighlight.trigger(editor).then(function(intentions) {
        expect(jsCalled).toBe(true)
        expect(element).not.toBeDefined()
        providersHighlight.paint(editor, intentions)
        expect(element).toBeDefined()
        expect(element.textContent.length).toBe(5)
        editor.setTextInBufferRange(range, 'something')
        expect(element.textContent.length).toBe(9)
      })
    })
  })
})
