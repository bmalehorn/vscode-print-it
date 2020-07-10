import * as vscode from "vscode";
import { render } from "micromustache";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("print-it.PrintIt", printIt)
  );
}

// this method is called when your extension is deactivated
// eslint-disable-next-line
export function deactivate() {}

async function printIt() {
  const currentEditor = vscode.window.activeTextEditor;
  if (!currentEditor) {
    return;
  }
  const sel = currentEditor.selection;
  const len = sel.end.character - sel.start.character;

  const range =
    len === 0
      ? currentEditor.document.getWordRangeAtPosition(sel.anchor)
      : new vscode.Range(sel.start, sel.end);

  if (range === undefined) {
    throw new Error("NO_WORD");
  }
  const doc = currentEditor.document;
  const lineNumber = range.start.line;
  const item = doc.getText(range);

  const idx = doc.lineAt(lineNumber).firstNonWhitespaceCharacterIndex;
  const ind = doc.lineAt(lineNumber).text.substring(0, idx);
  const line = lineNumber;
  const lastLine = doc.lineCount - 1 === lineNumber;

  const scope = {
    escaped: escaped(item, currentEditor.document.languageId),
    raw: item,
  };
  let template = vscode.workspace
    .getConfiguration("print-it")
    .get<string>(`${currentEditor.document.languageId}.template`);
  if (!template) {
    // fallback = javascript
    template = 'console.log("{{escaped}}", {{raw}});';
  }
  const txt = render(template, scope);

  let nxtLine: vscode.TextLine;
  let nxtLineInd: string;

  if (!lastLine) {
    nxtLine = doc.lineAt(line + 1);
    nxtLineInd = nxtLine.text.substring(
      0,
      nxtLine.firstNonWhitespaceCharacterIndex
    );
  } else {
    nxtLineInd = "";
  }
  await currentEditor.edit((e) => {
    e.insert(
      new vscode.Position(line, doc.lineAt(line).range.end.character),
      "\n".concat(nxtLineInd > ind ? nxtLineInd : ind, txt)
    );
  });

  currentEditor.selection = sel;
}

function escaped(selection: string, languageId: string): string {
  switch (languageId) {
    // fallback = javascript
    default:
      return selection.replace(/"/g, `\\"`);

    case "ruby":
    case "erb":
    case "elixir":
      return selection.replace(/"/g, `\\"`).replace(/#/g, "\\#");

    case "php":
      return selection.replace(/"/g, `\\"`).replace(/\$/g, "\\$");

    case "shellscript":
      return selection.replace(/'/g, `'"'"'`);
  }
}
