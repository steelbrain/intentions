'use babel'

/* @flow */

import {CompositeDisposable} from 'atom'
import {ACTIVE_TYPE} from './helpers'
import {Commands} from './commands'
import {ProvidersList} from './providers-list'
import {ProvidersHighlight} from './providers-highlight'
import {ListView} from './view-list'

import type {Disposable} from 'atom'
import type {Intentions$Provider$List, Intentions$Provider$Highlight} from './types'

export default class Intentions {
  active: ?{
    type: number,
    view: ?Object,
    subscriptions: ?Disposable
  };
  commands: Commands;
  providersList: ProvidersList;
  providersHighlight: ProvidersHighlight;
  subscriptions: CompositeDisposable;
  constructor() {
    this.active = null
    this.commands = new Commands()
    this.providersList = new ProvidersList()
    this.providersHighlight = new ProvidersHighlight()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.commands)
    this.subscriptions.add(this.providersList)
    this.subscriptions.add(this.providersHighlight)

    this.commands.onShouldShow(async e => {
      this.disposeActive()
      const results = await this.providersList.trigger(e.editor)
      if (results && results.length) {
        const active = this.active = { type: ACTIVE_TYPE.LIST, view: new ListView(), subscriptions: null }
        active.view.activate(e.editor, results)
        active.view.onDidSelect(function(intention) {
          intention.selected()
        })
        e.show = true
      }
    })
    this.commands.onShouldMoveUp(() => { this.active && this.active.view && this.active.view.moveUp() })
    this.commands.onShouldMoveDown(() => { this.active && this.active.view && this.active.view.moveDown() })
    this.commands.onShouldConfirm(() => { this.active && this.active.view && this.active.view.selectActive() })
    this.commands.onShouldHide(() => { this.disposeActive() })
    this.commands.onShouldHighlight(async e => {
      this.disposeActive()
      const results = await this.providersHighlight.trigger(e.editor)
      if (results && results.length) {
        this.active = {
          type: ACTIVE_TYPE.HIGHLIGHT,
          view: null,
          subscriptions: this.providersHighlight.paint(e.editor, results)
        }
        e.show = true
      }
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
  consumeHighlightProvider(provider: Intentions$Provider$Highlight) {
    this.providersHighlight.addProvider(provider)
  }
  deleteHighlightProvider(provider: Intentions$Provider$Highlight) {
    this.providersHighlight.deleteProvider(provider)
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
