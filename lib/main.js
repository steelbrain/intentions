'use babel'

/* @flow */

import {CompositeDisposable} from 'atom'
import {ACTIVE_TYPE} from './helpers'
import {Commands} from './commands'
import {ProvidersList} from './providers-list'
import {ListView} from './view-list'

import type {Intentions$Provider$List} from './types'

export default class Intentions {
  active: ?{
    type: number,
    view: Object
  };
  commands: Commands;
  providersList: ProvidersList;
  subscriptions: CompositeDisposable;
  constructor() {
    this.active = null
    this.commands = new Commands()
    this.providersList = new ProvidersList()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.commands)
    this.subscriptions.add(this.providersList)

    this.commands.onShouldShow(e => {
      this.disposeActive()
      e.promise = this.providersList.trigger(e.editor).then(results => {
        if (results && results.length) {
          const active = this.active = { type: ACTIVE_TYPE.LIST, view: new ListView() }
          active.view.activate(e.editor, results)
          active.view.onDidSelect(function(intention) {
            intention.selected()
          })
        }
        return results && results.length
      })
    })
    this.commands.onShouldMoveUp(() => { this.active && this.active.view.moveUp() })
    this.commands.onShouldMoveDown(() => { this.active && this.active.view.moveDown() })
    this.commands.onShouldConfirm(() => { this.active && this.active.view.selectActive() })
    this.commands.onShouldHide(() => { this.disposeActive() })
    this.commands.onShouldHighlight(() => {
      // TODO: Make this work
      console.log('[Intentions] should show inline highlights')
    })
  }
  activate() {
    this.commands.activate()
  }
  consumeListProvider(provider: Intentions$Provider$List) {
    this.providersList.addProvider(provider)
  }
  deleteListProvider(provider: Intentions$Provider$List) {
    this.providersList.deleteProvider(provider)
  }
  disposeActive() {
    this.commands.disposeActive()
    if (this.active) {
      this.active.view.dispose()
      this.active = null
    }
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
