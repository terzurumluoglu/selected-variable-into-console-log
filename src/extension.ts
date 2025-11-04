import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "selected-variable-into-console-log" is now active!'
  );

  const disposable = vscode.commands.registerCommand(
    "selected-variable-into-console-log.insertConsoleLog",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor!");
        return;
      }

      const document = editor.document;
      const selection = editor.selection;
      const selectedVariable = document.getText(selection);

      const line = document.lineAt(selection.end.line);
      const indentation = line.text.match(/^\s*/)?.[0] ?? '';

      let logStatement = "console.log(object);";

      if (selectedVariable) {
        logStatement = `console.log('${selectedVariable}', ${selectedVariable});`;
      }

      logStatement = indentation + logStatement;

      editor.edit((editBuilder) => {
        editBuilder.insert(line.range.end, "\n" + logStatement);
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
