import { render } from "solid-js/web"
import { createMutable } from "solid-js"
import { CompositeDisposable, Emitter } from "sb-event-kit"
import type { Disposable } from "sb-event-kit"
import type { TextEditor } from "atom"

import { Props as ListElementProps, ListElement } from "./elements/list"
import type { ListItem, ListMovement } from "./types"

export default class ListView {
  emitter: Emitter
  // root element
  element: HTMLElement
  subscriptions: CompositeDisposable

  // the props of ListElement component (this is reactive)
  listElementProps: ListElementProps

  constructor(suggestions: Array<ListItem> = []) {
    this.element = document.createElement("div")

    this.listElementProps = createMutable({
      suggestions,
      selectCallback: (selectedSuggestion: ListItem) => {
        this.emitter.emit("did-select", selectedSuggestion)
        this.dispose()
      },
      movement: "move-to-top",
      select: false,
    })

    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(this.emitter)
  }

  activate(editor: TextEditor, suggestions: Array<ListItem>) {
    this.listElementProps.suggestions = suggestions

    // render the list element component
    render(() => ListElement(this.listElementProps), this.element)

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
    this.listElementProps.movement = movement
  }

  select() {
    // runs only once
    this.listElementProps.select = true
  }

  onDidSelect(callback: (...args: Array<any>) => any): Disposable {
    return this.emitter.on("did-select", callback)
  }

  dispose() {
    this.subscriptions.dispose()
  }
}
