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
      'intentions:show': _ => this.show(),
      'intentions:hide': _ => this.hide(),                    // Requires active state on editor
      'intentions:confirm': _ => this.confirmSelection(_),    // Requires active state on editor
      'core:move-up': _ => this.moveUp(_),
      'core:move-down': _ => this.moveDown(_)
    }))
  }
  hide() {
    this.emitter.emit('should-hide')
  }
  show() {
    this.emitter.emit('should-show')
  }
  moveUp(event) {
    this.emitter.emit('should-move-up', event)
  }
  moveDown(event) {
    this.emitter.emit('should-move-down', event)
  }
  confirmSelection(event) {
    this.emitter.emit('should-confirm-selection', event)
  }
  onShouldHide(callback) {
    return this.emitter.on('should-hide', callback)
  }
  onShouldShow(callback) {
    return this.emitter.on('should-show', callback)
  }
  onShouldMoveUp(callback) {
    return this.emitter.on('should-move-up', callback)
  }
  onShouldMoveDown(callback) {
    return this.emitter.on('should-move-down', callback)
  }
  onShouldConfirmSelection(callback) {
    return this.emitter.on('should-confirm-selection', callback)
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
