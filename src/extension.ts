// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

enum Wrap {
  Inline,
  Down,
  Up,
}

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
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "print-it" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "print-it.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from Print It!");
    }
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "print-it.nameValue",
      (editor, edit) => handle(Wrap.Down, true, "nameValue")
    )
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

async function handle(target: Wrap, prefix?: boolean, type?: string) {
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
  } else {
    let doc = currentEditor.document;
    let lineNumber = ran.start.line;
    let item = doc.getText(ran);

    let idx = doc.lineAt(lineNumber).firstNonWhitespaceCharacterIndex;
    let ind = doc.lineAt(lineNumber).text.substring(0, idx);
    const funcName = getSetting("functionName");
    wrapData = {
      txt: getSetting("functionName"),
      item: item,
      doc: doc,
      ran: ran,
      idx: idx,
      ind: ind,
      line: lineNumber,
      sel: sel,
      lastLine: doc.lineCount - 1 === lineNumber,
    };
    const semicolon = getSetting("useSemicolon") ? ";" : "";
    if (type === "nameValue") {
      wrapData.txt =
        funcName +
        "('".concat(wrapData.item, "', ", wrapData.item, ")", semicolon);
    } else if (type === "arguments") {
      wrapData.txt =
        funcName +
        "('".concat(wrapData.item, "', ", "arguments", ")", semicolon);
    } else if (type === "get") {
      wrapData.txt = "const aaa = get(".concat(
        wrapData.item,
        ", '",
        "aaa",
        "', '')",
        semicolon
      );
    } else {
      wrapData.txt = funcName + "('".concat(wrapData.item, "')", semicolon);
    }
  }
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

function getSetting(setting: string) {
  return vscode.workspace.getConfiguration("wrap-console-log-simple")[setting];
}
