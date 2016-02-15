'use babel'

/* @flow */

import {Intentions$Suggestion$Highlight} from '../types'

function padTextCotnent(length) {
  this.textContent = ' '.repeat(length)
}

export function create(intention: Intentions$Suggestion$Highlight, length: number): HTMLElement {
  let tries = 0
  // $FlowIgnore: Flow doesn't let you change elements
  const element = document.createElement('intention-inline')
  element.style.opacity = '0'
  element.padTextContent = padTextCotnent
  element.padTextContent(length)
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
