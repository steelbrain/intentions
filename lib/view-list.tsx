import { render } from "solid-js/web"
import { CompositeDisposable } from "sb-event-kit"
import { Emitter } from "atom"
import type { Disposable, TextEditor } from "atom"

import { ListElement, Refs as ListElementRefs } from "./elements/list"
import type { ListItem, ListMovement } from "./types"

export class ListView {
  emitter = new Emitter<{}, { "did-select": ListItem }>() // eslint-disable-line @typescript-eslint/ban-types
  // root element
  element: HTMLElement = document.createElement("div")
  subscriptions = new CompositeDisposable()

  setMovement?: ListElementRefs["setMovement"]
  setConfirmed?: ListElementRefs["setConfirmed"]

  constructor() {
    this.subscriptions.add(this.emitter)
  }

  activate(editor: TextEditor, suggestions: Array<ListItem>) {
    let refs: ListElementRefs | undefined
    // render the list element component
    render(
      () => (
        <ListElement
          suggestions={suggestions}
          selectCallback={(selectedSuggestion: ListItem) => {
            this.emitter.emit("did-select", selectedSuggestion)
            this.dispose()
          }}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore TODO fix the type
          ref={refs} // pass so it sets the setters
        />
      ),
      this.element
    )
    // store the setters
    this.setMovement = refs?.setMovement
    this.setConfirmed = refs?.setConfirmed

    const bufferPosition = editor.getCursorBufferPosition()
    const marker = editor.markBufferRange([bufferPosition, bufferPosition], {
      invalidate: "never",
    })
    editor.decorateMarker(marker, {
      type: "overlay",
      item: this.element,
    })
    this.subscriptions.add(function () {
      marker.destroy()
    })
  }

  move(movement: ListMovement) {
    this.setMovement?.(movement)
  }

  select() {
    // runs only once
    this.setConfirmed?.(true)
  }

  onDidSelect(callback: (...args: Array<ListItem>) => void): Disposable {
    return this.emitter.on("did-select", callback)
  }

  dispose() {
    this.subscriptions.dispose()
  }
}
