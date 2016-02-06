'use babel'

import {Commands} from '../lib/commands'
import {triggerKeyboardEvent} from './common'

describe('Commands', function() {
  let commands
  let editorView

  beforeEach(function() {
    if (commands) {
      commands.dispose()
    }
    commands = new Commands()
    commands.activate()
    atom.workspace.destroyActivePane()
    waitsForPromise(function() {
      return atom.workspace.open(__filename).then(function() {
        editorView = atom.views.getView(atom.workspace.getActiveTextEditor())
      })
    })
  })

  it('triggers show properly', function() {
    const listener = jasmine.createSpy('commands::show')
    commands.onShouldShow(listener)
    atom.commands.dispatch(editorView, 'intentions:show')
    expect(listener).toHaveBeenCalled()
  })
  it('triggers hide after show properly', function() {
    const listenerShow = jasmine.createSpy('commands::show')
    const listenerHide = jasmine.createSpy('commands::hide')
    commands.onShouldShow(listenerShow)
    commands.onShouldShow(function(e) {
      e.show = true
    })
    commands.onShouldHide(listenerHide)
    atom.commands.dispatch(editorView, 'intentions:show')
    expect(listenerShow).toHaveBeenCalled()
    expect(listenerHide).not.toHaveBeenCalled()
    atom.commands.dispatch(editorView, 'intentions:hide')
    expect(listenerHide).toHaveBeenCalled()
  })
  it('adds class after show and removes after hide', function() {
    commands.onShouldShow(function(e) {
      e.show = true
    })
    atom.commands.dispatch(editorView, 'intentions:show')
    expect(editorView.classList.contains('intentions-active')).toBe(true)
    atom.commands.dispatch(editorView, 'intentions:hide')
    expect(editorView.classList.contains('intentions-active')).toBe(false)
  })
  it('emits up and down events when its active and not when its inactive', function() {
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
    atom.commands.dispatch(editorView, 'intentions:show')
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
  it('emits shouldHighlight properly', function() {
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
    console.log('hello dolly')

    atom.commands.dispatch(editorView, 'intentions:show')
    expect(show).toBe(1)
    expect(showHighlight).toBe(0)
    expect(hide).toBe(0)

    atom.commands.dispatch(editorView, 'intentions:hide')
    expect(show).toBe(1)
    expect(showHighlight).toBe(0)
    expect(hide).toBe(1)

    atom.commands.dispatch(editorView, 'intentions:show')
    expect(show).toBe(2)
    expect(showHighlight).toBe(0)
    expect(hide).toBe(1)

    atom.commands.dispatch(editorView, 'intentions:highlight')
    expect(show).toBe(2)
    expect(showHighlight).toBe(0)
    expect(hide).toBe(1)

    atom.commands.dispatch(editorView, 'intentions:hide')
    expect(show).toBe(2)
    expect(showHighlight).toBe(0)
    expect(hide).toBe(2)

    atom.commands.dispatch(editorView, 'intentions:highlight')
    expect(show).toBe(2)
    expect(showHighlight).toBe(1)
    expect(hide).toBe(2)

    atom.commands.dispatch(editorView, 'intentions:show')
    expect(show).toBe(2)
    expect(showHighlight).toBe(1)
    expect(hide).toBe(2)

    atom.commands.dispatch(editorView, 'intentions:hide')
    expect(show).toBe(2)
    expect(showHighlight).toBe(1)
    expect(hide).toBe(3)

    atom.commands.dispatch(editorView, 'intentions:show')
    expect(show).toBe(3)
    expect(showHighlight).toBe(1)
    expect(hide).toBe(3)

    atom.commands.dispatch(editorView, 'intentions:hide')
    expect(show).toBe(3)
    expect(showHighlight).toBe(1)
    expect(hide).toBe(4)

    atom.commands.dispatch(editorView, 'intentions:highlight')
    expect(show).toBe(3)
    expect(showHighlight).toBe(2)
    expect(hide).toBe(4)

    atom.commands.dispatch(editorView, 'intentions:hide')
    expect(show).toBe(3)
    expect(showHighlight).toBe(2)
    expect(hide).toBe(5)
  })
})
