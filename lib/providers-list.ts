import type { TextEditor } from "atom"

import { processListItems, getIntentionsForBufferPosition } from "./helpers"
import { provider as validateProvider } from "./validate"
import type { ListProvider, ListItem } from "./types"

export class ProvidersList {
  debounceNumber: number = 0
  providers = new Set<ListProvider>()

  addProvider(provider: ListProvider) {
    if (!this.hasProvider(provider)) {
      validateProvider(provider)
      this.providers.add(provider)
    }
  }

  hasProvider(provider: ListProvider): boolean {
    return this.providers.has(provider)
  }

  deleteProvider(provider: ListProvider) {
    if (this.hasProvider(provider)) {
      this.providers.delete(provider)
    }
  }

  async trigger(textEditor: TextEditor): Promise<Array<ListItem>> {
    const debounceNumber = ++this.debounceNumber

    const editorPath = textEditor.getPath()
    const bufferPosition = textEditor.getCursorBufferPosition()

    if (editorPath === undefined) {
      return []
    }

    const scopes = [...textEditor.scopeDescriptorForBufferPosition(bufferPosition).getScopesArray(), "*"]
    const promises: Promise<ListItem[]>[] = []
    for (const provider of this.providers) {
      promises.push(getIntentionsForBufferPosition(provider, bufferPosition, textEditor, scopes))
    }

    const resultsArray = await Promise.all(promises)

    if (debounceNumber !== this.debounceNumber) {
      // If has been executed one more time, ignore these results
      return []
    }

    const results = (resultsArray)
      .flat()
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      .filter((result) => result !== null && typeof result === "object") // TODO is this really needed?

    return processListItems(results)
  }

  dispose() {
    this.providers.clear()
  }
}
