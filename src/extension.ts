import * as vscode from "vscode";
import { render } from "micromustache";

interface WrapData {
  txt: string;
  item: string;
  sel: vscode.Selection;
  doc: vscode.TextDocument;
  ran: vscode.Range;
  ind: string;
  idx: number;
  line: number;
  lastLine: boolean;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("print-it.PrintIt", printIt)
  );
}

// this method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}

async function printIt() {
  const currentEditor = vscode.window.activeTextEditor;
  if (!currentEditor) {
    return;
  }
  const sel = currentEditor.selection;
  const len = sel.end.character - sel.start.character;

  const ran =
    len === 0
      ? currentEditor.document.getWordRangeAtPosition(sel.anchor)
      : new vscode.Range(sel.start, sel.end);

  if (ran === undefined) {
    throw new Error("NO_WORD");
  }
  const doc = currentEditor.document;
  const lineNumber = ran.start.line;
  const item = doc.getText(ran);

  const idx = doc.lineAt(lineNumber).firstNonWhitespaceCharacterIndex;
  const ind = doc.lineAt(lineNumber).text.substring(0, idx);
  const wrapData: WrapData = {
    txt: "",
    item,
    doc,
    ran,
    idx,
    ind,
    line: lineNumber,
    sel,
    lastLine: doc.lineCount - 1 === lineNumber,
  };
  const scope = {
    escaped: escaped(wrapData.item, currentEditor.document.languageId),
    raw: wrapData.item,
  };
  let template = vscode.workspace
    .getConfiguration("print-it")
    .get<string>(`${currentEditor.document.languageId}.template`);
  if (!template) {
    // fallback = javascript
    template = 'console.log("{{escaped}}", {{raw}});';
  }
  wrapData.txt = render(template, scope);

  let nxtLine: vscode.TextLine;
  let nxtLineInd: string;

  if (!wrapData.lastLine) {
    nxtLine = wrapData.doc.lineAt(wrapData.line + 1);
    nxtLineInd = nxtLine.text.substring(
      0,
      nxtLine.firstNonWhitespaceCharacterIndex
    );
  } else {
    nxtLineInd = "";
  }
  await currentEditor.edit((e) => {
    e.insert(
      new vscode.Position(
        wrapData.line,
        wrapData.doc.lineAt(wrapData.line).range.end.character
      ),
      "\n".concat(
        nxtLineInd > wrapData.ind ? nxtLineInd : wrapData.ind,
        wrapData.txt
      )
    );
  });

  currentEditor.selection = wrapData.sel;
}

function escaped(selection: string, languageId: string): string {
  switch (languageId) {
    case "javascript":
    case "typescript":
    case "typescriptreact":
    case "javascriptreact":
    case "python":
    case "go":
    case "fish":
    // fallback = javascript
    default:
      return selection.replace(/"/g, `\\"`);

    case "ruby":
    case "erb":
      return selection.replace(/'/g, `\\'`);

    case "shellscript":
      return selection.replace(/'/g, `'"'"'`);
  }
}
