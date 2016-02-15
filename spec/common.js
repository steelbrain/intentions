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

export function triggerKeyboardEvent(element, code, name = 'keydown') {
  const event = new KeyboardEvent(name)
  Object.defineProperty(event, 'which', {
    get: function() {
      return code
    }
  })
  element.dispatchEvent(event)
}

export function it(name, callback) {
  global.it(name, function() {
    const value = callback()
    if (value && value.constructor.name === 'Promise') {
      waitsForPromise(function() {
        return value
      })
    }
  })
}
