import * as vscode from "vscode";
import * as server from "./server.ts";
import { NodeProvider } from "./nodeProvider.ts";
import * as webReq  from './webRequests';
import { Notification } from "./notificationsClient.ts";
import TaskProvider from "./taskProvider";
import { Tree } from "./tree.ts";
import { commands } from "./webRequests.ts";

let pollInterval: NodeJS.Timeout | null = null;
let nodeProvider: NodeProvider | null = null;
let sessionRunning: boolean;


export async function sessionStart(this: NodeProvider) {
  sessionRunning = true;
  server.start();
  await (async () =>
    new Promise((resolve) => {
      setTimeout(resolve, 1000);
    }))();
  server.notificationsDaemon(this);
  vscode.window.showInformationMessage(`Proofing session started`);
}

export async function getTaskForNode(id: number){
  let result = await webReq.sendWebRequest(webReq.scripts.request, webReq.requests.getTask, id); 
  if (!result.ok) {
    throw new Error(`HTTP error! status: ${result.status}`);
  }
  const response =  (await result.json()) as Notification.RootObject[];
  if(response.length === 0){
      vscode.window.showWarningMessage("Unable to get task from server");
      return;
  }
  let task;
  for (let i = 0; i < response.length; i++) {
    if (response[i].task !== undefined) {
      task = response[i].task;
      break;
    }
  }  
 
  let uri = vscode.Uri.parse(TaskProvider.taskScheme + ':Task?' + task);
  let doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
  vscode.languages.setTextDocumentLanguage(doc, 'whyml');
  await vscode.window.showTextDocument(doc, { preserveFocus: true, preview: false, viewColumn: vscode.ViewColumn.Beside });
}

export async function startPollingNotifications() {
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


export async function getTaskForCommand(command: commands) {  /*FIXME: do something here xD */
  const result = await webReq.sendWebRequest(webReq.scripts.request, webReq.requests["command"]);

  if (!result.ok) {
    throw new Error(`HTTP error! status: ${result.status}`);
  }

  switch (command) {
    case commands.interrupt:
      console.log("Interrupt");
      break;
    case commands.listTransforms:
      console.log("Transforms");
      break;
    case commands.listProvers:
      console.log("Provers");
      break;
    case commands.listStrategies:
      console.log("File Strategies");
      break;
    case commands.print:
      console.log("Print");
      break;
    case commands.search:
      console.log("Search");
      break;
    case commands.searchAll:
      console.log("Search All");
      break;
    default:
      vscode.window.showWarningMessage(`Unknown command: ${command}`);
      return;
  }
}

export function sessionQuit() {
  /*if (!sessionRunning) {
    vscode.window.showWarningMessage('No active session to stop');
    return;
  }*/

  sessionRunning = false;
   vscode.window.showWarningMessage('Chegeuei aqui');

  Tree.reset();
  nodeProvider?.refresh();
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }

  vscode.window.showInformationMessage('Proofing session stopped');
}

export async function getTransforms() {
  let cmd = { id: 0, command: webReq.commands.listTransforms };
  const result = await webReq.sendWebRequest(
    webReq.scripts.request,
    webReq.requests.command,
    undefined, // skip task
    cmd
  );
  return result;
}



