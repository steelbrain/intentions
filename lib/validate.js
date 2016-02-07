'use babel'

/* @flow */

import type {Intentions$Provider$List, Intentions$Suggestion$List, Intentions$Provider$Show} from './types'

export function provider(provider: Intentions$Provider$List | Intentions$Provider$Show) {
  if (!provider || typeof provider !== 'object') {
    console.log('[Intentions] Invalid provider', provider)
    throw new Error('Invalid provider provided')
  } else if (!Array.isArray(provider.grammarScopes)) {
    console.log('[Intentions] Invalid provider', provider)
    throw new Error('Invalid or no grammarScopes found on provider')
  } else if (typeof provider.getIntentions !== 'function') {
    console.log('[Intentions] Invalid provider', provider)
    throw new Error('Invalid or no getIntentions found on provider')
  }
}

export function suggestionsList(suggestions: Array<Intentions$Suggestion$List>): Array<Intentions$Suggestion$List> {
  if (Array.isArray(suggestions)) {
    const suggestionsLength = suggestions.length
    for (let i = 0; i < suggestionsLength; ++i) {
      const suggestion = suggestions[i]
      if (typeof suggestion.title !== 'string') {
        console.log('[Intentions] Invalid suggestion', suggestion)
        throw new Error('Invalid or no title found on suggestion')
      } else if (typeof suggestion.selected !== 'function') {
        console.log('[Intentions] Invalid suggestion', suggestion)
        throw new Error('Invalid or no selected found on suggestion')
      }
    }
  }
  return suggestions
}
