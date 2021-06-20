import * as ValidateSuggestions from "./validate"
import type { Point, Range, TextEditor } from "atom"
import type { ListProvider, ListItem, HighlightProvider } from "./types"

export const $class = "__$sb_intentions_class"

export async function getIntentionsForBufferPosition(
  provider: ListProvider,
  bufferPosition: Point,
  textEditor: TextEditor,
  scopes: string[]
) {
  const providerScopes = provider.grammarScopes
  if (scopes.some((scope) => providerScopes.includes(scope))) {
    const results = await provider.getIntentions({
      textEditor,
      bufferPosition,
    })
    if (atom.inDevMode()) {
      ValidateSuggestions.suggestionsList(results)
    }

    return results
  }
  return []
}

export async function getIntentionsForVisibleRange(
  provider: HighlightProvider,
  visibleRange: Range,
  textEditor: TextEditor,
  scopes: string[]
) {
  const providerScopes = provider.grammarScopes
  if (scopes.some((scope) => providerScopes.includes(scope))) {
    const results = await provider.getIntentions({
      textEditor,
      visibleRange,
    })
    if (atom.inDevMode()) {
      ValidateSuggestions.suggestionsShow(results)
    }

    return results
  }
  return []
}

export function processListItems(suggestions: Array<ListItem>): Array<ListItem> {
  for (let i = 0, { length } = suggestions; i < length; ++i) {
    const suggestion = suggestions[i]
    const className: string[] = []

    if (suggestion.class !== undefined && suggestion.class !== "") {
      className.push(suggestion.class.trim())
    }

    if (suggestion.icon !== undefined && suggestion.icon !== "") {
      className.push(`icon icon-${suggestion.icon}`)
    }

    suggestion[$class] = className.join(" ")
  }

  return suggestions.sort(function (a, b) {
    return b.priority - a.priority
  })
}
export function showError(message: Error | string, detail?: string) {
  let detailShown: string | undefined
  let messageShown: string
  if (message instanceof Error) {
    detailShown = message.stack ?? ""
    messageShown = message.message
  } else {
    detailShown = detail
    messageShown = message
  }

  atom.notifications.addError(`[Intentions] ${messageShown}`, {
    detail: detailShown,
    dismissable: true,
  })
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function flatObjectArray<T = any>(resultsArray: T[][]) {
  return (
    resultsArray
      .flat()
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      .filter((result) => result !== null && typeof result === "object") // TODO is this really needed?
  )
}
