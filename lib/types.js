'use babel'

/* @flow */

import type {TextEditor, Point} from 'atom'

export type Intentions$Suggestion = {
  priority: number,
  title: string,
  icon: string,
  class: ?string,
  selected: (() => void)
}

type Intentions$Provider$List$Parameters = {
  textEditor: TextEditor,
  bufferPosition: Point
}
export type Intentions$Provider$List = {
  grammarScopes: Array<string>,
  getIntentions: ((parameters: Intentions$Provider$List$Parameters) => Array<Intentions$Suggestion> | Promise<Array<Intentions$Suggestion>>)
}
