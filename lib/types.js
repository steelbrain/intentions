'use babel'

/* @flow */

export type suggestion = {
  priority: number,
  title: string,
  icon: string,
  class: ?string,
  selected: (() => void)
}
