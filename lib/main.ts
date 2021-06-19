import { CompositeDisposable } from "sb-event-kit"
import { Disposable } from "atom"

import { Commands } from "./commands"
import { ListView } from "./view-list"
import { ProvidersList } from "./providers-list"
import { paint, ProvidersHighlight } from "./providers-highlight"
import type { ListProvider, HighlightProvider } from "./types"

export class Intentions {
  active: Disposable | null | undefined = null
  commands = new Commands()
  providersList = new ProvidersList()
  providersHighlight = new ProvidersHighlight()
  subscriptions = new CompositeDisposable()

  constructor() {
    this.subscriptions.add(this.commands, this.providersList, this.providersHighlight)

    // eslint-disable-next-line arrow-parens
    this.commands.onListShow(async (textEditor) => {
      const results = await this.providersList.trigger(textEditor)

      if (!results.length) {
        return false
      }

      const listView = new ListView()
      const subscriptions = new CompositeDisposable()
      listView.activate(textEditor, results)
      listView.onDidSelect(function (intention) {
        intention.selected()
        subscriptions.dispose()
      })
      subscriptions.add(
        listView,
        () => {
          if (this.active === subscriptions) {
            this.active = null
          }
        },
        this.commands.onListMove(function (movement) {
          listView.move(movement)
        }),
        this.commands.onListConfirm(function () {
          listView.select()
        }),
        this.commands.onListHide(function () {
          subscriptions.dispose()
        })
      )
      this.active = subscriptions
      return true
    })
    // eslint-disable-next-line arrow-parens
    this.commands.onHighlightsShow(async (textEditor) => {
      const results = await this.providersHighlight.trigger(textEditor)

      if (!results.length) {
        return false
      }

      const painted = paint(textEditor, results)
      const subscriptions = new CompositeDisposable()
      subscriptions.add(
        () => {
          if (this.active === subscriptions) {
            this.active = null
          }
        },
        this.commands.onHighlightsHide(function () {
          subscriptions.dispose()
        }),
        painted
      )
      this.active = subscriptions
      return true
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

  dispose() {
    this.subscriptions.dispose()

    if (this.active) {
      this.active.dispose()
    }
  }
}
