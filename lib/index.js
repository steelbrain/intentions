'use babel'

import Intentions from './main'

module.exports = {
  activate() {
    this.intentions = new Intentions()
    this.intentions.activate()
  },
  deactivate() {
    this.intentions.dispose()
  },
  consumeIntentions(providers) {
    [].concat(providers).forEach(provider => {
      this.intentions.consumeProvider(provider)
    })
  }
}
