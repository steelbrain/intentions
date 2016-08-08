/* @flow */

import { Disposable } from 'atom'
import type { ListItem } from './types'

export const $class = '__$sb_intentions_class'
export const ACTIVE_TYPE = {
  LIST: 1,
  HIGHLIGHT: 2,
}

export function processListItems(suggestions: Array<ListItem>): Array<ListItem> {
  for (let i = 0, length = suggestions.length; i < length; ++i) {
    const suggestion = suggestions[i]
    const className = []
    if (suggestion.class) {
      className.push(suggestion.class.trim())
    }
    if (suggestion.icon) {
      className.push(`icon icon-${suggestion.icon}`)
    }
    suggestion[$class] = className.join(' ')
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
