import { suggestionsList as validateSuggestions } from "./validate"
import type { Point, TextEditor } from "atom"
import type { ListProvider, ListItem } from "./types"

export const $class = "__$sb_intentions_class"

export async function getIntentionsForBufferPosition(
  provider: ListProvider,
  bufferPosition: Point,
  textEditor: TextEditor,
  scopes: string[]
) {
  if (scopes.some((scope) => provider.grammarScopes.includes(scope))) {
    const results = await provider.getIntentions({
      textEditor,
      bufferPosition,
    })
    if (atom.inDevMode()) {
      validateSuggestions(results)
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
