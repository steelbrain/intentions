'use babel'

import {CompositeDisposable} from 'atom'
import Commands from './commands'
import IntentionsView from './view'

export default class Intentions {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.commands = new Commands()
    this.view = new IntentionsView()

    this.subscriptions.add(this.commands)
    this.subscriptions.add(this.view)
    this.commands.onShouldShow(_ => this.showIntentions())
    this.commands.onShouldHide(_ => this.hideIntentions())
  }
  activate() {
    this.commands.activate()
  }
  consumeProvider(provider) {
    console.log('consumeProvider', provider)
  }
  showIntentions() {

  }
  hideIntentions() {
    this.view.clear()
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
