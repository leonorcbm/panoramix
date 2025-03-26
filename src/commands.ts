import * as vscode from 'vscode';
import * as server from './server.ts';

export async function sessionStart(/*this: NodeProvider*/) {
    server.start();
    await (async () => new Promise(resolve => {
        setTimeout(resolve, 1000);
    }))();
    // server.notificationsDaemon(this);
    vscode.window.showInformationMessage(`Proofing session started`);
}