import * as vscode from 'vscode'
import { ChatPanel } from './ChatPanel'
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('code-assistant.open', () => {
			ChatPanel.createOrShow(context.extensionUri)
		})
	)
	context.subscriptions.push(
		vscode.commands.registerCommand('code-assistant.refresh', () => {
			ChatPanel.kill()
			ChatPanel.createOrShow(context.extensionUri)
			setTimeout(
				() => vscode.commands.executeCommand('workbench.action.webview.openDeveloperTools'),
				500
			)
		})
	)
}

// This method is called when your extension is deactivated
export function deactivate() {}
