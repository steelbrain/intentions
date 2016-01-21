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
    const rendered = element.render(suggestions)

    element.moveDown()

    textEditor.decorateMarker(marker, {
      type: 'overlay',
      item: rendered
    })

    this.active = new Disposable(function() {
      element.dispose()
      marker.destroy()
    })
  }
  moveUp() {
    this.element.moveUp()
  }
  moveDown() {
    this.element.moveDown()
  }
  clear() {
    if (this.active) {
      this.active.dispose()
      this.element = null
    }
  }
  dispose() {
    this.subscriptions.dispose()
    this.clear()
  }
}
