'use babel'

import {CompositeDisposable} from 'atom'

export default class Intentions {
  constructor() {
    this.subscriptions = new CompositeDisposable()
  }
  activate() {
    console.log('Activating intentions')
  }
  consumeProvider(provider) {
    console.log('consumeProvider', provider)
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
