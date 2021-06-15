import disposableEvent from "disposable-event"
import { CompositeDisposable, Disposable, Emitter } from "sb-event-kit"
import type { TextEditor } from "atom"

import type { ListMovement } from "./types"
import type { CommandEventExtended } from "./types/atom"
import { TargetWithAddEventListener } from "disposable-event/src/target"

// NOTE:
// We don't *need* to add the intentions:hide command
// But we're doing it anyway because it helps us keep the code clean
// And can also be used by any other package to fully control this package
// List of core commands we allow during the list, everything else closes it
const CORE_COMMANDS = new Set([
  "core:move-up",
  "core:move-down",
  "core:page-up",
  "core:page-down",
  "core:move-to-top",
  "core:move-to-bottom",
])

type ShowListEvent = {
  show: boolean
  editor: TextEditor
}

export default class Commands {
  active:
    | {
        type: "list" | "highlight"
        subscriptions: CompositeDisposable
      }
    | null
    | undefined
  emitter: Emitter
  subscriptions: CompositeDisposable

  constructor() {
    this.active = null
    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(this.emitter)
  }

  activate() {
    this.subscriptions.add(
      atom.commands.add("atom-text-editor:not([mini])", {
        "intentions:show": (e: CommandEventExtended) => {
          if (this.active && this.active.type === "list") {
            return
          }

          const subscriptions = new CompositeDisposable()
          this.processListShow(subscriptions)

          if (!e.originalEvent || e.originalEvent.type !== "keydown") {
            return
          }

          setImmediate(() => {
            let matched = true
            subscriptions.add(
              atom.keymaps.onDidMatchBinding(function ({ binding }) {
                matched = matched && CORE_COMMANDS.has(binding.command)
              })
            )
            subscriptions.add(
              disposableEvent(document.body as unknown as TargetWithAddEventListener, "keyup", () => {
                if (matched) {
                  return
                }

                subscriptions.dispose()
                this.processListHide()
              })
            )
          })
        },
        "intentions:hide": () => {
          this.processListHide()
        },
        "intentions:highlight": (e: CommandEventExtended<KeyboardEvent>) => {
          if (this.active && this.active.type === "highlight") {
            return
          }
          e.abortKeyBinding()
          const subscriptions = new CompositeDisposable()
          this.processHighlightsShow(subscriptions)

          if (!e.originalEvent || e.originalEvent.type !== "keydown") {
            return
          }

          const { keyCode } = e.originalEvent
          subscriptions.add(
            disposableEvent(document.body as unknown as TargetWithAddEventListener, "keyup", (upE: KeyboardEvent) => {
              if (upE.keyCode !== keyCode) {
                return
              }

              subscriptions.dispose()
              this.processHighlightsHide()
            })
          )
        },
      })
    )
    this.subscriptions.add(
      atom.commands.add("atom-text-editor.intentions-list:not([mini])", {
        "intentions:confirm": this.stoppingEvent(() => {
          this.processListConfirm()
        }),
        "core:move-up": this.stoppingEvent(() => {
          this.processListMove("up")
        }),
        "core:move-down": this.stoppingEvent(() => {
          this.processListMove("down")
        }),
        "core:page-up": this.stoppingEvent(() => {
          this.processListMove("page-up")
        }),
        "core:page-down": this.stoppingEvent(() => {
          this.processListMove("page-down")
        }),
        "core:move-to-top": this.stoppingEvent(() => {
          this.processListMove("move-to-top")
        }),
        "core:move-to-bottom": this.stoppingEvent(() => {
          this.processListMove("move-to-bottom")
        }),
      })
    )
  }

  stoppingEvent(callback: (event: Event) => any): (event: Event) => void {
    return (event: Event) => {
      event.stopImmediatePropagation()
      callback.call(this, event)
    }
  }

  async processListShow(subscription: (CompositeDisposable | Disposable) | null | undefined = null) {
    if (this.active) {
      switch (this.active.type) {
        case "list":
          throw new Error("Already active")

        case "highlight":
          this.processHighlightsHide()
          break

        default:
      }
    }

    const editor = atom.workspace.getActiveTextEditor()

    if (!editor) {
      return
    }

    const editorElement = atom.views.getView(editor)
    const subscriptions = new CompositeDisposable()

    if (subscription) {
      subscriptions.add(subscription)
    }

    if (!(await this.shouldListShow(editor))) {
      return
    }

    this.active = {
      type: "list",
      subscriptions,
    }
    subscriptions.add(() => {
      if (this.active && this.active.type === "list" && this.active.subscriptions === subscriptions) {
        this.processListHide()
        this.active = null
      }

      editorElement.classList.remove("intentions-list")
    })
    subscriptions.add(
      disposableEvent(document.body as unknown as TargetWithAddEventListener, "mouseup", function () {
        setTimeout(function () {
          subscriptions.dispose()
        }, 10)
      })
    )
    editorElement.classList.add("intentions-list")
  }

  processListHide() {
    if (!this.active || this.active.type !== "list") {
      return
    }

    const { subscriptions } = this.active
    this.active = null
    subscriptions.dispose()
    this.emitter.emit("list-hide")
  }

  processListMove(movement: ListMovement) {
    if (!this.active || this.active.type !== "list") {
      return
    }

    this.emitter.emit("list-move", movement)
  }

  processListConfirm() {
    if (!this.active || this.active.type !== "list") {
      return
    }

    this.emitter.emit("list-confirm")
  }

  async processHighlightsShow(subscription: (CompositeDisposable | Disposable) | null | undefined = null) {
    if (this.active) {
      switch (this.active.type) {
        case "highlight":
          throw new Error("Already active")

        case "list":
          this.processListHide()
          break

        default:
      }
    }

    const editor = atom.workspace.getActiveTextEditor()

    if (!editor) {
      return
    }

    const editorElement = atom.views.getView(editor)
    const subscriptions = new CompositeDisposable()
    const shouldProcess = await this.shouldHighlightsShow(editor)

    if (subscription) {
      subscriptions.add(subscription)
    }

    if (!shouldProcess) {
      return
    }

    this.active = {
      type: "highlight",
      subscriptions,
    }
    subscriptions.add(() => {
      if (this.active && this.active.type === "highlight" && this.active.subscriptions === subscriptions) {
        this.processHighlightsHide()
      }

      editorElement.classList.remove("intentions-highlights")
    })
    editorElement.classList.add("intentions-highlights")
  }

  processHighlightsHide() {
    if (!this.active || this.active.type !== "highlight") {
      return
    }

    const { subscriptions } = this.active
    this.active = null
    subscriptions.dispose()
    this.emitter.emit("highlights-hide")
  }

  async shouldListShow(editor: TextEditor): Promise<boolean> {
    const event: ShowListEvent = {
      show: false,
      editor,
    }
    await this.emitter.emit("list-show", event)
    return event.show
  }

  async shouldHighlightsShow(editor: TextEditor): Promise<boolean> {
    const event = {
      show: false,
      editor,
    }
    await this.emitter.emit("highlights-show", event)
    return event.show
  }

  onListShow(callback: (editor: TextEditor) => Promise<boolean>) {
    return this.emitter.on("list-show", function (event: ShowListEvent) {
      return callback(event.editor).then(function (result) {
        event.show = Boolean(result)
      })
    })
  }

  onListHide(callback: () => any) {
    return this.emitter.on("list-hide", callback)
  }

  onListMove(callback: (movement: ListMovement) => any) {
    return this.emitter.on("list-move", callback)
  }

  onListConfirm(callback: () => any) {
    return this.emitter.on("list-confirm", callback)
  }

  onHighlightsShow(callback: (editor: TextEditor) => Promise<boolean>) {
    return this.emitter.on("highlights-show", function (event: ShowListEvent) {
      return callback(event.editor).then(function (result) {
        event.show = Boolean(result)
      })
    })
  }

  onHighlightsHide(callback: () => any) {
    return this.emitter.on("highlights-hide", callback)
  }

  dispose() {
    this.subscriptions.dispose()

    if (this.active) {
      this.active.subscriptions.dispose()
    }
  }
}
