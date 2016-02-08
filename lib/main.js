'use babel'

/* @flow */

import {CompositeDisposable} from 'atom'
import {ACTIVE_TYPE} from './helpers'
import {Commands} from './commands'
import {ProvidersList} from './providers-list'
import {ProvidersShow} from './providers-show'
import {ListView} from './view-list'

import type {Intentions$Provider$List, Intentions$Provider$Show} from './types'

export default class Intentions {
  active: ?{
    type: number,
    view: Object
  };
  commands: Commands;
  providersList: ProvidersList;
  providersShow: ProvidersShow;
  subscriptions: CompositeDisposable;
  constructor() {
    this.active = null
    this.commands = new Commands()
    this.providersList = new ProvidersList()
    this.providersShow = new ProvidersShow()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.commands)
    this.subscriptions.add(this.providersList)
    this.subscriptions.add(this.providersShow)

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
    this.commands.onShouldHighlight(e => {
      this.disposeActive()
      e.promise = this.providersShow.trigger(e.editor).then(results => {
        console.log(results)
        return results && results.length
      })
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
  consumeShowProvider(provider: Intentions$Provider$Show) {
    this.providersShow.addProvider(provider)
  }
  deleteShowProvider(provider: Intentions$Provider$Show) {
    this.providersShow.deleteProvider(provider)
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
