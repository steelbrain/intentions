/* @flow */

import { it, beforeEach } from 'jasmine-fix'
import Commands from '../lib/commands'
import { triggerKeyboardEvent } from './common'

describe('Commands', function() {
  let commands
  let editorView

  beforeEach(async function() {
    if (commands) {
      commands.dispose()
    }
    commands = new Commands()
    commands.activate()
    atom.workspace.destroyActivePane()
    await atom.workspace.open(__filename)
    editorView = atom.views.getView(atom.workspace.getActiveTextEditor())
  })

  it('triggers show properly', async function() {
    const listener = jasmine.createSpy('commands::show')
    commands.onShouldShow(listener)
    await commands.shouldShow()
    expect(listener).toHaveBeenCalled()
  })
  it('triggers hide after show properly', async function() {
    const listenerShow = jasmine.createSpy('commands::show')
    const listenerHide = jasmine.createSpy('commands::hide')
    commands.onShouldShow(listenerShow)
    commands.onShouldShow(function(e) {
      e.show = true
    })
    commands.onShouldHide(listenerHide)
    await commands.shouldShow()
    expect(listenerShow).toHaveBeenCalled()
    expect(listenerHide).not.toHaveBeenCalled()
    await commands.shouldHide()
    expect(listenerHide).toHaveBeenCalled()
  })
  it('adds class after show and removes after hide', async function() {
    commands.onShouldShow(function(e) {
      e.show = true
    })
    await commands.shouldShow()
    expect(editorView.classList.contains('intentions-active')).toBe(true)
    await commands.shouldHide()
    expect(editorView.classList.contains('intentions-active')).toBe(false)
  })
  it('emits up and down events when its active and not when its inactive', async function() {
    let up = 0
    let down = 0
    let shown = false

    commands.onShouldMoveUp(function() {
      up++
    })
    commands.onShouldMoveDown(function() {
      down++
    })
    commands.onShouldShow(function(e) {
      e.show = true
      shown = true
    })
    commands.onShouldHide(function() {
      shown = false
    })
    await commands.shouldShow()
    expect(shown).toBe(true)

    triggerKeyboardEvent(editorView, 38)
    expect(up).toBe(1)
    expect(down).toBe(0)
    expect(shown).toBe(true)

    triggerKeyboardEvent(editorView, 38)
    expect(up).toBe(2)
    expect(down).toBe(0)
    expect(shown).toBe(true)

    triggerKeyboardEvent(editorView, 38)
    expect(up).toBe(3)
    expect(down).toBe(0)
    expect(shown).toBe(true)

    triggerKeyboardEvent(editorView, 40)
    expect(up).toBe(3)
    expect(down).toBe(1)
    expect(shown).toBe(true)

    triggerKeyboardEvent(editorView, 40)
    expect(up).toBe(3)
    expect(down).toBe(2)
    expect(shown).toBe(true)

    triggerKeyboardEvent(editorView, 40)
    expect(up).toBe(3)
    expect(down).toBe(3)
    expect(shown).toBe(true)

    triggerKeyboardEvent(editorView, 41)
    expect(up).toBe(3)
    expect(down).toBe(3)
    expect(shown).toBe(false)
  })
  it('emits shouldHighlight properly', async function() {
    let show = 0
    let hide = 0
    let showHighlight = 0

    commands.onShouldShow(function(e) {
      e.show = true
      ++show
    })
    commands.onShouldHide(function() {
      ++hide
    })
    commands.onShouldHighlight(function(e) {
      e.show = true
      ++showHighlight
    })

    await commands.shouldShow()
    expect(show).toBe(1)
    expect(showHighlight).toBe(0)
    expect(hide).toBe(0)

    await commands.shouldHide()
    expect(show).toBe(1)
    expect(showHighlight).toBe(0)
    expect(hide).toBe(1)

    await commands.shouldShow()
    expect(show).toBe(2)
    expect(showHighlight).toBe(0)
    expect(hide).toBe(1)

    await commands.shouldHighlight()
    expect(show).toBe(2)
    expect(showHighlight).toBe(0)
    expect(hide).toBe(1)

    await commands.shouldHide()
    expect(show).toBe(2)
    expect(showHighlight).toBe(0)
    expect(hide).toBe(2)

    await commands.shouldHighlight()
    expect(show).toBe(2)
    expect(showHighlight).toBe(1)
    expect(hide).toBe(2)

    await commands.shouldShow()
    expect(show).toBe(2)
    expect(showHighlight).toBe(1)
    expect(hide).toBe(2)

    await commands.shouldHide()
    expect(show).toBe(2)
    expect(showHighlight).toBe(1)
    expect(hide).toBe(3)

    await commands.shouldShow()
    expect(show).toBe(3)
    expect(showHighlight).toBe(1)
    expect(hide).toBe(3)

    await commands.shouldHide()
    expect(show).toBe(3)
    expect(showHighlight).toBe(1)
    expect(hide).toBe(4)

    await commands.shouldHighlight()
    expect(show).toBe(3)
    expect(showHighlight).toBe(2)
    expect(hide).toBe(4)

    await commands.shouldHide()
    expect(show).toBe(3)
    expect(showHighlight).toBe(2)
    expect(hide).toBe(5)
  })
  it('allows retriggering of list show event', async function() {
    let show = 0
    commands.onShouldShow(function() {
      show++
    })
    await commands.shouldShow()
    await commands.shouldShow()
    await commands.shouldShow()
    await commands.shouldShow()
    await commands.shouldShow()
    expect(show).toBe(5)
  })
  // it('has shouldShow and shouldHighlight accepting promises', function() {
  it('has shouldShow that accepts a resolving promise', async function() {
    commands.onShouldShow(function(e) {
      e.show = true
    })
    await commands.shouldShow()
    expect(commands.active !== null).toBe(true)
  })
  it('has shouldShow that accepts a rejecting promise', async function() {
    commands.onShouldShow(function(e) {
      e.show = false
    })
    await commands.shouldShow()
    expect(commands.active === null).toBe(true)
  })
  it('has shouldHighlight that accepts a resolving promise', async function() {
    commands.onShouldHighlight(function(e) {
      e.show = true
    })
    await commands.shouldHighlight()
    expect(commands.active !== null).toBe(true)
  })
  it('has shouldHighlight that accepts a rejecting promise', async function() {
    commands.onShouldHighlight(function(e) {
      e.show = false
    })
    await commands.shouldHighlight()
    expect(commands.active === null).toBe(true)
  })
  it('ignores enter key when list is active', async function() {
    let show = 0
    let hide = 0
    commands.onShouldShow(function(e) {
      show++
      e.show = true
    })
    commands.onShouldHide(function() {
      hide++
    })
    await commands.shouldShow()
    expect(show).toBe(1)
    expect(hide).toBe(0)
    triggerKeyboardEvent(editorView, 13)
    expect(show).toBe(1)
    expect(hide).toBe(0)
    triggerKeyboardEvent(editorView, 13)
    expect(show).toBe(1)
    expect(hide).toBe(0)
    triggerKeyboardEvent(editorView, 14)
    expect(show).toBe(1)
    expect(hide).toBe(1)
  })
  it('properly emits should-hide after being activated as highlight', async function() {
    let highlight = 0
    let hide = 0
    commands.onShouldHighlight(function(e) {
      highlight++
      e.show = true
    })
    commands.onShouldHide(function() {
      hide++
    })
    await commands.shouldHighlight()
    expect(highlight).toBe(1)
    expect(hide).toBe(0)
    await commands.shouldHighlight()
    expect(highlight).toBe(1)
    expect(hide).toBe(0)
    await commands.shouldHighlight()
    expect(highlight).toBe(1)
    expect(hide).toBe(0)
    commands.disposeActive()
    await commands.shouldHighlight()
    expect(highlight).toBe(2)
    expect(hide).toBe(0)
    triggerKeyboardEvent(editorView, 38, 'keyup')
    expect(highlight).toBe(2)
    expect(hide).toBe(1)
  })
  it('dismisses list on click', async function() {
    let show = 0
    let hide = 0
    commands.onShouldShow(function(e) {
      show++
      e.show = true
    })
    commands.onShouldHide(function() {
      hide++
    })
    await commands.shouldShow()
    expect(show).toBe(1)
    expect(hide).toBe(0)
    editorView.dispatchEvent(new MouseEvent('mousedown'))
    expect(show).toBe(1)
    expect(hide).toBe(1)
  })
})
