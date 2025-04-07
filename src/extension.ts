// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as commands from "./commands.ts";
import { NodeProvider } from "./nodeProvider.ts";
import { spawn } from "child_process";
import { Notification } from "./notificationsClient.ts";
import { Tree } from "./tree.ts";
import TaskProvider from "./taskProvider";

let serverProcess: ReturnType<typeof spawn> | null = null;
let pollInterval: NodeJS.Timeout | null = null;
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

function startPollingNotifications() {
  if (pollInterval) {
    return;
  }
  pollInterval = setInterval(async () => {
    try {
      console.log("Fetching notifications from server...");

      const response = await fetch("http://localhost:6789/getNotifications");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const notifications =
        (await response.json()) as Notification.RootObject[];

      if (notifications) {
        notifications.forEach(async (n: Notification.RootObject) => {
          switch (n.notification) {
            case "New_node":
              console.log("New node");
              if (
                n.node_ID !== undefined &&
                n.parent_ID !== undefined &&
                n.detached !== undefined
              ) {
                Tree.setNode({
                  id: n.node_ID,
                  parentId: n.parent_ID,
                  name: n.name,
                  type: n.node_type,
                  detached: n.detached,
                  proved: false,
                });
              }
              break;
            case "Node_change":
              console.log("Node change");
              if (n.node_ID !== undefined && n.update !== undefined) {
                switch (n.update.update_info) {
                  case "Proved":
                    let node = Tree.getNode(n.node_ID);
                    node.proved = n.update.proved;
                    Tree.setNode(node);
                    break;
                }
              }
              break;
            case "Message":
              vscode.window.showInformationMessage(
                "Message: " + n.message.information,
              );
              break;
            case "File_contents":
              console.log("File contents"); /*FIXME: do something here xD */
              Tree.setNode({
                id: 0,
                parentId: -1,
                name: n.file,
                type: "file",
                detached: true,
                proved: false,
              });
              break;
            case "Reset_whole_tree":
              console.log("Reset Whole Tree"); /*FIXME: do something here xD */
              break;
            case "Task":
              let task = n.task;
              let uri = vscode.Uri.parse(
                TaskProvider.taskScheme + ":Task?" + task,
              );
              let doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
              vscode.languages.setTextDocumentLanguage(doc, "whyml");
              await vscode.window.showTextDocument(doc, {
                preserveFocus: true,
                preview: false,
                viewColumn: vscode.ViewColumn.Beside,
              });
              break;
          }
        });
        nodeProvider?.refresh();
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, 1000);
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
