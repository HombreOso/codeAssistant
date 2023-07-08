import * as path from 'path'
import * as vscode from 'vscode'
import { getNonce } from './getNonce'
export class ChatPanel {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: ChatPanel | undefined

	private static readonly viewType = 'react'

	private readonly _panel: vscode.WebviewPanel
	private readonly _extensionPath: string
// 	private readonly _extensionUri: vscode.Uri
	private _disposables: vscode.Disposable[] = []

	public static createOrShow(extensionPath: string) {
		const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined

		// If we already have a panel, show it.
		// Otherwise, create a new panel.
		if (ChatPanel.currentPanel) {
			ChatPanel.currentPanel._panel.reveal(column)
		} else {
	// 		const panel = vscode.window.createWebviewPanel(
	// 			ChatPanel.viewType,
	// 			'Code Assistant',
	// 			column || vscode.ViewColumn.One,
	// 			{
	// 				// Enable javascript in the webview
	// 				enableScripts: true,

	// 				// And restrict the webview to only loading content from our extension's `media` directory.
	// 				localResourceRoots: [
	// 					vscode.Uri.joinPath(extensionUri, 'media'),
	// 					vscode.Uri.joinPath(extensionUri, 'out/compiled'),
	// 				],
	// 			}
	// 		)

	// 		ChatPanel.currentPanel = new ChatPanel(panel, extensionUri)
			ChatPanel.currentPanel = new ChatPanel(extensionPath, column || vscode.ViewColumn.One)
		}
	}

// 	public static kill() {
// 		ChatPanel.currentPanel?.dispose()
// 		ChatPanel.currentPanel = undefined
// 	}

// 	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
// 		ChatPanel.currentPanel = new ChatPanel(panel, extensionUri)
// 	}

	private constructor(extensionPath: string, column: vscode.ViewColumn) {
		this._extensionPath = extensionPath
// 		this._panel = panel
// 		this._extensionUri = extensionUri
// 		// Set the webview's initial html content
// 		this._update()

		// Create and show a new webview panel (not needed?)
		this._panel = vscode.window.createWebviewPanel(ChatPanel.viewType, 'React', column, {
			// Enable javascript in the webview
			enableScripts: true,

			// And restric the webview to only loading content from our extension's `media` directory.
			localResourceRoots: [vscode.Uri.file(path.join(this._extensionPath, 'build'))],
		})

		// Set the webview's initial html content (not needed?)
		this._panel.webview.html = this._getHtmlForWebview()

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables)

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			(message) => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text)
						return
				}
			},
			null,
			this._disposables
		)
	}

	public doRefactor() {
		// Send a message to the webview webview.
		// You can send any JSON serializable data.
		this._panel.webview.postMessage({ command: 'refactor' })
	}

	public dispose() {
		ChatPanel.currentPanel = undefined

		// Clean up our resources
		this._panel.dispose()

		while (this._disposables.length) {
			const x = this._disposables.pop()
			if (x) {
				x.dispose()
			}
		}
	}

	// 	private async _update() {
// 		const webview = this._panel.webview

// 		this._panel.webview.html = this._getHtmlForWebview(webview)
// 		webview.onDidReceiveMessage(async (data) => {
// 			switch (data.type) {
// 				case 'onInfo': {
// 					if (!data.value) {
// 						return
// 					}
// 					vscode.window.showInformationMessage(data.value)
// 					break
// 				}
// 				case 'onError': {
// 					if (!data.value) {
// 						return
// 					}
// 					vscode.window.showErrorMessage(data.value)
// 					break
// 				}
// 				// case 'tokens': {
// 				// 	await Util.globalState.update(accessTokenKey, data.accessToken)
// 				// 	await Util.globalState.update(refreshTokenKey, data.refreshToken)
// 				// 	break
// 				// }
// 			}
// 		})
// 	}

	private _getHtmlForWebview() {
		const manifest = require(path.join(this._extensionPath, 'build', 'asset-manifest.json'))
		const mainScript = manifest['files']['main.js']
		const mainStyle = manifest['files']['main.css']

		const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'build', mainScript))
		const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' })
		const stylePathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'build', mainStyle))
		const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' })

		// Use a nonce to whitelist which scripts can be run
		const nonce = getNonce()

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
				<title>React App</title>
				<link rel="stylesheet" type="text/css" href="${styleUri}">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
				<base href="${vscode.Uri.file(path.join(this._extensionPath, 'build')).with({
					scheme: 'vscode-resource',
				})}/">
			</head>

			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>
				
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`
	}
}
// export class ChatPanel {
// 	/**
// 	 * Track the currently panel. Only allow a single panel to exist at a time.
// 	 */
// 	public static currentPanel: ChatPanel | undefined

// 	public static readonly viewType = 'hello-world'

// 	private readonly _panel: vscode.WebviewPanel
// 	private readonly _extensionUri: vscode.Uri
// 	private _disposables: vscode.Disposable[] = []

// 	public static createOrShow(extensionUri: vscode.Uri) {
// 		const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined

// 		// If we already have a panel, show it.
// 		if (ChatPanel.currentPanel) {
// 			ChatPanel.currentPanel._panel.reveal(column)
// 			ChatPanel.currentPanel._update()
// 			return
// 		}

// 		// Otherwise, create a new panel.
// 		const panel = vscode.window.createWebviewPanel(
// 			ChatPanel.viewType,
// 			'Code Assistant',
// 			column || vscode.ViewColumn.One,
// 			{
// 				// Enable javascript in the webview
// 				enableScripts: true,

// 				// And restrict the webview to only loading content from our extension's `media` directory.
// 				localResourceRoots: [
// 					vscode.Uri.joinPath(extensionUri, 'media'),
// 					vscode.Uri.joinPath(extensionUri, 'out/compiled'),
// 				],
// 			}
// 		)

// 		ChatPanel.currentPanel = new ChatPanel(panel, extensionUri)
// 	}

// 	public static kill() {
// 		ChatPanel.currentPanel?.dispose()
// 		ChatPanel.currentPanel = undefined
// 	}

// 	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
// 		ChatPanel.currentPanel = new ChatPanel(panel, extensionUri)
// 	}

// 	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
// 		this._panel = panel
// 		this._extensionUri = extensionUri

// 		// Set the webview's initial html content
// 		this._update()

// 		// Listen for when the panel is disposed
// 		// This happens when the user closes the panel or when the panel is closed programatically
// 		this._panel.onDidDispose(() => this.dispose(), null, this._disposables)

// 		// // Handle messages from the webview
// 		// this._panel.webview.onDidReceiveMessage(
// 		//   (message) => {
// 		//     switch (message.command) {
// 		//       case "alert":
// 		//         vscode.window.showErrorMessage(message.text);
// 		//         return;
// 		//     }
// 		//   },
// 		//   null,
// 		//   this._disposables
// 		// );
// 	}

// 	public dispose() {
// 		ChatPanel.currentPanel = undefined

// 		// Clean up our resources
// 		this._panel.dispose()

// 		while (this._disposables.length) {
// 			const x = this._disposables.pop()
// 			if (x) {
// 				x.dispose()
// 			}
// 		}
// 	}

// 	private async _update() {
// 		const webview = this._panel.webview

// 		this._panel.webview.html = this._getHtmlForWebview(webview)
// 		webview.onDidReceiveMessage(async (data) => {
// 			switch (data.type) {
// 				case 'onInfo': {
// 					if (!data.value) {
// 						return
// 					}
// 					vscode.window.showInformationMessage(data.value)
// 					break
// 				}
// 				case 'onError': {
// 					if (!data.value) {
// 						return
// 					}
// 					vscode.window.showErrorMessage(data.value)
// 					break
// 				}
// 				// case 'tokens': {
// 				// 	await Util.globalState.update(accessTokenKey, data.accessToken)
// 				// 	await Util.globalState.update(refreshTokenKey, data.refreshToken)
// 				// 	break
// 				// }
// 			}
// 		})
// 	}

// 	private _getHtmlForWebview(webview: vscode.Webview) {
// 		// And the uri we use to load this script in the webview
// 		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'))

// 		// Uri to load styles into webview
// 		const stylesResetUri = webview.asWebviewUri(
// 			vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css')
// 		)
// 		const stylesMainUri = webview.asWebviewUri(
// 			vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css')
// 		)
// 		// const cssUri = webview.asWebviewUri(
// 		// 	vscode.Uri.joinPath(this._extensionUri, 'out', 'compiled/swiper.css')
// 		// )

// 		// Use a nonce to only allow specific scripts to be run
// 		const nonce = getNonce()

// 		return `<!DOCTYPE html>
// 		<html lang="en">
// 		<head>
// 		<meta charset="UTF-8">
//         	<meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
// 		<meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <script nonce="${nonce}">
//         	</script>
//         	<link rel="stylesheet" href="${stylesResetUri}">
//           <link rel="stylesheet" href="${stylesMainUri}">
//         	</head>
//       	<body>
//       	<h1>HELLO WORLD</h1>
// 		</body>
//           <script nonce="${nonce}" src="${scriptUri}">
// 		</html>`
// 	}
// }
