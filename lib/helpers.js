'use babel'

/* @flow */

// TODO: Type suggestions properly

import {Disposable} from 'atom'

export function processSuggestions(suggestions: Array<Object>): Array<Object> {
  const suggestionsLength = suggestions.length
  for (let i = 0; i < suggestionsLength; ++i) {
    const suggestion = suggestions[i]
    suggestion.class = (suggestion.class || '') + (suggestion.icon ? ' icon icon-' + suggestion.icon : '')
  }
  return suggestions
}

export function sortSuggestions(suggestions: Array<{priority: number}>): Array<Object> {
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
    detail: detail,
    dismissable: true
  })
}

export function disposableEvent(element: HTMLElement, eventName: string, callback: Function): Disposable {
  element.addEventListener(eventName, callback)
  return new Disposable(function() {
    element.removeEventListener(eventName, callback)
  })
}

export function getActiveEditorView(): HTMLElement {
  return atom.views.getView(atom.workspace.getActiveTextEditor())
}
