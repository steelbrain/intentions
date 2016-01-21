'use babel'

import {CompositeDisposable, Disposable} from 'atom'
import IntentionsList from './elements/list'

export default class IntentionsView {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.active = null
    this.element = null
  }
  show(suggestions, textEditor, bufferPosition) {
    const element = this.element = new IntentionsList()
    const marker = textEditor.markBufferRange([bufferPosition, bufferPosition], {invalidate: 'never'})
    const rendered = element.render(suggestions, _ => setImmediate(_ => this.clear()))

    element.moveDown()

    textEditor.decorateMarker(marker, {
      type: 'overlay',
      item: rendered
    })

    this.active = new Disposable(_ => {
      element.dispose()
      marker.destroy()
      this.element = null
      this.active = null
    })
  }
  moveUp() {
    this.element.moveUp()
  }
  moveDown() {
    this.element.moveDown()
  }
  getActive() {
    return this.element.getActive()
  }
  clear() {
    if (this.active) {
      this.active.dispose()
    }
  }
  dispose() {
    this.subscriptions.dispose()
    this.clear()
  }
}
