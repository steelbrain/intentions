'use babel'

/* @flow */

import {processSuggestions} from './helpers'
import {provider as validateProvider, suggestions as validateSuggestions} from './validate'
import type {Intentions$Provider$List, Intentions$Suggestion} from './types'
import type {TextEditor} from 'atom'

export class ProvidersList {
  number: number;
  providers: Set<Intentions$Provider$List>;

  constructor() {
    this.number = 0
    this.providers = new Set()
  }
  addProvider(provider: Intentions$Provider$List) {
    if (!this.hasProvider(provider)) {
      validateProvider(provider)
      this.providers.add(provider)
    }
  }
  hasProvider(provider: Intentions$Provider$List): boolean {
    return this.providers.has(provider)
  }
  deleteProvider(provider: Intentions$Provider$List) {
    if (this.hasProvider(provider)) {
      this.providers.delete(provider)
    }
  }
  async trigger(textEditor: TextEditor): Promise<?Array<Intentions$Suggestion>> {
    const editorPath = textEditor.getPath()
    const bufferPosition = textEditor.getCursorBufferPosition()

    if (!editorPath) {
      return null
    }
    const scopes = textEditor.scopeDescriptorForBufferPosition(bufferPosition).getScopesArray()
    scopes.push('*')

    const promises = []
    this.providers.forEach(function(provider) {
      promises.push(new Promise(function(resolve) {
        resolve(provider.getIntentions({textEditor, bufferPosition}))
      }).then(validateSuggestions))
    })

    const number = ++this.number
    const results = (await Promise.all(promises)).reduce(function(items, item) {
      if (item) {
        return items.concat(item)
      } else return items
    }, [])

    if (number !== this.number) {
      // If has been executed one more time, ignore these results
      return null
    } else if (!results.length) {
      // We got nothing here
      return null
    }

    return processSuggestions(results)
  }
  dispose() {
    this.providers.clear()
  }
}