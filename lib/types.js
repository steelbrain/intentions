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

export type Intentions$Provider$List = {
  grammarScopes: Array<string>,
  getIntentions: ((parameters: {textEditor: TextEditor, bufferPosition: Point}) => Array<Intentions$Suggestion> | Promise<Array<Intentions$Suggestion>>)
}
