'use babel'

import * as Helpers from '../lib/helpers'
import {createSuggestion} from './common'

describe('Helpers', function() {
  describe('processSuggestions', function() {
    it('works', function() {
      let suggestions = [
        {
          priority: 100,
          title: 'title 1',
          class: 'class1',
          selected: function() {},
          icon: 'icon1'
        },
        {
          priority: 200,
          title: 'title 2',
          class: 'class2',
          selected: function() {}
        }
      ]
      suggestions = Helpers.processSuggestions(suggestions)
      expect(suggestions[0].priority).toBe(200)
      expect(suggestions[0].class).toBe('class2')
      expect(suggestions[1].priority).toBe(100)
      expect(suggestions[1].class).toBe('class1 icon icon-icon1')
    })
  })
  describe('showError', function() {
    it('works well with error objects', function() {
      const error = new Error('Something')
      Helpers.showError(error)
      const notification = atom.notifications.getNotifications()[0]
      expect(notification).toBeDefined()
      expect(notification.message).toBe('[Intentions] Something')
      expect(notification.options.detail).toBe(error.stack)
    })
    it('works well with strings', function() {
      const title = 'Some Title'
      const detail = 'Some Detail'

      Helpers.showError(title, detail)
      const notification = atom.notifications.getNotifications()[0]
      expect(notification).toBeDefined()
      expect(notification.message).toBe('[Intentions] ' + title)
      expect(notification.options.detail).toBe(detail)
    })
  })
  describe('disposableEvent', function() {
    it('properly binds events', function() {
      const element = document.createElement('div')
      const callback = jasmine.createSpy('callback')
      Helpers.disposableEvent(element, 'click', callback)
      expect(callback).not.toHaveBeenCalled()
      element.dispatchEvent(new MouseEvent('click'))
      expect(callback).toHaveBeenCalled()
    })
    it('properly unbinds events', function() {
      const element = document.createElement('div')
      const callback = jasmine.createSpy('callback')
      const disposable = Helpers.disposableEvent(element, 'click', callback)
      expect(callback).not.toHaveBeenCalled()
      disposable.dispose()
      element.dispatchEvent(new MouseEvent('click'))
      expect(callback).not.toHaveBeenCalled()
    })
  })
  describe('preventDefault', function() {
    it('works', function() {
      const e = {
        preventDefault: jasmine.createSpy('preventDefault'),
        stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation')
      }
      Helpers.preventDefault(e)
      expect(e.preventDefault).toHaveBeenCalled()
      expect(e.stopImmediatePropagation).toHaveBeenCalled()
    })
  })
})
