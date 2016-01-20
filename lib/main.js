'use babel'

import {CompositeDisposable} from 'atom'
import {provider as validateProvider} from './validate'
import Commands from './commands'
import IntentionsView from './view'

export default class Intentions {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.commands = new Commands()
    this.view = new IntentionsView()
    this.providers = new Set()
    this.intentionsLocked = false

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
    this.intentionsLocked = true

    const textEditor = atom.workspace.getActiveTextEditor()
    const bufferPosition = textEditor.getCursorBufferPosition()

    const promises = []
    for (const provider of this.providers) {
      promises.push(new Promise(function(resolve) {
        // TODO: Check scopes to determine if we should trigger provider
        resolve(provider.getIntentions({textEditor, bufferPosition}))
      }))
    }

    Promise.all(promises)
      .then(function(results) {
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
        console.log(suggestions)
      })
      .catch(e => console.error(e))
      .then(_ => this.intentionsLocked = false)
  }
  hideIntentions() {
    if (!this.intentionsLocked) {
      this.view.clear()
    }
  }
  dispose() {
    this.subscriptions.dispose()
    this.providers.clear()
  }
}
