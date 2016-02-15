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

export function waitsForAsync(asynCallback, result) {
  waitsForPromise(function () {
    return asynCallback().then(function (returnValue) {
      if (typeof result !== 'undefined') {
        expect(returnValue).toEqual(result)
      }
    })
  })
}

export function waitsForAsyncRejection(asynCallback, errorMessage) {
  waitsForPromise(function () {
    return asynCallback().then(function () {
      expect(false).toBe(true)
    }, function (error) {
      if (typeof errorMessage !== 'undefined') {
        expect(error.message).toEqual(errorMessage)
      }
    })
  })
}
