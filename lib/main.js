'use babel'

/* @flow */

import {CompositeDisposable} from 'atom'
import * as Validate from './validate'
import {processSuggestions, showError} from './helpers'
import {Commands} from './commands'
import IntentionsView from './view'

import type {Intentions$Provider$List} from './types'

export default class Intentions {
  commands: Commands;
  subscriptions: CompositeDisposable;
  constructor() {
    this.commands = new Commands()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.commands)
  }
  activate() {
    this.commands.activate()
    console.log('activate intentions')
  }
  consumeListProvider(provider: Intentions$Provider$List) {
    Validate.provider(provider)
  }
  showIntentions() {

  }
  hideIntentions() {

  }
  dispose() {
    this.subscriptions.dispose()
  }
}
