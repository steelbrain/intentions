'use babel'

/* @flow */

import {Intentions$Suggestion$Show} from '../types'

export function create(intention: Intentions$Suggestion$Show, length: number): HTMLElement {
  const element = document.createElement('intention-inline')
  let tries = 0
  element.textContent = '_'.repeat(length)
  requestAnimationFrame(function checkStyle() {
    if (++tries === 20) {
      // Ignore
      return
    }

    const styles = getComputedStyle(element)
    if (styles.lineHeight && styles.width !== 'auto') {
      element.style.width = styles.width
      element.style.height = styles.height
      element.style.top = '-' + styles.lineHeight
    } else requestAnimationFrame(checkStyle)
  })
  return element
}
