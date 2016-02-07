'use babel'

/* @flow */

import {CompositeDisposable} from 'atom'
import * as Validate from './validate'
import {processSuggestions, showError} from './helpers'
import {Commands} from './commands'
import {ProvidersList} from './providers-list'
import IntentionsView from './view'

import type {Intentions$Provider$List} from './types'

export default class Intentions {
  commands: Commands;
  providersList: ProvidersList;
  subscriptions: CompositeDisposable;
  constructor() {
    this.commands = new Commands()
    this.providersList = new ProvidersList()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.commands)
    this.subscriptions.add(this.providersList)
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
  showIntentions() {

  }
  hideIntentions() {

  }
  dispose() {
    this.subscriptions.dispose()
  }
}
