# Change Log

## 0.1.9 (2023-10-12)

- Ignore leading / trailing whitespace on selection

## 0.1.8 (2023-10-10)

- Fix #7, #11: Rendering a string like `{{{raw}}}` would confuse the formatter, and there was no way to escape `{` and `}` as a workaround. Fix this by replacing the formatter with a simple find-and-replace of the strings `{{raw}}` and `{{escaped}}`.

## 0.1.7 (2023-10-03)

- Add `print-it.html.template` option, which uses javascript syntax

## 0.1.6 (2023-02-17)

- Update badge URLs
- Fix launch.json for debugging this extension

## 0.1.5 (2021-06-08)

- Update demo.gif for Mac
- Reorder supported languages

## 0.1.4 (2020-08-30)

- Add `print-it.default.template` for all other languages

## 0.1.3 (2020-07-10)

- Vue, Rust, Dart, C++, PHP, Java, Kotlin, C#, Elixir: added support
- Ruby: Now `pp "variable"` instead of `pp 'variable'` for consistency

## 0.1.2 (2020-07-03)

- Refactored

## 0.1.1 (2020-07-02)

- Python, Ruby, Erb: fix default template string causing "raw" to appear in output

## 0.1.0 (2020-07-02)

- Added configuration options `print-it.javascript.template`, `print-it.python.template`, etc.
- Shellscript, Fish: changed default to print variable, not eval command

## 0.0.4

- Python, Ruby, Go, Bash, Fish: improved quote escaping
- Erb: added support

## 0.0.3

- Update shortcut in README

## 0.0.2

- Added icon

## 0.0.1

- Initial release
