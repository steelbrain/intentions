/* @flow */

import ListElement from '../lib/elements/list'
import { createSuggestion } from './common'

describe('Intentions list element', function() {
  it('has a complete working lifecycle', function() {
    const element = new ListElement()
    const suggestions = [
      createSuggestion('Suggestion 1', jasmine.createSpy('suggestion.selected.0'), 'someClass', 'someIcon'),
      createSuggestion('Suggestion 2', jasmine.createSpy('suggestion.selected.1')),
    ]

    const selected = jasmine.createSpy('suggestion.selected')
    const rendered = element.render(suggestions, selected)

    expect(rendered.refs.list.children.length).toBe(2)
    expect(rendered.refs.list.children[0].textContent).toBe('Suggestion 1')
    expect(rendered.refs.list.children[1].textContent).toBe('Suggestion 2')
    expect(rendered.refs.list.children[0].children[0].className).toBe('someClass icon icon-someIcon')
    expect(element.suggestionsIndex).toBe(-1)

    element.moveDown()

    expect(element.suggestionsIndex).toBe(0)
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[0].textContent)

    element.moveDown()

    expect(element.suggestionsIndex).toBe(1)
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[1].textContent)

    element.moveUp()

    expect(element.suggestionsIndex).toBe(0)
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[0].textContent)

    element.moveUp()

    expect(element.suggestionsIndex).toBe(1)
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[1].textContent)

    rendered.refs.list.children[1].children[0].dispatchEvent(new MouseEvent('click', {
      bubbles: true,
    }))
    expect(selected).toHaveBeenCalledWith(suggestions[1])
  })
})
