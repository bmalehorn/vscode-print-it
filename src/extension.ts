import * as vscode from "vscode";

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
export function deactivate() {}

async function printIt() {
  const currentEditor = vscode.window.activeTextEditor;
  if (!currentEditor) {
    return;
  }
  let sel = currentEditor.selection;
  let len = sel.end.character - sel.start.character;
  let wrapData: WrapData;

  let ran =
    len === 0
      ? currentEditor.document.getWordRangeAtPosition(sel.anchor)
      : new vscode.Range(sel.start, sel.end);

  if (ran === undefined) {
    throw new Error("NO_WORD");
  }
  let doc = currentEditor.document;
  let lineNumber = ran.start.line;
  let item = doc.getText(ran);

  let idx = doc.lineAt(lineNumber).firstNonWhitespaceCharacterIndex;
  let ind = doc.lineAt(lineNumber).text.substring(0, idx);
  wrapData = {
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
  wrapData.txt = wrap(wrapData.item, currentEditor.document.languageId);
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

// TODO: configure wrapping function per-language
function wrap(selection: string, languageId: string): string {
  switch (languageId) {
    case "javascript":
    case "typescript":
    case "typescriptreact":
    case "javascriptreact":
    default:
      return `console.log("${selection.replace(/"/g, `\\"`)}", ${selection});`;

    case "python":
      return `print("${selection.replace(/"/g, `\\"`)}", ${selection})`;

    case "ruby":
      return `pp('${selection.replace(/'/g, `\\'`)}', ${selection})`;

    case "erb":
      return `<% pp('${selection.replace(/'/g, `\\'`)}', ${selection}) %>`;

    case "go":
      return `fmt.Printf("${selection.replace(
        /"/g,
        `\\"`
      )} %#v\\n", ${selection})`;

    case "shellscript":
      return `echo '${selection.replace(/'/g, `'"'"'`)}' "$(${selection})"`;

    case "fish":
      return `echo '${selection.replace(/'/g, `\\'`)}' (${selection})`;
  }
}
