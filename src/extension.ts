import * as vscode from 'vscode'
import { ChatPanel } from './ChatPanel'
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('code-assistant.open', async () => {
			ChatPanel.createOrShow(context.extensionUri)
		})
	)
}

// This method is called when your extension is deactivated
export function deactivate() {}
