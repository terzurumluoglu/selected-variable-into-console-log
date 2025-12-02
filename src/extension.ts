import { ExtensionContext, commands, window, env } from "vscode";

async function callback() {
  const editor = window.activeTextEditor;
  if (!editor) {
    window.showErrorMessage("No active editor!");
    return;
  }

  const {
    document: { getText, lineAt },
    selection,
  } = editor;

  const selectedVariable = getText(selection).trim();
  const clipboardText = (await env.clipboard.readText()).trim();

  let variableToLog = "HERE";

  if (selectedVariable) {
    variableToLog = selectedVariable;
  } else if (clipboardText) {
    variableToLog = clipboardText;
  }

  const line = lineAt(selection.end.line);
  const indentation = line.text.match(/^\s*/)?.[0] ?? "";

  const logStatement = `${indentation}console.log('${variableToLog}', ${variableToLog});`;

  editor.edit((editBuilder) => {
    editBuilder.insert(line.range.end, "\n" + logStatement);
  });
}

export function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand(
    "selected-variable-into-console-log",
    callback
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
