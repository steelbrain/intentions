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
  for (const entry of providers) {
    intentions.consumeListProvider(entry)
  }
  return new Disposable(() => {
    if (intentions === undefined) {
      return
    }
    for (const entry of providers) {
      intentions.deleteListProvider(entry)
    }
  })
}

export function consumeHighlightIntentions(provider: HighlightProvider | Array<HighlightProvider>) {
  const providers = Array.isArray(provider) ? provider : [provider]
  if (intentions === undefined) {
    return
  }
  for (const entry of providers) {
    intentions.consumeHighlightProvider(entry)
  }
  return new Disposable(() => {
    if (intentions === undefined) {
      return
    }
    for (const entry of providers) {
      intentions.deleteHighlightProvider(entry)
    }
  })
}
