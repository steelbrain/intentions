'use babel'

import {CompositeDisposable, Emitter} from 'atom'

export default class Commands {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.emitter = new Emitter()
  }
  activate() {
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'core:move-left': _ => this.hide(),
      'core:move-right': _ => this.hide(),
      'intentions:hide': _ => this.hide(),
      'intentions:show': _ => this.show()
    }))
  }
  hide() {
    this.emitter.emit('should-hide')
  }
  show() {
    this.emitter.emit('should-show')
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
