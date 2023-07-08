import * as vscode from 'vscode'
import { ChatPanel } from './ChatPanel'
import { SidebarProvider } from './SidebarProvider'
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
	context.subscriptions.push(
		vscode.commands.registerCommand('code-assistant.renew', async () => {
			// ChatPanel.kill()
			// ChatPanel.createOrShow(context.extensionUri)
			await vscode.commands.executeCommand("workbench.action.closeSidebar");
			await vscode.commands.executeCommand("workbench.view.extension.chat-assistant-sidebar-view");
			setTimeout(
				() => vscode.commands.executeCommand('workbench.action.webview.openDeveloperTools'),
				500
			)
		})
	)

	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider(
		"chat-assistant-sidebar",
		sidebarProvider
	  )
	);




}

// This method is called when your extension is deactivated
export function deactivate() {}
