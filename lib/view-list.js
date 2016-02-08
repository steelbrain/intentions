'use babel'

/* @flow */

import {CompositeDisposable, Emitter, Disposable} from 'atom'
import {ListElement} from './elements/list'
import type {TextEditor} from 'atom'
import type {Intentions$Suggestion$List} from './types'

export class ListView {
  active: boolean;
  emitter: Emitter;
  element: ListElement;
  subscriptions: CompositeDisposable;

  constructor() {
    this.active = true
    this.emitter = new Emitter()
    this.element = new ListElement()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.emitter)
    this.subscriptions.add(this.element)
  }
  activate(editor: TextEditor, suggestion: Array<Intentions$Suggestion$List>) {
    this.element.render(suggestion, selected => {
      this.emitter.emit('did-select', selected)
      this.dispose()
    })
    this.element.moveDown()

    const bufferPosition = editor.getCursorBufferPosition()
    const marker = editor.markBufferRange([bufferPosition, bufferPosition], {invalidate: 'never'})
    editor.decorateMarker(marker, {
      type: 'overlay',
      item: this.element
    })
    this.subscriptions.add(new Disposable(function() {
      marker.destroy()
    }))
  }
  moveUp() {
    this.element.moveUp()
  }
  moveDown() {
    this.element.moveDown()
  }
  selectActive() {
    this.element.selectActive()
  }
  onDidSelect(callback: Function): Disposable {
    return this.emitter.on('did-select', callback)
  }
  dispose() {
    if (this.active) {
      this.active = false
      this.emitter.emit('did-close')
      this.subscriptions.dispose()
    }
  }
}
