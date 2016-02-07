'use babel'

import {processSuggestions} from '../lib/helpers'

export function createSuggestion(text, selected, className = '', icon = '', process = true) {
  const suggestion = {
    priority: 100,
    title: text,
    class: className,
    selected: selected,
    icon: icon
  }
  if (process) {
    return processSuggestions([suggestion])[0]
  }
  return suggestion
}

export function triggerKeyboardEvent(element, code) {
  const event = new KeyboardEvent('keydown')
  Object.defineProperty(event, 'which', {
    get: function() {
      return code
    }
  })
  element.dispatchEvent(event)
}
