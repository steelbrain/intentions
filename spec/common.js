'use babel'

import { processListItems } from '../lib/helpers'

export function createSuggestion(text, selected, className = '', icon = '', process = true) {
  const suggestion = {
    icon,
    title: text,
    class: className,
    priority: 100,
    selected,
  }
  if (process) {
    return processListItems([suggestion])[0]
  }
  return suggestion
}

export function triggerKeyboardEvent(element, code, name = 'keydown') {
  const event = new KeyboardEvent(name)
  Object.defineProperty(event, 'which', {
    value: code,
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
