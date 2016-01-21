'use babel'

export function processSuggestions(suggestions) {
  const suggestionsLength = suggestions.length
  for (let i = 0; i < suggestionsLength; ++i) {
    const suggestion = suggestions[i]
    suggestion.className = (suggestion.className || '') + (suggestion.icon ? 'icon icon-' + suggestion.icon : '')
  }
  return suggestions
}

export function sortSuggestions(suggestions) {
  return suggestions.sort(function(a, b) {
    return b.priority - a.priority
  })
}
