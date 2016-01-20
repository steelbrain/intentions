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
    const textEditor = atom.workspace.getActiveTextEditor()
    const bufferPosition = textEditor.getCursorBufferPosition()
    console.log(textEditor, bufferPosition)
  }
  hideIntentions() {
    this.view.clear()
  }
  dispose() {
    this.subscriptions.dispose()
    this.providers.clear()
  }
}
