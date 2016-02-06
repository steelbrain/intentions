'use babel'

/* @flow */

import invariant from 'assert'
import {CompositeDisposable, Emitter} from 'atom'
import {disposableEvent, preventDefault} from './helpers'
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
      'intentions:show': e => {
        preventDefault(e)
        this.shouldShow()
      },
      'intentions:hide': e => {
        preventDefault(e)
        this.shouldHide()
      },
      'intentions:confirm': e => {
        preventDefault(e)
        this.shouldConfirm()
      },
      'intentions:highlight': e => {
        preventDefault(e)
        this.shouldHighlight()
      }
    }))
  }
  shouldShow() {
    if (this.active === null) {
      const e = {show: false}
      this.emitter.emit('should-show', e)
      if (e.show) {
        const active = this.active = {
          type: ACTIVE_TYPE.LIST,
          subscriptions: new CompositeDisposable(),
          editor: atom.views.getView(atom.workspace.getActiveTextEditor())
        }
        active.editor.classList.add('intentions-active')
        active.subscriptions.add(disposableEvent(active.editor, 'keydown', e => {
          if (e.which === 38) {
            preventDefault(e)
            this.shouldMoveUp()
          } else if (e.which === 40) {
            preventDefault(e)
            this.shouldMoveDown()
          } else {
            this.shouldHide()
          }
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
  shouldHighlight() {
    if (this.active === null) {
      const e = {show: false}
      this.emitter.emit('should-highlight', e)
      if (e.show) {
        const active = this.active = {
          type: ACTIVE_TYPE.HIGHLIGHT,
          subscriptions: new CompositeDisposable(),
          editor: atom.views.getView(atom.workspace.getActiveTextEditor())
        }
        active.editor.classList.add('intentions-active')
        active.subscriptions.add(disposableEvent(active.editor, 'keyup', e => {
          this.disposeActive()
        }))
      }
    }
  }
  shouldConfirm() {
    if (this.active && this.active.type === ACTIVE_TYPE.LIST) {
      this.disposeActive()
      this.emitter.emit('should-confirm')
    }
  }
  shouldMoveUp() {
    this.emitter.emit('should-move-up')
  }
  shouldMoveDown() {
    this.emitter.emit('should-move-down')
  }
  onShouldShow(callback: ((e: {show: boolean}) => void)): Disposable {
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
    this.disposeActive()
    this.subscriptions.dispose()
  }
}
