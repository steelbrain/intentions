import type { TextEditor, Range, DisplayMarker } from "atom"
import { flatObjectArray, getIntentionsForVisibleRange, scopesForBufferPosition } from "./helpers"

import { provider as validateProvider } from "./validate"
import { create as createElement, PADDING_CHARACTER } from "./elements/highlight"
import type { HighlightProvider, HighlightItem } from "./types"

export class ProvidersHighlight {
  debounceNumber: number = 0
  providers = new Set<HighlightProvider>()

  addProvider(provider: HighlightProvider) {
    if (!this.hasProvider(provider)) {
      validateProvider(provider)
      this.providers.add(provider)
    }
  }

  hasProvider(provider: HighlightProvider): boolean {
    return this.providers.has(provider)
  }

  deleteProvider(provider: HighlightProvider) {
    if (this.hasProvider(provider)) {
      this.providers.delete(provider)
    }
  }

  async trigger(textEditor: TextEditor): Promise<Array<HighlightItem>> {
    const debounceNumber = ++this.debounceNumber

    const editorPath = textEditor.getPath()
    if (editorPath === undefined) {
      return []
    }

    const bufferPosition = textEditor.getCursorBufferPosition()

    const scopes = scopesForBufferPosition(textEditor, bufferPosition)

    const visibleRange = { ...textEditor.getBuffer().getRange() } as Range
    // Setting this to infinity on purpose, cause the buffer position just marks visible column
    // according to element width
    visibleRange.end.column = Infinity

    const promises: Promise<HighlightItem[]>[] = []
    for (const provider of this.providers) {
      promises.push(getIntentionsForVisibleRange(provider, visibleRange, textEditor, scopes))
    }

    const resultsArray = await Promise.all(promises)

    if (debounceNumber !== this.debounceNumber) {
      // If has been executed one more time, ignore these results
      return []
    }

    return flatObjectArray<HighlightItem>(resultsArray)
  }

  /* eslint-disable class-methods-use-this */
  /** @deprecated Use the exported function */
  paint(...args: Parameters<typeof paint>): ReturnType<typeof paint> {
    return paint(...args)
  }
  /* eslint-enable class-methods-use-this */

  dispose() {
    this.providers.clear()
  }
}

export function paint(textEditor: TextEditor, intentions: Array<HighlightItem>): () => void {
  const markers: DisplayMarker[] = []

  for (const intention of intentions) {
    const matchedText = textEditor.getTextInBufferRange(intention.range)
    const marker = textEditor.markBufferRange(intention.range)
    const element = createElement(matchedText.length)
    intention.created({
      textEditor,
      element,
      marker,
      matchedText,
    })
    textEditor.decorateMarker(marker, {
      type: "overlay",
      position: "tail",
      item: element,
    })
    marker.onDidChange(function ({ newHeadBufferPosition: start, oldTailBufferPosition: end }) {
      element.textContent = PADDING_CHARACTER.repeat(textEditor.getTextInBufferRange([start, end]).length)
    })
    markers.push(marker)
  }

  return function () {
    markers.forEach(function (marker) {
      try {
        marker.destroy()
      } catch (_) {
        /* No Op */
      }
    })
  }
}
