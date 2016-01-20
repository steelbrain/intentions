'use babel'

import {CompositeDisposable} from 'atom'
import IntentionsList from './elements/list'

export default class IntentionsView {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.element = null
  }
  show(suggestions) {
    this.element = new IntentionsList()
    console.log(this.element.render(suggestions))
  }
  clear() {
    this.element.dispose()
  }
  dispose() {
    this.subscriptions.dispose()
    if (this.element) {
      this.element.dispose()
    }
  }
}
