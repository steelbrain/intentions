import { Disposable } from "atom"

import Intentions from "./main"
import type { ListProvider, HighlightProvider } from "./types"

let intentions: Intentions | undefined = undefined

export function activate() {
  intentions = new Intentions()
  intentions.activate()
}

export function deactivate() {
  intentions?.dispose()
}

export function consumeListIntentions(provider: ListProvider | Array<ListProvider>) {
  const providers = Array.isArray(provider) ? provider : [provider]
  if (intentions === undefined) {
    return
  }
  providers.forEach((entry) => {
    ;(intentions as Intentions).consumeListProvider(entry)
  })
  return new Disposable(() => {
    providers.forEach((entry) => {
      ;(intentions as Intentions).deleteListProvider(entry)
    })
  })
}

export function consumeHighlightIntentions(provider: HighlightProvider | Array<HighlightProvider>) {
  const providers = Array.isArray(provider) ? provider : [provider]
  if (intentions === undefined) {
    return
  }
  providers.forEach((entry) => {
    ;(intentions as Intentions).consumeHighlightProvider(entry)
  })
  return new Disposable(() => {
    providers.forEach((entry) => {
      ;(intentions as Intentions).deleteHighlightProvider(entry)
    })
  })
}
