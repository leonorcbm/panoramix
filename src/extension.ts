import * as vscode from "vscode";
import * as commands from "./commands.ts";
import { NodeProvider } from "./nodeProvider.ts";
import { spawn } from "child_process";
import TaskProvider from "./taskProvider";
import { startPollingNotifications /* registerNewPanel */} from "./commands.ts";
import { ensureServerRunning } from "./server.ts";
import { PanoramixTerminalViewProvider, ColorsViewProvider } from './webViews/terminal.ts';
import * as fs from "fs";
import * as path from "path";

let serverProcess: ReturnType<typeof spawn> | null = null;
let nodeProvider: NodeProvider | null = null;

export function activate(context: vscode.ExtensionContext) {
  nodeProvider = new NodeProvider();
  const taskProvider = new TaskProvider();
  const provider = new PanoramixTerminalViewProvider(context.extensionUri);
  const provider2 = new ColorsViewProvider(context.extensionUri);
  console.log('Hello from Panoramix!');

  let disposables = [
    vscode.window.registerWebviewViewProvider('panelView', provider),
    /* start session command */
    vscode.commands.registerCommand("why3.start", async () => {
      await ensureServerRunning(context);
      startPollingNotifications();
      console.log('MIAU!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
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

    
    // vscode.window.registerWebviewViewProvider("panelView", provider),
   /*  vscode.commands.registerCommand('why3.getPanel', () => {
      const panel = vscode.window.createWebviewPanel(
        'myWebview', // Identifies the type of the webview
        'My Custom HTML', // Title
        vscode.ViewColumn.One, // Editor column to show in
        {
          enableScripts: true, // Allows script tags in HTML
          localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src', 'webViews'))] // Allow access to local media folder
        }
      );
  
      const htmlPath = path.join(context.extensionPath, 'src', 'webViews' ,'view.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      panel.webview.html = htmlContent;
    }), */

    
    vscode.commands.registerCommand('why3.getTask', commands.getTaskForNode),
    vscode.commands.registerCommand('why3.getPanel', commands.registerNewPanel)
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
