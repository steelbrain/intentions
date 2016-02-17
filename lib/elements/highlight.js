'use babel'

/* @flow */

import type {Intentions$Suggestion$Highlight} from '../types'
import type {TextEditorMarker} from 'atom'

export const PADDING_CHARACTER = ' '

export function create(intention: Intentions$Suggestion$Highlight, length: number): HTMLElement {
  let tries = 0
  const element = document.createElement('intention-inline')
  element.style.opacity = '0'
  element.textContent = PADDING_CHARACTER.repeat(length)
  function checkStyle() {
    if (++tries === 20) { return }
    const styles = getComputedStyle(element)
    if (styles.lineHeight && styles.width !== 'auto') {
      element.style.opacity = '1'
      element.style.top = '-' + styles.lineHeight
    } else requestAnimationFrame(checkStyle)
  }
  requestAnimationFrame(checkStyle)
  return element
}
