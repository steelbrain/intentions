'use babel'

import {CompositeDisposable} from 'atom'
import Commands from './commands'

export default class Intentions {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.commands = new Commands()

    this.subscriptions.add(this.commands)
  }
  activate() {
    this.commands.activate()
  }
  consumeProvider(provider) {
    console.log('consumeProvider', provider)
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
