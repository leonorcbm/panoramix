import { spawn, ChildProcess } from "node:child_process";
import * as vscode from "vscode";
import { NodeProvider } from "./nodeProvider.ts";
// import { processNotifications } from './notificationsClient';

let process: ReturnType<typeof spawn> | null = null;

export function start() {
  if (!process) {
    if (vscode.window.activeTextEditor) {
      const args: string[] = [
        "webserver",
        "-L",
        ".",
        vscode.window.activeTextEditor.document.fileName,
      ];
      let why3_path: string | undefined = vscode.workspace
        .getConfiguration()
        .get("why3.path");
      let why3 = why3_path ? why3_path : "why3";

      const workspaceFolder =
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

      if (workspaceFolder) {
      } else {
        vscode.window.showErrorMessage("No workspace folder found.");
      }
      // process = execFile(why3, args, { cwd: vscode.workspace.workspaceFolders });
    }
  }
}

export function notificationsDaemon(nodeProvider: NodeProvider) {
  if (process) {
    // processNotifications(nodeProvider);
    nodeProvider.refresh();
    /* let job = new cron.CronJob('* * * * * *', function () {
        //vscode.window.showInformationMessage(`cenas e coisas`); /* FIXME: remove this line 
        processNotifications(nodeProvider);
        nodeProvider.refresh();
      }, undefined, true, 'Europe/Lisbon');
      job.start(); */
  }
}
