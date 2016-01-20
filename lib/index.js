'use babel'

module.exports = {
  activate() {
    console.log('Intentions activated')
  },
  deactivate() {
    console.log('Intentions deactivated')
  },
  consumeIntentions(provider) {
    console.log('intentions provider', provider)
  }
}
