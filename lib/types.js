/* @flow */

import type {TextEditor, Point, Range, TextEditorMarker} from 'atom'

export type Intentions$Suggestion$List = {
  priority: number,
  title: string,
  icon: string,
  class: ?string,
  selected: (() => void)
}

export type Intentions$Suggestion$Highlight = {
  range: Range,
  class: ?string,
  created: ((parameters: {
    textEditor: TextEditor,
    element: HTMLElement,
    marker: TextEditorMarker,
    matchedText: string
  }) => any)
}

export type Intentions$Provider$List = {
  grammarScopes: Array<string>,
  getIntentions: ((parameters: {
    textEditor: TextEditor,
    bufferPosition: Point
  }) => Array<Intentions$Suggestion$List> | Promise<Array<Intentions$Suggestion$List>>)
}

export type Intentions$Provider$Highlight = {
  grammarScopes: Array<string>,
  getIntentions: ((parameters: {
    textEditor: TextEditor,
    visibleRange: Range
  }) => Array<Intentions$Suggestion$Highlight> | Promise<Array<Intentions$Suggestion$Highlight>>)
}
