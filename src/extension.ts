import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "selected-variable-into-console-log" is now active!'
  );

  const disposable = vscode.commands.registerCommand(
    "selected-variable-into-console-log.insertConsoleLog",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor!");
        return;
      }

      const document = editor.document;
      const selection = editor.selection;
      const selectedVariable = document.getText(selection).trim();

      const clipboardText = (await vscode.env.clipboard.readText()).trim();

      let variableToLog = "HERE";

      if (selectedVariable) {
        variableToLog = selectedVariable;
      } else if (clipboardText) {
        variableToLog = clipboardText;
      }

      const line = document.lineAt(selection.end.line);
      const indentation = line.text.match(/^\s*/)?.[0] ?? "";

      const logStatement = `${indentation}console.log('${variableToLog}', ${variableToLog});`;

      editor.edit((editBuilder) => {
        editBuilder.insert(line.range.end, "\n" + logStatement);
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}