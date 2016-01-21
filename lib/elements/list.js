'use babel'

/** @jsx jsx */
import {createClass, jsx} from 'vanilla-jsx'

export default createClass({
  renderView(suggestions) {
    let className = 'select-list popover-list'
    if (suggestions.length > 7) {
      className += ' intentions-scroll'
    }

    this.suggestionsCount = suggestions.length
    this.suggestionIndex = -1

    return <intentions-list class={className} id="intentions-list">
      <ol class="list-group" ref="list">
        {suggestions.map(function(suggestion) {
          return <li>
            <span class={suggestion.className} on-click={suggestion.selected}>{suggestion.title}</span>
          </li>
        })}
      </ol>
    </intentions-list>
  },
  moveDown() {
    this.suggestionIndex++
    this.selectOption(this.suggestionIndex)
  },
  moveUp() {
    this.suggestionIndex--
    if (this.suggestionIndex < 0) {
      this.suggestionIndex = this.suggestionsCount - 1
    }
    this.selectOption(this.suggestionIndex)
  },
  selectOption(suggestionIndex) {
    const index = suggestionIndex % this.suggestionsCount

    if (this.refs.active) {
      this.refs.active.classList.remove('selected')
    }

    this.refs.active = this.refs.list.children[index]
    this.refs.active.classList.add('selected')

    this.refs.active.scrollIntoViewIfNeeded(false)
  }
})
