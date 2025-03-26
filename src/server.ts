import { execFile,ChildProcess } from 'node:child_process';
import * as vscode from 'vscode';
// import { execFile, ChildProcess } from 'child_process';

var process: ChildProcess | undefined;

export function start() {
    if (!process) {
      if (vscode.window.activeTextEditor) {
        const args: string[] = ["webserver", "-L", ".", vscode.window.activeTextEditor.document.fileName];
        let why3_path: string | undefined = vscode.workspace.getConfiguration().get('why3.path');
        let why3 = why3_path ? why3_path : 'why3';
        
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

        if (workspaceFolder) {
            execFile(why3, args, { cwd: workspaceFolder }, (error, stdout, stderr) => {
              if (error) {
                vscode.window.showErrorMessage(`Error executing command: ${error.message}`);
                return;
              }
              if (stderr) {
                vscode.window.showErrorMessage(`stderr: ${stderr}`);
                return;
              }
              vscode.window.showInformationMessage(`stdout: ${stdout}`);
            });
          } else {
            vscode.window.showErrorMessage('No workspace folder found.');
          }

        // process = execFile(why3, args, { cwd: vscode.workspace.workspaceFolders });
      }
    }
  }