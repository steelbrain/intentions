'use babel'

import {ProvidersList} from '../lib/providers-list'

describe('ProvidersList', function() {
  let providersList
  let editor

  beforeEach(function() {
    if (providersList) {
      providersList.dispose()
    }
    providersList = new ProvidersList()
    atom.workspace.destroyActivePane()
    waitsForPromise(function() {
      return atom.workspace.open(__filename).then(function() {
        editor = atom.workspace.getActiveTextEditor()
      })
    })
  })

  describe('addProvider', function() {
    it('validates parameters properly', function() {
      expect(function() {
        providersList.addProvider()
      }).toThrow()
      expect(function() {
        providersList.addProvider(null)
      }).toThrow()
      expect(function() {
        providersList.addProvider(1)
      }).toThrow()
      expect(function() {
        providersList.addProvider(false)
      }).toThrow()
      expect(function() {
        providersList.addProvider(true)
      }).toThrow()

      expect(function() {
        providersList.addProvider({
          grammarScopes: false
        })
      }).toThrow()
      expect(function() {
        providersList.addProvider({
          grammarScopes: null
        })
      }).toThrow()
      expect(function() {
        providersList.addProvider({
          grammarScopes: true
        })
      }).toThrow()
      expect(function() {
        providersList.addProvider({
          grammarScopes: 5
        })
      }).toThrow()

      expect(function() {
        providersList.addProvider({
          grammarScopes: [],
          getIntentions: false
        })
      }).toThrow()
      expect(function() {
        providersList.addProvider({
          grammarScopes: [],
          getIntentions: null
        })
      }).toThrow()
      expect(function() {
        providersList.addProvider({
          grammarScopes: [],
          getIntentions: true
        })
      }).toThrow()
      expect(function() {
        providersList.addProvider({
          grammarScopes: [],
          getIntentions: 20
        })
      }).toThrow()
      providersList.addProvider({
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
      expect(providersList.hasProvider(provider)).toBe(false)
      providersList.addProvider(provider)
      expect(providersList.hasProvider(provider)).toBe(true)
    })
  })
  describe('deleteProvider', function() {
    it('works properly', function() {
      providersList.deleteProvider(true)
      providersList.deleteProvider(null)
      providersList.deleteProvider(false)
      providersList.deleteProvider(50)
      const provider = {
        grammarScopes: [],
        getIntentions: function() {}
      }
      expect(providersList.hasProvider(provider)).toBe(false)
      providersList.addProvider(provider)
      expect(providersList.hasProvider(provider)).toBe(true)
      providersList.deleteProvider(provider)
      expect(providersList.hasProvider(provider)).toBe(false)
    })
  })
  describe('trigger', function() {
    it('works properly', function() {
      const intention  = {
        priority: 100,
        icon: 'bucket',
        class: 'custom-icon-class',
        title: 'Choose color from colorpicker',
        selected: function() {
          console.log('You clicked the color picker option')
        }
      }
      providersList.addProvider({
        grammarScopes: ['*'],
        getIntentions: function() {
          return [intention]
        }
      })
      waitsForPromise(function() {
        return providersList.trigger(editor).then(function(results) {
          expect(results).not.toBe(null)
          expect(results instanceof Array).toBe(true)
          expect(results[0]).toBe(intention)
        })
      })
    })
    it('ignores previous result from executed twice instantly', function() {
      let count = 0
      const intentionFirst  = {
        priority: 100,
        icon: 'bucket',
        class: 'custom-icon-class',
        title: 'Choose color from colorpicker',
        selected: function() {
          console.log('You clicked the color picker option')
        }
      }
      const intentionSecond  = {
        priority: 100,
        icon: 'bucket',
        class: 'custom-icon-class',
        title: 'Choose color from colorpicker',
        selected: function() {
          console.log('You clicked the color picker option')
        }
      }
      providersList.addProvider({
        grammarScopes: ['*'],
        getIntentions: function() {
          if (++count === 1) {
            return [intentionFirst]
          } else return [intentionSecond]
        }
      })
      const promiseFirst = providersList.trigger(editor)
      const promiseSecond = providersList.trigger(editor)

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
  })
})
