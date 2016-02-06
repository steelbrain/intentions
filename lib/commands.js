'use babel'

/* @flow */

import invariant from 'assert'
import {CompositeDisposable, Emitter} from 'atom'
import {disposableEvent, getActiveEditorView} from './helpers'
import type {Disposable} from 'atom'

const ACTIVE_TYPE = {
  LIST: 1,
  HIGHLIGHT: 2
}

export class Commands {
  active: ?{
    type: number,
    subscriptions: CompositeDisposable,
    editor: HTMLElement
  };
  emitter: Emitter;
  subscriptions: CompositeDisposable;

  constructor() {
    this.active = null
    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.emitter)
  }
  activate() {
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'intentions:show': e => this.shouldShow(),
      'intentions:hide': e => this.shouldHide(),
      'intentions:confirm': e => this.shouldConfirm(),
      'intentions:highlight': e => this.shouldHighlight()
    }))
  }
  shouldShow() {
    if (this.active === null) {
      const e = {result: false}
      this.emitter.emit('should-show', e)
      if (e.result) {
        const active = this.active = {
          type: ACTIVE_TYPE.LIST,
          subscriptions: new CompositeDisposable(),
          editor: getActiveEditorView()
        }
        active.editor.classList.add('intentions-active')
        active.subscriptions.add(disposableEvent(active.editor, 'keydown', e => {
          if (e.which === 38) {
            e.preventDefault()
            e.stopImmediatePropogation()
            this.shouldMoveUp()
          } else if (e.which === 40) {
            e.preventDefault()
            e.stopImmediatePropogation()
            this.shouldMoveDown()
          } else this.disposeActive()
        }))
      }
    }
  }
  shouldHide() {
    if (this.active !== null) {
      this.disposeActive()
      this.emitter.emit('should-hide')
    }
  }
  shouldConfirm() {
    if (this.active && this.active.type === ACTIVE_TYPE.LIST) {
      this.disposeActive()
      this.emitter.emit('should-confirm')
    }
  }
  shouldHighlight() {
    if (this.active === null) {
      const e = {result: false}
      this.emitter.emit('should-highlight', e)
      if (e.result) {
        const active = this.active = {
          type: ACTIVE_TYPE.HIGHLIGHT,
          subscriptions: new CompositeDisposable(),
          editor: getActiveEditorView()
        }
        active.editor.classList.add('intentions-active')
        active.subscriptions.add(disposableEvent(active.editor, 'keyup', e => {
          this.disposeActive()
        }))
      }
    }
  }
  shouldMoveUp() {
    this.emitter.emit('should-move-up')
  }
  shouldMoveDown() {
    this.emitter.emit('should-move-down')
  }
  onShouldShow(callback: (() => void)): Disposable {
    return this.emitter.on('should-show', callback)
  }
  onShouldHide(callback: (() => void)): Disposable {
    return this.emitter.on('should-hide', callback)
  }
  onShouldConfirm(callback: (() => void)): Disposable {
    return this.emitter.on('should-confirm', callback)
  }
  onShouldHighlight(callback: (() => void)): Disposable {
    return this.emitter.on('should-highlight', callback)
  }
  onShouldMoveUp(callback: (() => void)): Disposable {
    return this.emitter.on('should-move-up', callback)
  }
  onShouldMoveDown(callback: (() => void)): Disposable {
    return this.emitter.on('should-move-down', callback)
  }
  disposeActive() {
    const active = this.active
    if (active) {
      active.editor.classList.remove('intentions-active')
      active.subscriptions.dispose()
      this.active = null
    }
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
