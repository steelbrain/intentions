/* @flow */

import type {Intentions$Provider$List, Intentions$Suggestion$List, Intentions$Provider$Highlight, Intentions$Suggestion$Highlight} from './types'

export function provider(provider: Intentions$Provider$List | Intentions$Provider$Highlight) {
  let message
  if (!provider || typeof provider !== 'object') {
    message = 'Invalid provider provided'
  } else if (!Array.isArray(provider.grammarScopes)) {
    message = 'Invalid or no grammarScopes found on provider'
  } else if (typeof provider.getIntentions !== 'function') {
    message = 'Invalid or no getIntentions found on provider'
  }
  if (message) {
    console.log('[Intentions] Invalid provider', provider)
    throw new Error(message)
  }
}

export function suggestionsList(suggestions: Array<Intentions$Suggestion$List>): Array<Intentions$Suggestion$List> {
  if (Array.isArray(suggestions)) {
    const suggestionsLength = suggestions.length
    for (let i = 0; i < suggestionsLength; ++i) {
      const suggestion = suggestions[i]
      let message
      if (typeof suggestion.title !== 'string') {
        message = 'Invalid or no title found on intention'
      } else if (typeof suggestion.selected !== 'function') {
        message = 'Invalid or no selected found on intention'
      }
      if (message) {
        console.log('[Intentions] Invalid suggestion of type list', suggestion)
        throw new Error(message)
      }
    }
  }
  return suggestions
}

export function suggestionsShow(suggestions: Array<Intentions$Suggestion$Highlight>): Array<Intentions$Suggestion$Highlight> {
  if (Array.isArray(suggestions)) {
    const suggestionsLength = suggestions.length
    for (let i = 0; i < suggestionsLength; ++i) {
      const suggestion = suggestions[i]
      let message
      if (typeof suggestion.range !== 'object' || !suggestion.range) {
        message = 'Invalid or no range found on intention'
      } else if (suggestion.class && typeof suggestion.class !== 'string') {
        message = 'Invalid class found on intention'
      } else if (typeof suggestion.created !== 'function') {
        message = 'Invalid or no created found on intention'
      }
      if (message) {
        console.log('[Intentions] Invalid suggestion of type show', suggestion)
        throw new Error(message)
      }
    }
  }
  return suggestions
}
