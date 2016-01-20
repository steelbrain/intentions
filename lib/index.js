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
  consumeIntentions(provider) {
    this.intentions.consumeProvider(provider)
  }
}
