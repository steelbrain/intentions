# Intentions

[![CI](https://github.com/steelbrain/intentions/actions/workflows/CI.yml/badge.svg)](https://github.com/steelbrain/intentions/actions/workflows/CI.yml)

Intentions is a base package that provides an easy-to-use API to show intentions based in Atom.

#### Usage

- Use <kbd>ALT</kbd>+<kbd>ENTER</kbd> to open the intensions list and press <kbd>ENTER</kbd> (or select by mouse) to choose the action.
- To see the all available actions hold <kbd>CTRL</kbd> (<kbd>⌘</kbd> on macOS).

![intentions-list](https://user-images.githubusercontent.com/16418197/122294624-dd304100-cebd-11eb-9232-d015cde1516f.gif)

**Note**: This package does not work on older Atoms. You should install the **latest version of Atom** from:
https://atom.io/

#### APIs

Intentions provides two kinds of APIs, there's Intentions List API that allows you to add items
to intentions list. Here is what it looks like,

![Intentions List API](https://cloud.githubusercontent.com/assets/4278113/12488546/e73809ba-c08d-11e5-8038-dd222f3a815d.png)

The second type of API is highlight API. It allows packages to mark buffer ranges and do cool thing with them.
It can be jump-to-declaration click, show type on mouse move and show color as underline.
Here is what it looks like

![Intentions Highlight API](https://cloud.githubusercontent.com/assets/4278113/12878032/0f915ef2-ce3f-11e5-833e-be231abeda12.png)

You can find docs about both of these in [Intentions Wiki](https://github.com/steelbrain/intentions/wiki/Intentions-API)

#### License

This package is licensed under the terms of MIT License, see the license file for more info.
