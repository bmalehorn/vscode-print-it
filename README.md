# VSCode Print It

[![version number](https://vsmarketplacebadge.apphb.com/version-short/bmalehorn.print-it.svg)](https://marketplace.visualstudio.com/items?itemName=bmalehorn.print-it)
[![install count](https://vsmarketplacebadge.apphb.com/installs-short/bmalehorn.print-it.svg)](https://marketplace.visualstudio.com/items?itemName=bmalehorn.print-it)

Add print statements in one keystroke!

`Option + [` / `Alt + [`: wrap print statement

## Demo

![demo](demo.gif)

## Supported Languages

| language                | example                                  |
| ----------------------- | ---------------------------------------- |
| JavaScript / TypeScript | `console.log("variable", variable);`     |
| Python                  | `print("variable", variable)`            |
| Ruby                    | `pp('variable', variable)`               |
| Ruby (Erb)              | `<% pp('variable', variable) %>`         |
| Go                      | `fmt.Printf("variable %#v\n", variable)` |
| Bash                    | `echo 'ls -a' "$(ls -a)"`                |
| Fish                    | `echo 'ls -a' (ls -a)`                   |

## Related Projects

- [Wrap Console Log Simple](https://marketplace.visualstudio.com/items?itemName=WooodHead.vscode-wrap-console-log-simple)
- [Wrap Console Log](https://marketplace.visualstudio.com/items?itemName=midnightsyntax.vscode-wrap-console-log)
