import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { render, escaped } from "../../extension";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", () => {
    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));
  });

  test("escape basics", () => {
    assert.equal(escaped("var", "javascript"), "var");
  });

  test("escape strings", () => {
    assert.equal(
      escaped('"foo" + "bar"', "javascript"),
      '\\"foo\\" + \\"bar\\"'
    );
  });

  test("render basics", () => {
    const raw = "var";
    assert.equal(
      render('print("{{escaped}} =", {{raw}})', {
        raw,
        escaped: escaped(raw, "python"),
      }),
      'print("var =", var)'
    );
  });

  test("render with escaping", () => {
    const raw = 'var + "foobar"';
    assert.equal(
      render('print("{{escaped}} =", {{raw}})', {
        raw,
        escaped: escaped(raw, "python"),
      }),
      'print("var + \\"foobar\\" =", var + "foobar")'
    );
  });

  test("render with python f-string", () => {
    const raw = 'var + "foobar"';
    assert.equal(
      render("print(f'{{{raw}}=}')", {
        raw,
        escaped: escaped(raw, "python"),
      }),
      "print(f'{var + \"foobar\"=}')"
    );
  });
});
