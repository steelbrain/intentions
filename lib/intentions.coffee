IntentionsView = require './intentions-view'
{CompositeDisposable} = require 'atom'

module.exports = Intentions =
  intentionsView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @intentionsView = new IntentionsView(state.intentionsViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @intentionsView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'intentions:toggle': => @toggle()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @intentionsView.destroy()

  serialize: ->
    intentionsViewState: @intentionsView.serialize()

  toggle: ->
    console.log 'Intentions was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
