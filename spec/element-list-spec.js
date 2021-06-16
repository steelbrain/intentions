/* @flow */
import "module-alias/register"

import { ListElement } from "../dist/elements/list"
import { createSuggestion } from "./helpers"
import { render } from "solid-js/web"

function getOlElement(suggestions) {
  const rootElement = document.createElement("div")

  const selectCallback = jasmine.createSpy("suggestion.selected")

  const { component, setMovement, setConfirmed } = ListElement({ suggestions, selectCallback, movement: "move-to-top" })

  render(() => component, rootElement)

  const intentionList = rootElement.querySelector("#intentions-list")
  olElement = intentionList.firstElementChild
  return { olElement, selectCallback, setMovement, setConfirmed }
}

export function click(elm: HTMLElement) {
  try {
    // @ts-ignore internal solid API
    elm.$$click(new MouseEvent("click"))
  } catch (e) {
    elm.click()
  }
}

const suggestions = [
  createSuggestion("Suggestion 1", jasmine.createSpy("suggestion.selected.0"), "someClass", "someIcon"),
  createSuggestion("Suggestion 2", jasmine.createSpy("suggestion.selected.1")),
  createSuggestion("Suggestion 3", jasmine.createSpy("suggestion.selected.2"), "anotherClass"),
]

describe("Intentions list element", function () {
  it("renders the list", () => {
    const { olElement } = getOlElement(suggestions)
    expect(olElement.children.length).toBe(3)
    expect(olElement.children[0].textContent).toBe("Suggestion 1")
    expect(olElement.children[1].textContent).toBe("Suggestion 2")
    expect(olElement.children[2].textContent).toBe("Suggestion 3")
    expect(olElement.children[0].children[0].className).toBe("someClass icon icon-someIcon")
    expect(olElement.children[2].children[0].className).toBe("anotherClass")
  })
  it("handles click", function () {
    const { olElement, selectCallback } = getOlElement(suggestions)
    click(olElement.children[1].children[0])
    expect(selectCallback).toHaveBeenCalledWith(suggestions[1])
  })
  it("handles movement", () => {
    const { olElement, setMovement } = getOlElement(suggestions)

    setMovement("down")

    expect(suggestions[0].title).toBe(olElement.children[0].textContent)

    setMovement("down")

    expect(suggestions[1].title).toBe(olElement.children[1].textContent)

    setMovement("down")

    expect(suggestions[2].title).toBe(olElement.children[2].textContent)

    setMovement("up")

    expect(suggestions[1].title).toBe(olElement.children[1].textContent)

    setMovement("up")

    expect(suggestions[0].title).toBe(olElement.children[0].textContent)

    setMovement("up")

    expect(suggestions[2].title).toBe(olElement.children[2].textContent)
  })
})
