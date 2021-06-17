### 2.1.1

- Warn the users about using old Atom and point them to https://atom.io/

### 2.1.0

- Convert to TypeScript :tada: (#88)
- Convert the intentions list to Solid-js :tada: (#90)

**Bug fixes**

- Improve the load-time and run-time performance by using Parcel and Solid-js (#90)
- Update dependencies (#88, #90)
- Preserve the original scopes of the editor (#88)
- Other miscellaneous changes (#88, #89, #90)

### 2.0.0

**Bug Fixes**

- Allow selecting the underlying text when the intentions are highlighted (#85)
- Fix the error with invalid points (#81)
- Unify the keyboard shortcuts on all operating systems (#87):
  - Use <kbd>ALT</kbd>+<kbd>ENTER</kbd> to open the intensions list and press <kbd>ENTER</kbd> (or select by mouse) to choose the action.
  - To see the all available actions hold <kbd>CTRL</kbd> (<kbd>⌘</kbd> on macOS).
- Update dependencies (#75, #80, #81)

**Breaking Change**

- keyboard shortcut on macOS is now the same as other operating systems (#87)

#### 1.1.5

- Remove cache introduced in v1.1.3

#### 1.1.4

- Fix a regression from last release

#### 1.1.3

- Cache results until editor text is changed
- Fix a bug where clicking on the list would not fire the callback
- Fix another instance where mixing clicks + keyboard would break the list (Fixes #26)

#### 1.1.2

- Handle double activations gracefully (Fixes #26)
- Add specs for fixes in current and last release

#### 1.1.1

- Fix movement with navigation keys

#### 1.1.0

- Do not overwrite to `.class` on list intentions
- Any other unmentioned commands related bugs previously present
- Use the core movement commands (eg. `core:move-up` `core:move-to-top`, `core:page-up`) to control the intentions list
- Fix a bug where you would have a highlights jam if you clicked on a highlight and it opened a new editor and the keyup event was on that instead of the source

#### 1.0.5

- Change OSX keybinding from `cmd` to `alt` again to match IntelliJ IDEs

#### 1.0.4

- Change OSX keybinding from `alt` to `cmd`

#### 1.0.3

- Automatically update higlight decoration lengths instead of making API consumers do that

#### 1.0.2

- Fix compatibility with fonts using ligas

#### 1.0.1

- Minor UI tweak in menu
- Dismiss menu on mouse click

#### 1.0.0

- Improved package stability and performance
- Rewrote intentions:list providers implementation
- Implemented intentions:highlight service

#### Pre 1.0.0

- Initial API implemented
