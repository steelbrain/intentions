import { createComputed, createEffect, createSignal, createSelector, For } from "solid-js"

import { $class } from "../helpers"
import type { ListMovement, ListItem } from "../types"

export interface Props {
  suggestions: Array<ListItem>
  selectCallback: (suggestion: ListItem) => void
  movement?: ListMovement
  select: boolean
}

export function ListElement(props: Props) {
  // current active index
  const [getActiveIndex, setActiveIndex] = createSignal(-1)
  // current active id
  const isSelected = createSelector(getActiveIndex)

  function handleSelection(suggestion: ListItem, index: number) {
    // call its associated callback
    props.selectCallback(suggestion)
    // store it in the signal
    setActiveIndex(index)
  }

  function handleMove() {
    const suggestionsCount = props.suggestions.length

    let index = getActiveIndex()

    if (props.movement === "up") {
      index--
    } else if (props.movement === "down") {
      index++
    } else if (props.movement === "move-to-top") {
      index = 0
    } else if (props.movement === "move-to-bottom") {
      index = suggestionsCount
    }

    // TODO: Implement page up/down
    index %= suggestionsCount

    if (index < 0) {
      index = suggestionsCount + index
    }

    setActiveIndex(index)
  }

  // Runs the selection callback when the user confirms the selection using keyboard
  // Updating prop.select in the parent result in running this function
  createEffect(() => {
    if (props.select) {
      const index = getActiveIndex()
      handleSelection(props.suggestions[index], index)
    }
  })

  // TODO verify that it works
  createComputed(handleMove)

  let className = "select-list popover-list"
  // add scrolling if more than 7 itmes
  if (props.suggestions.length > 7) {
    className += " intentions-scroll"
  }

  return (
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
}
