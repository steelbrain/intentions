'use babel'

import {CompositeDisposable} from 'atom'
import {provider as validateProvider} from './validate'
import {sortSuggestions, processSuggestions} from './helpers'
import Commands from './commands'
import IntentionsView from './view'

export default class Intentions {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.commands = new Commands()
    this.view = new IntentionsView()
    this.providers = new Set()
    this.intentionsLocked = false
    this.shown = false

    this.subscriptions.add(this.commands)
    this.subscriptions.add(this.view)
    this.commands.onShouldShow(_ => this.showIntentions())
    this.commands.onShouldHide(_ => this.hideIntentions())
  }
  activate() {
    this.commands.activate()
  }
  consumeProvider(provider) {
    validateProvider(provider)
    this.providers.add(provider)
  }
  showIntentions() {
    if (this.intentionsLocked) {
      return
    }

    const textEditor = atom.workspace.getActiveTextEditor()
    const bufferPosition = textEditor.getCursorBufferPosition()
    const editorPath = textEditor.getPath()

    if (!editorPath) {
      // Ignore un-saved files
      return
    }
    const scopes = textEditor.scopeDescriptorForBufferPosition(bufferPosition).scopes
    scopes.push('*')

    this.intentionsLocked = true

    const promises = []
    for (const provider of this.providers) {
      if (scopes.some(scope => provider.grammarScopes.indexOf(scope) !== -1)) {
        promises.push(new Promise(function(resolve) {
          resolve(provider.getIntentions({textEditor, bufferPosition}))
        }))
      }
    }

    Promise.all(promises)
      .then(results => {
        let suggestions = []
        for (const result of results) {
          if (Array.isArray(result)) {
            suggestions = suggestions.concat(result)
          }
        }
        if (suggestions.length === 0) {
          // Got nothing to show
          return
        }
        this.shown = true
        this.view.show(sortSuggestions(processSuggestions(suggestions)), textEditor, bufferPosition)
      })
      .catch(e => console.error(e))
      .then(_ => this.intentionsLocked = false)
  }
  hideIntentions() {
    if (this.shown) {
      this.shown = false
      this.view.clear()
    }
  }
  dispose() {
    this.subscriptions.dispose()
    this.providers.clear()
  }
}
