'use babel'

/** @jsx jsx */
import {createClass, jsx} from 'vanilla-jsx'

export default createClass({
  renderView(suggestions) {
    let className = 'select-list popover-list'
    if (suggestions.length > 4) {
      className += ' intentions-scroll'
    }
    return <intentions-list class="select-list popover-list" id="intentions-list">
      <ol class="list-group">
        {suggestions.map(function(suggestion) {
          return <li>
            <span class={suggestion.className} on-click={suggestion.selected}>{suggestion.title}</span>
          </li>
        })}
      </ol>
    </intentions-list>
  }
})
