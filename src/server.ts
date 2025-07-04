import { spawn, ChildProcess } from "node:child_process";
import * as vscode from "vscode";
import { NodeProvider } from "./nodeProvider.ts";
// import { processNotifications } from './notificationsClient';

let process: ReturnType<typeof spawn> | null = null;
let serverProcess: ReturnType<typeof spawn> | null = null;

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
    }
  }
}

export function notificationsDaemon(nodeProvider: NodeProvider) {
  if (process) {
    // processNotifications(nodeProvider);
    nodeProvider.refresh();
    /* let job = new cron.CronJob('* * * * * *', function () {
        processNotifications(nodeProvider);
      }, undefined, true, 'Europe/Lisbon');
      job.start(); */
  }
}

export async function ensureServerRunning(context: vscode.ExtensionContext) {
  if (serverProcess) {
    return;
  }

  if (!vscode.window.activeTextEditor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }

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

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

  if (!workspaceFolder) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }

  serverProcess = spawn(why3, args, { cwd: workspaceFolder, shell: true });

  if (!serverProcess) {
    vscode.window.showErrorMessage("Failed to start Why3 server.");
    return;
  }
  serverProcess.stdout?.on("data", (data) => {
    console.log(`[server] ${data}`);
  });

  serverProcess.stderr?.on("data", (data) => {
    console.error(`[server error] ${data}`);
  });

  serverProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    if (code !== 0) {
      vscode.window.showErrorMessage(`Why3 server exited with code ${code}`);
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
}

