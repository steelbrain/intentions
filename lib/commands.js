'use babel'

import {CompositeDisposable, Emitter} from 'atom'

export default class Commands {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.emitter = new Emitter()
  }
  activate() {
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'intentions:hide': _ => this.emitter.emit('should-hide'),
      'intentions:show': _ => this.emitter.emit('should-show')
    }))
  }
  onShouldHide(callback) {
    return this.emitter.on('should-hide', callback)
  }
  onShouldShow(callback) {
    return this.emitter.on('should-show', callback)
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
