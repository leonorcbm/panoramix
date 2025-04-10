// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as commands from "./commands.ts";
import { NodeProvider } from "./nodeProvider.ts";
import { spawn } from "child_process";
import TaskProvider from "./taskProvider";
import { startPollingNotifications } from "./commands.ts";

let serverProcess: ReturnType<typeof spawn> | null = null;
let nodeProvider: NodeProvider | null = null;


async function ensureServerRunning(context: vscode.ExtensionContext) {
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

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  nodeProvider = new NodeProvider();
  const taskProvider = new TaskProvider();
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "panoramix" is now active!');

  let disposables = [
    /* start session command */
    vscode.commands.registerCommand("why3.start", async () => {
      await ensureServerRunning(context);
      startPollingNotifications();
      //server.notificationsDaemon(this);
      vscode.window.showInformationMessage(`Proofing session started`);
    }),
    /* task provider */
    vscode.workspace.registerTextDocumentContentProvider(
      TaskProvider.taskScheme,
      taskProvider,
    ),
    /* tree provider */
    vscode.window.registerTreeDataProvider("proof-tree", nodeProvider),
    vscode.commands.registerCommand('why3.getTask', commands.getTaskForNode),
  ];

  disposables.forEach((d) => {
    context.subscriptions.push(d);
  });
}

// This method is called when your extension is deactivated
export function deactivate() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}
