import * as vscode from "vscode";
import * as commands from "./commands.ts";
import { NodeProvider } from "./nodeProvider.ts";
import { spawn } from "child_process";
import TaskProvider from "./taskProvider";
import { startPollingNotifications /* registerNewPanel */} from "./commands.ts";
import { ensureServerRunning } from "./server.ts";
import { PanoramixTerminalViewProvider } from './webViews/terminal.ts';

let serverProcess: ReturnType<typeof spawn> | null = null;
let nodeProvider: NodeProvider | null = null;

export function activate(context: vscode.ExtensionContext) {
  nodeProvider = new NodeProvider();
  const taskProvider = new TaskProvider();
  const provider = new PanoramixTerminalViewProvider(context.extensionUri);
  console.log('Hello from Panoramix!');

  let disposables = [
    vscode.window.registerWebviewViewProvider('panelView', provider),
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

export function deactivate() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}
