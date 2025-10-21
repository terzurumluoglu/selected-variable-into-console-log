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

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      let logStatement = `
      console.log(object);`;

      if (text) {
        logStatement = `
        console.log('${text}', ${text});`;
      }

      // if (!text) {
      //   vscode.window.showWarningMessage("No text selected!");
      //   return;
      // }

      editor.edit((editBuilder) => {
        const line = selection.end.line;
        editBuilder.insert(
          new vscode.Position(line + 1, 0),
          `\n${logStatement}\n`
        );
      });

      vscode.window.showInformationMessage(`Inserted console.log(${text})`);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
