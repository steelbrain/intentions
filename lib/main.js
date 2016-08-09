/* @flow */

import { CompositeDisposable } from 'atom'
import type { Disposable } from 'atom'

import Commands from './commands'
import ListView from './view-list'
import ProvidersList from './providers-list'
import ProvidersHighlight from './providers-highlight'
import type { ListProvider, HighlightProvider } from './types'

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
    this.commands.onShouldMoveUp(() => {
      if (this.active && this.active.view) {
        this.active.view.moveUp()
      }
    })
    this.commands.onShouldMoveDown(() => {
      if (this.active && this.active.view) {
        this.active.view.moveDown()
      }
    })
    this.commands.onShouldConfirm(() => {
      if (this.active && this.active.view) {
        this.active.view.selectActive()
      }
    })
    this.commands.onShouldHide(() => { this.disposeActive() })
    this.commands.onShouldHighlight(async e => {
      this.disposeActive()
      const results = await this.providersHighlight.trigger(e.editor)
      if (results && results.length) {
        this.active = {
          type: ACTIVE_TYPE.HIGHLIGHT,
          view: null,
          subscriptions: this.providersHighlight.paint(e.editor, results),
        }
        e.show = true
      }
    })
  }
  activate() {
    this.commands.activate()
  }
  consumeListProvider(provider: ListProvider) {
    this.providersList.addProvider(provider)
  }
  deleteListProvider(provider: ListProvider) {
    this.providersList.deleteProvider(provider)
  }
  consumeHighlightProvider(provider: HighlightProvider) {
    this.providersHighlight.addProvider(provider)
  }
  deleteHighlightProvider(provider: HighlightProvider) {
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
