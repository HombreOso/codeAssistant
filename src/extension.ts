import * as vscode from 'vscode'
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('code-assistant.aiPrompt', async () => {
			const name = await vscode.window.showInputBox({
				placeHolder: 'What is your name?',
			})
			vscode.window.showInformationMessage(`Hello ${name}!`)
		})
	)
}

// This method is called when your extension is deactivated
export function deactivate() {}
