import { render } from "solid-js/web"
import { CompositeDisposable, Emitter } from "sb-event-kit"
import type { Disposable } from "sb-event-kit"
import type { TextEditor } from "atom"

import { ListElement } from "./elements/list"
import type { ListItem, ListMovement } from "./types"

export default class ListView {
  emitter: Emitter
  // root element
  element: HTMLElement
  subscriptions: CompositeDisposable

  setMovement?: (movement: ListMovement) => void
  setConfirmed?: (confiremd: boolean) => void

  constructor() {
    this.element = document.createElement("div")

    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(this.emitter)
  }

  activate(editor: TextEditor, suggestions: Array<ListItem>) {
    const { component, setMovement, setConfirmed } = ListElement({
      suggestions,
      selectCallback: (selectedSuggestion: ListItem) => {
        this.emitter.emit("did-select", selectedSuggestion)
        this.dispose()
      },
    })
    // store setters
    this.setMovement = setMovement
    this.setConfirmed = setConfirmed

    // render the list element component
    render(() => component, this.element)

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

  onDidSelect(callback: (...args: Array<any>) => any): Disposable {
    return this.emitter.on("did-select", callback)
  }

  dispose() {
    this.subscriptions.dispose()
  }
}
