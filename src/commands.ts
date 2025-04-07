import * as vscode from "vscode";
import * as server from "./server.ts";
import { NodeProvider } from "./nodeProvider.ts";
import * as webReq  from './webRequests';
import { Notification } from "./notificationsClient.ts";
import TaskProvider from "./taskProvider";

export async function sessionStart(this: NodeProvider) {
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
      //vscode.window.showWarningMessage("Unable to get task from server");
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
