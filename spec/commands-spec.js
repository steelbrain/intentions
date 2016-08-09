/* @flow */

import { CompositeDisposable, Disposable } from 'sb-event-kit'
import { it, beforeEach, wait } from 'jasmine-fix'
import Commands from '../lib/commands'
import { getKeyboardEvent } from './helpers'

describe('Commands', function() {
  let commands
  let editorView

  beforeEach(async function() {
    commands = new Commands()
    commands.activate()
    await atom.workspace.open(__filename)
    editorView = atom.views.getView(atom.workspace.getActiveTextEditor())
  })
  afterEach(function() {
    atom.workspace.destroyActivePane()
    commands.dispose()
  })

  describe('Highlights', function() {
    it('does nothing if not activated and we try to deactivate', function() {
      commands.processHighlightsHide()
    })
    it('does not activate unless provider tells it to', async function() {
      let timesShow = 0
      let timesHide = 0
      commands.onHighlightsShow(function() {
        ++timesShow
        return Promise.resolve(false)
      })
      commands.onHighlightsHide(function() {
        ++timesHide
      })
      await commands.processHighlightsShow()
      await commands.processHighlightsHide()

      expect(timesShow).toBe(1)
      expect(timesHide).toBe(0)
    })
    it('activates when the provider tells it to', async function() {
      let timesShow = 0
      let timesHide = 0
      commands.onHighlightsShow(function() {
        ++timesShow
        return Promise.resolve(true)
      })
      commands.onHighlightsHide(function() {
        ++timesHide
      })
      await commands.processHighlightsShow()
      await commands.processHighlightsHide()

      expect(timesShow).toBe(1)
      expect(timesHide).toBe(1)
    })
    it('ignores if already highlighted', async function() {
      let timesShow = 0
      let timesHide = 0
      commands.onHighlightsShow(function() {
        ++timesShow
        return Promise.resolve(true)
      })
      commands.onHighlightsHide(function() {
        ++timesHide
      })
      await commands.processHighlightsShow()
      await commands.processHighlightsShow()
      await commands.processHighlightsShow()
      await commands.processHighlightsHide()
      await commands.processHighlightsHide()
      await commands.processHighlightsHide()

      expect(timesShow).toBe(1)
      expect(timesHide).toBe(1)
    })
    it('disposes list if available', async function() {
      let disposed = false
      const active = { type: 'list', subscriptions: new CompositeDisposable() }
      active.subscriptions.add(new Disposable(function() {
        disposed = true
      }))
      commands.active = active
      expect(disposed).toBe(false)
      await commands.processHighlightsShow()
      expect(disposed).toBe(true)
    })
    it('adds and removes classes appropriately', async function() {
      commands.onHighlightsShow(function() {
        return Promise.resolve(true)
      })
      expect(editorView.classList.contains('intentions-highlights')).toBe(false)
      await commands.processHighlightsShow()
      expect(editorView.classList.contains('intentions-highlights')).toBe(true)
      await commands.processHighlightsHide()
      expect(editorView.classList.contains('intentions-highlights')).toBe(false)
    })
    describe('command listener', function() {
      it('just activates if theres no keyboard event attached', async function() {
        let timesShow = 0
        let timesHide = 0
        commands.onHighlightsShow(function() {
          ++timesShow
          return Promise.resolve(true)
        })
        commands.onHighlightsHide(function() {
          ++timesHide
        })
        expect(timesShow).toBe(0)
        expect(timesHide).toBe(0)
        atom.commands.dispatch(editorView, 'intentions:highlight')
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        document.body.dispatchEvent(getKeyboardEvent('keyup'))
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        commands.processHighlightsHide()
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
      })
      it('just activates if keyboard event is not keydown', async function() {
        let timesShow = 0
        let timesHide = 0
        commands.onHighlightsShow(function() {
          ++timesShow
          return Promise.resolve(true)
        })
        commands.onHighlightsHide(function() {
          ++timesHide
        })
        expect(timesShow).toBe(0)
        expect(timesHide).toBe(0)
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, getKeyboardEvent('keypress'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        document.body.dispatchEvent(getKeyboardEvent('keyup'))
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        commands.processHighlightsHide()
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
      })
      it('does not deactivate if keyup is not same keycode', async function() {
        let timesShow = 0
        let timesHide = 0
        commands.onHighlightsShow(function() {
          ++timesShow
          return Promise.resolve(true)
        })
        commands.onHighlightsHide(function() {
          ++timesHide
        })
        expect(timesShow).toBe(0)
        expect(timesHide).toBe(0)
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, getKeyboardEvent('keydown'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        document.body.dispatchEvent(getKeyboardEvent('keyup', 1))
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        commands.processHighlightsHide()
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
      })
      it('does deactivate if keyup is the same keycode', async function() {
        let timesShow = 0
        let timesHide = 0
        commands.onHighlightsShow(function() {
          ++timesShow
          return Promise.resolve(true)
        })
        commands.onHighlightsHide(function() {
          ++timesHide
        })
        expect(timesShow).toBe(0)
        expect(timesHide).toBe(0)
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, getKeyboardEvent('keydown'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        document.body.dispatchEvent(getKeyboardEvent('keyup'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
        commands.processHighlightsHide()
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
      })
    })
  })
})
