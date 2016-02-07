'use babel'

import {ProvidersList} from '../lib/providers-list'

describe('ProvidersList', function() {
  let providersList

  beforeEach(function() {
    if (providersList) {
      providersList.dispose()
    }
    providersList = new ProvidersList()
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
})
