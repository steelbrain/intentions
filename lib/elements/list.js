'use babel'

/** @jsx jsx */
import {createClass, jsx} from 'vanilla-jsx'

export default createClass({
  renderView(suggestions, dispose) {
    let className = 'select-list popover-list'
    if (suggestions.length > 7) {
      className += ' intentions-scroll'
    }

    this.suggestions = suggestions
    this.suggestionsCount = suggestions.length
    this.suggestionsIndex = -1

    return <intentions-list class={className} id="intentions-list">
      <ol class="list-group" ref="list">
        {suggestions.map(function(suggestion) {
          return <li on-click={dispose}>
            <span class={suggestion.class} on-click={suggestion.selected}>{suggestion.title}</span>
          </li>
        })}
      </ol>
    </intentions-list>
  },
  moveDown() {
    this.suggestionsIndex++
    this.selectOption(this.suggestionsIndex)
  },
  moveUp() {
    this.suggestionsIndex--
    if (this.suggestionsIndex < 0) {
      this.suggestionsIndex = this.suggestionsCount - 1
    }
    this.selectOption(this.suggestionsIndex)
  },
  selectOption(suggestionsIndex) {
    const index = suggestionsIndex % this.suggestionsCount

    if (this.refs.active) {
      this.refs.active.classList.remove('selected')
    }

    this.refs.active = this.refs.list.children[index]
    this.refs.active.classList.add('selected')

    this.refs.active.scrollIntoViewIfNeeded(false)
  },
  getActive() {
    return this.suggestions[this.suggestionsIndex]
  }
})
