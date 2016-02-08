'use babel'

/* @flow */

import {CompositeDisposable} from 'atom'
import {ACTIVE_TYPE} from './helpers'
import {Commands} from './commands'
import {ProvidersList} from './providers-list'
import {ProvidersShow} from './providers-show'
import {ListView} from './view-list'

import type {Disposable} from 'atom'
import type {Intentions$Provider$List, Intentions$Provider$Show} from './types'

export default class Intentions {
  active: ?{
    type: number,
    view: ?Object,
    subscriptions: ?Disposable
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
          const active = this.active = { type: ACTIVE_TYPE.LIST, view: new ListView(), subscriptions: null }
          active.view.activate(e.editor, results)
          active.view.onDidSelect(function(intention) {
            intention.selected()
          })
          return true
        }
      })
    })
    this.commands.onShouldMoveUp(() => { this.active && this.active.view && this.active.view.moveUp() })
    this.commands.onShouldMoveDown(() => { this.active && this.active.view && this.active.view.moveDown() })
    this.commands.onShouldConfirm(() => { this.active && this.active.view && this.active.view.selectActive() })
    this.commands.onShouldHide(() => { this.disposeActive() })
    this.commands.onShouldHighlight(e => {
      this.disposeActive()
      e.promise = this.providersShow.trigger(e.editor).then(results => {
        if (results && results.length) {
          this.active = {
            type: ACTIVE_TYPE.HIGHLIGHT,
            view: null,
            subscriptions: this.providersShow.paint(e.editor, results)
          }
          return true
        }
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
      if (this.active.view) {
        this.active.view.dispose()
      } else if (this.active.subscriptions) {
        this.active.subscriptions.dispose()
      }
      this.active = null
    }
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
