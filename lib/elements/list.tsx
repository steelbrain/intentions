import { createSignal, createSelector, For, createComputed, on } from "solid-js"

import { $class } from "../helpers"
import type { ListItem } from "../types"

export interface Props {
  suggestions: Array<ListItem>
  selectCallback: (suggestion: ListItem) => void
}

export function ListElement(props: Props) {
  // current active index
  const [getActiveIndex, setActiveIndex] = createSignal(-1)
  // current active id
  const isSelected = createSelector(getActiveIndex)
  // movement state
  const [getMovement, setMovement] = createSignal<string | undefined>("move-to-top")
  // selected state
  const [getConfirmed, setConfirmed] = createSignal(false)

  function handleSelection(suggestion: ListItem, index: number) {
    // call its associated callback
    props.selectCallback(suggestion)
    // store it in the signal
    setActiveIndex(index)
  }

  function handleMove() {
    const suggestionsCount = props.suggestions.length

    const prevIndex = getActiveIndex()
    let index = prevIndex

    const movement = getMovement()
    if (movement === "up") {
      index--
    } else if (movement === "down") {
      index++
    } else if (movement === "move-to-top") {
      index = 0
    } else if (movement === "move-to-bottom") {
      index = suggestionsCount
    }

    // TODO: Implement page up/down
    index %= suggestionsCount

    if (index < 0) {
      index = suggestionsCount + index
    }

    if (index !== prevIndex) {
      setActiveIndex(index)
    }

    // unset the movement to allow solid to check the next movement
    setMovement(undefined)
  }

  createComputed(
    on(getConfirmed, () => {
      if (getConfirmed()) {
        // Runs the selection callback when the user confirms the selection using keyboard
        // Updating prop.select in the parent result in running this function
        const index = getActiveIndex()
        handleSelection(props.suggestions[index], index)
      }
    })
  )
  createComputed(on(getMovement, handleMove))

  let className = "select-list popover-list"
  // add scrolling if more than 7 itmes
  if (props.suggestions.length > 7) {
    className += " intentions-scroll"
  }

  const component = (
    <div class={className} id="intentions-list">
      <ol className="list-group">
        <For each={props.suggestions}>
          {(suggestion, getIndex) => {
            const index = getIndex()
            return (
              <li class={isSelected(index) ? "selected" : ""}>
                <span
                  className={suggestion[$class]}
                  onClick={() => {
                    handleSelection(suggestion, index)
                  }}
                >
                  {suggestion.title}
                </span>
              </li>
            )
          }}
        </For>
      </ol>
    </div>
  )
  return { component, setMovement, setConfirmed }
}
