'use babel'

import {CompositeDisposable} from 'atom'
import {provider as validateProvider, suggestions as validateSuggestions} from './validate'
import {sortSuggestions, processSuggestions, showError} from './helpers'
import Commands from './commands'
import IntentionsView from './view'

export default class Intentions {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.commands = new Commands()
    this.view = new IntentionsView()
    this.providers = new Set()
    this.intentionsLocked = false
    this.activeEditor = null

    this.subscriptions.add(this.commands)
    this.subscriptions.add(this.view)
    this.commands.onShouldShow(_ => this.showIntentions())
    this.commands.onShouldHide(_ => this.hideIntentions())
    this.commands.onShouldMoveUp(event => {
      if (this.activeEditor !== null) {
        event.stopImmediatePropagation()
        this.view.moveUp()
      }
    })
    this.commands.onShouldMoveDown(event => {
      if (this.activeEditor !== null) {
        event.stopImmediatePropagation()
        this.view.moveDown()
      }
    })
    this.commands.onShouldConfirmSelection(event => {
      if (this.activeEditor !== null) {
        event.stopImmediatePropagation()
        const value = this.view.getActive()
        this.hideIntentions()
        value.selected()
      }
    })
  }
  activate() {
    this.commands.activate()
    this.subscriptions.add(atom.workspace.observeTextEditors(textEditor => {
      textEditor.onDidChangeCursorPosition(_ => {
        this.hideIntentions()
      })
    }))
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
    const scopes = textEditor.scopeDescriptorForBufferPosition(bufferPosition).getScopesArray()
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
        validateSuggestions(suggestions)
        this.activeEditor = textEditor
        atom.views.getView(textEditor).classList.add('intentions-active')
        this.view.show(sortSuggestions(processSuggestions(suggestions)), textEditor, bufferPosition)
      })
      .catch(e => showError(e))
      .then(_ => this.intentionsLocked = false)
  }
  hideIntentions() {
    if (this.activeEditor !== null) {
      atom.views.getView(this.activeEditor).classList.remove('intentions-active')
      this.activeEditor = null
      this.view.clear()
    }
  }
  dispose() {
    this.hideIntentions()
    this.subscriptions.dispose()
    this.providers.clear()
  }
}
