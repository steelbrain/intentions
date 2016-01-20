'use babel'

import {createClass, jsx} from 'vanilla-jsx'

export default createClass({
  renderView(suggestions) {
    return <intensions-list>
      {suggestions.map(function(suggestion) {
        return <div on-click={suggestion.selected} class={suggestion.className}>
          {suggestion.title}
        </div>
      })}
    </intensions-list>
  }
})
