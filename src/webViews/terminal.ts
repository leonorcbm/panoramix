import * as vscode from "vscode";

 export class PanoramixTerminalViewProvider implements vscode.WebviewViewProvider {
    constructor(private readonly extensionUri: vscode.Uri) {}

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionUri]
        };

        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
    }

    private getHtmlForWebview(webview: vscode.Webview): string {
        return  `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <style>
                    body {
                        background-color: #1e1e1e;
                        color: #d4d4d4;
                        font-family: monospace;
                        padding: 1rem;
                    }
                    #terminal {
                        white-space: pre-wrap;
                    }
                    .cmd::before {
                        content: '$ ';
                        color: #6A9955;
                    }
                </style>
            </head>
            <body>
                <div id="terminal">
                    <div class="cmd">Hello from Panoramix 🧙‍♂️</div>
                </div>
            </body>
            </html>
        `;
    }
}
