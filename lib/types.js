'use babel'

/* @flow */

export type Intentions$Suggestion = {
  priority: number,
  title: string,
  icon: string,
  class: ?string,
  selected: (() => void)
}
