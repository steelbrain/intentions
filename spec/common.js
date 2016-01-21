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
