import * as vscode from "vscode";

export default class TaskProvider
  implements vscode.TextDocumentContentProvider
{
  static taskScheme = "task";

  // emitter and its event
  onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  onDidChange = this.onDidChangeEmitter.event;

  provideTextDocumentContent(uri: vscode.Uri): string {
    return uri.query;
  }
}
