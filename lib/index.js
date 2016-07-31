/* @flow */

import { Disposable } from 'atom'
import Intentions from './main'

module.exports = {
  activate() {
    this.intentions = new Intentions()
    this.intentions.activate()
  },
  deactivate() {
    this.intentions.dispose()
  },
  consumeListIntentions(provider) {
    const providers = [].concat(provider)
    providers.forEach(entry => {
      this.intentions.consumeListProvider(entry)
    })
    return new Disposable(() => {
      providers.forEach(entry => {
        this.intentions.deleteListProvider(entry)
      })
    })
  },
  consumeHighlightIntentions(provider) {
    const providers = [].concat(provider)
    providers.forEach(entry => {
      this.intentions.consumeHighlightProvider(entry)
    })
    return new Disposable(() => {
      providers.forEach(entry => {
        this.intentions.deleteHighlightProvider(entry)
      })
    })
  },
}
