/* @flow */
import "module-alias/register"

import { ListElement } from "../dist/elements/list"
import { createSuggestion } from "./helpers"
import { createMutable } from "solid-js"
import { render } from "solid-js/web"

describe("Intentions list element", function () {
  it("has a complete working lifecycle", function () {
    const rootElement = document.createElement("div")

    const suggestions = [
      createSuggestion("Suggestion 1", jasmine.createSpy("suggestion.selected.0"), "someClass", "someIcon"),
      createSuggestion("Suggestion 2", jasmine.createSpy("suggestion.selected.1")),
      createSuggestion("Suggestion 3", jasmine.createSpy("suggestion.selected.2"), "anotherClass"),
    ]
    const selectCallback = jasmine.createSpy("suggestion.selected")
    const props = createMutable({ suggestions, selectCallback, movement: "move-to-top" })

    render(() => ListElement(props), rootElement)

    const intentionList = rootElement.querySelector("#intentions-list")
    const olElement = intentionList.firstElementChild

    expect(olElement.children.length).toBe(3)
    expect(olElement.children[0].textContent).toBe("Suggestion 1")
    expect(olElement.children[1].textContent).toBe("Suggestion 2")
    expect(olElement.children[2].textContent).toBe("Suggestion 3")
    expect(olElement.children[0].children[0].className).toBe("someClass icon icon-someIcon")
    expect(olElement.children[2].children[0].className).toBe("anotherClass")

    props.movement = "down"

    expect(suggestions[0].title).toBe(olElement.children[0].textContent)

    props.movement = "down"

    expect(suggestionsIndex).toBe(1)
    expect(suggestions[1].title).toBe(olElement.children[1].textContent)

    props.movement = "down"

    expect(suggestions[2].title).toBe(olElement.children[2].textContent)

    props.movement = "up"

    expect(suggestions[1].title).toBe(olElement.children[1].textContent)

    props.movement = "up"

    expect(suggestions[0].title).toBe(olElement.children[0].textContent)

    props.movement = "up"

    expect(suggestions[2].title).toBe(olElement.children[2].textContent)

    olElement.children[1].children[0].dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
      })
    )
    expect(selectCallback).toHaveBeenCalledWith(suggestions[1])
  })
})
