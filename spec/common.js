'use babel'

import {processSuggestions} from '../lib/helpers'

export function createSuggestion(text, selected, className = '', icon = '') {
  return processSuggestions([{
    priority: 100,
    title: text,
    class: className,
    selected: selected,
    icon: icon
  }])[0]
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
