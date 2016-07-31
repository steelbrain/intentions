/* @flow */

import { CompositeDisposable, Emitter } from 'sb-event-kit'
import type { Disposable, TextEditor } from 'atom'
import { disposableEvent, preventDefault, ACTIVE_TYPE } from './helpers'

export default class Commands {
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
      },
    }))
  }
  async shouldShow(): Promise<void> {
    if (!this.active || this.active.type === ACTIVE_TYPE.LIST) {
      const editor = atom.workspace.getActiveTextEditor()
      const e = { show: false, editor }
      this.disposeActive()
      await this.emitter.emit('should-show', e)
      if (e.show) {
        const active = this.active = {
          type: ACTIVE_TYPE.LIST,
          subscriptions: new CompositeDisposable(),
          editor: atom.views.getView(editor),
        }
        active.editor.classList.add('intentions-active')
        active.subscriptions.add(disposableEvent(active.editor, 'mousedown', event => {
          preventDefault(event)
          this.shouldHide()
        }))
        active.subscriptions.add(disposableEvent(active.editor, 'keydown', event => {
          if (event.which === 38) {
            preventDefault(event)
            this.shouldMoveUp()
          } else if (event.which === 40) {
            preventDefault(event)
            this.shouldMoveDown()
          } else if (event.which === 13) {
            // Do Nothing, we let the intentions:confirm command work
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
  async shouldHighlight(): Promise<void> {
    if (this.active === null) {
      const editor = atom.workspace.getActiveTextEditor()
      const e = { show: false, editor }
      await this.emitter.emit('should-highlight', e)
      if (e.show) {
        const active = this.active = {
          type: ACTIVE_TYPE.HIGHLIGHT,
          subscriptions: new CompositeDisposable(),
          editor: atom.views.getView(editor),
        }
        active.editor.classList.add('intentions-active')
        active.subscriptions.add(disposableEvent(active.editor, 'keyup', () => {
          this.emitter.emit('should-hide')
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
  onShouldShow(callback: ((e: {show: boolean, editor: TextEditor}) => any)): Disposable {
    return this.emitter.on('should-show', callback)
  }
  onShouldHide(callback: (() => void)): Disposable {
    return this.emitter.on('should-hide', callback)
  }
  onShouldConfirm(callback: (() => void)): Disposable {
    return this.emitter.on('should-confirm', callback)
  }
  onShouldHighlight(callback: ((e: {show: boolean, editor: TextEditor}) => any)): Disposable {
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
