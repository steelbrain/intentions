/* @flow */

import { Disposable } from 'atom'
import type { ListItem } from './types'

export const ACTIVE_TYPE = {
  LIST: 1,
  HIGHLIGHT: 2,
}

export function processSuggestions(suggestions: Array<ListItem>): Array<ListItem> {
  for (const suggestion of suggestions) {
    suggestion.class = (
      suggestion.class || ''
    ) + (
      suggestion.icon ? ' icon icon-' + suggestion.icon : ''
    )
  }
  return suggestions.sort(function(a, b) {
    return b.priority - a.priority
  })
}

export function showError(message: Error | string, detail: ?string = null) {
  if (message instanceof Error) {
    detail = message.stack
    message = message.message
  }
  atom.notifications.addError(`[Intentions] ${message}`, {
    detail,
    dismissable: true,
  })
}

export function disposableEvent(element: HTMLElement, eventName: string, callback: Function): Disposable {
  element.addEventListener(eventName, callback)
  return new Disposable(function() {
    element.removeEventListener(eventName, callback)
  })
}

export function preventDefault(e: Event) {
  e.preventDefault()
  e.stopImmediatePropagation()
}
