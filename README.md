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
| Bash                    | `echo "variable $variable"`              |
| Fish                    | `echo "variable $variable"`              |

## Templating

Want to change the default formatting? Set the configuration option `print-it.[language].template`:

```jsonc
  "print-it.javascriptreact.template": "console.log(\"The value of {{escaped}} is:\", {{raw}});"
```

This will make new print statements look like this:

```jsx
console.log("The value of variable is:", variable);
```

A full list of supported options available under the "Contributions" tab.

The following variables are available:

| variable      | example             | exaplanation                           |
| ------------- | ------------------- | -------------------------------------- |
| `{{raw}}`     | `"hello " + name`   | the current selection, or current word |
| `{{escaped}}` | `\"hello \" + name` | `raw`, but escaped for use in a string |

## Related Projects

- [Wrap Console Log Simple](https://marketplace.visualstudio.com/items?itemName=WooodHead.vscode-wrap-console-log-simple)
- [Wrap Console Log](https://marketplace.visualstudio.com/items?itemName=midnightsyntax.vscode-wrap-console-log)
