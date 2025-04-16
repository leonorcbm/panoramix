import * as vscode from "vscode";
import * as fs from "fs";

export class PanoramixTerminalViewProvider implements vscode.WebviewViewProvider {
    constructor(private readonly extensionUri: vscode.Uri) {}

    private static readonly viewType = 'panelView';

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'src', 'webViews')],
        };

        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
    }

    private getHtmlForWebview(webview: vscode.Webview): string {
        const filePath = vscode.Uri.joinPath(this.extensionUri, 'src', 'webViews', 'view.html').fsPath;
        return fs.readFileSync(filePath, 'utf8');
    }
}

