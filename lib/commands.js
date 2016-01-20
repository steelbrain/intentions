'use babel'

import {CompositeDisposable} from 'atom'

export default class Commands {
  constructor() {
    this.subscriptions = new CompositeDisposable()
  }
  activate() {
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'intentions:hide': function() {
        console.log('hide intentions')
      },
      'intentions:show': function() {
        console.log('show intentions')
      }
    }))
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
