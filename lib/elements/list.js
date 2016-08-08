/* @flow */

/** @jsx jsx */
import { createClass, jsx } from 'vanilla-jsx' // eslint-disable-line no-unused-vars
import { $class } from '../helpers'

export default createClass({
  renderView(suggestions, selectCallback) {
    let className = 'select-list popover-list'
    if (suggestions.length > 7) {
      className += ' intentions-scroll'
    }

    this.suggestions = suggestions
    this.suggestionsCount = suggestions.length
    this.suggestionsIndex = -1
    this.selectCallback = selectCallback

    return <intentions-list class={className} id="intentions-list">
      <ol class="list-group" ref="list">
        {suggestions.map(function(suggestion) {
          return <li>
            <span class={suggestion[$class]} on-click={function() {
              selectCallback(suggestion)
            }}>{suggestion.title}</span>
          </li>
        })}
      </ol>
    </intentions-list>
  },
  moveDown() {
    this.suggestionsIndex = (this.suggestionsIndex + 1) % this.suggestionsCount
    this.selectOption(this.suggestionsIndex)
  },
  moveUp() {
    this.suggestionsIndex--
    if (this.suggestionsIndex < 0) {
      this.suggestionsIndex = this.suggestionsCount - 1
    } else {
      this.suggestionsIndex = this.suggestionsIndex % this.suggestionsCount
    }
    this.selectOption(this.suggestionsIndex)
  },
  selectOption(index) {
    if (this.refs.active) {
      this.refs.active.classList.remove('selected')
    }

    this.refs.active = this.refs.list.children[index]
    this.refs.active.classList.add('selected')

    this.refs.active.scrollIntoViewIfNeeded(false)
  },
  selectActive() {
    this.selectCallback(this.suggestions[this.suggestionsIndex])
  },
})
