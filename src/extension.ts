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

      // 1️⃣ Clipboard'ı oku
      const clipboardText = (await vscode.env.clipboard.readText()).trim();

      // 2️⃣ Hangi değeri loglayacağız?
      let variableToLog = "HERE";

      if (selectedVariable) {
        variableToLog = selectedVariable;
      } else if (clipboardText) {
        variableToLog = clipboardText;
      }

      // 3️⃣ Mevcut satır için indentation hesapla
      const line = document.lineAt(selection.end.line);
      const indentation = line.text.match(/^\s*/)?.[0] ?? "";

      // 4️⃣ Log satırını oluştur
      const logStatement = `${indentation}console.log('${variableToLog}', ${variableToLog});`;

      // 5️⃣ Edit işlemi
      editor.edit((editBuilder) => {
        editBuilder.insert(line.range.end, "\n" + logStatement);
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}