import * as vscode from "vscode";
import { Node, Tree } from "./tree";
import * as path from "path";

export class NodeProvider implements vscode.TreeDataProvider<Node> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    Node | undefined | null | void
  > = new vscode.EventEmitter<Node | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Node | undefined | null | void> =
    this._onDidChangeTreeData.event;

  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  private getIconForNode(node: Node) {
    let lightIcon: string;
    let darkIcon: string;
    switch (node.type) {
      case "NFile":
        lightIcon = path.join(
          __filename,
          "..",
          "..",
          "media",
          "fatcow",
          "package.png",
        );
        darkIcon = path.join(
          __filename,
          "..",
          "..",
          "media",
          "fatcow",
          "package.png",
        );
        break;
      case "NTheory":
        lightIcon = path.join(
          __filename,
          "..",
          "..",
          "media",
          "fatcow",
          "folder.png",
        );
        darkIcon = path.join(
          __filename,
          "..",
          "..",
          "media",
          "fatcow",
          "folder.png",
        );
        break;
      case "NTransformation":
        lightIcon = path.join(
          __filename,
          "..",
          "..",
          "media",
          "fatcow",
          "multitool.png",
        );
        darkIcon = path.join(
          __filename,
          "..",
          "..",
          "media",
          "fatcow",
          "multitool.png",
        );
        break;
      case "NGoal":
        lightIcon = path.join(
          __filename,
          "..",
          "..",
          "media",
          "fatcow",
          node.proved ? "accept.png" : "help.png",
        );
        darkIcon = path.join(
          __filename,
          "..",
          "..",
          "media",
          "fatcow",
          node.proved ? "accept.png" : "help.png",
        );
        break;
      case "NProofAttempt" /* TODO: incomplete */:
        lightIcon = path.join(
          __filename,
          "..",
          "..",
          "media",
          "fatcow",
          "magic_wand_2.png",
        );
        darkIcon = path.join(
          __filename,
          "..",
          "..",
          "media",
          "fatcow",
          "magic_wand_2.png",
        );
        break;
      default:
        lightIcon = path.join(
          __filename,
          "..",
          "..",
          "media",
          "fatcow",
          "script.png",
        );
        darkIcon = path.join(
          __filename,
          "..",
          "..",
          "media",
          "fatcow",
          "script.png",
        );
    }

    return { light: lightIcon, dark: darkIcon };
  }

  public getTreeItem(node: Node): vscode.TreeItem {
    let item: vscode.TreeItem = {
      id: String(node.id),
      label: node.name,
      iconPath: this.getIconForNode(node).dark,
      /*{                 
                light: path.join(__filename,'..','..', 'media', 'fatcow', node.proved ? 'accept.png' : 'help.png'),
                dark: path.join(__filename,'..','..', 'media', 'fatcow', node.proved ? 'accept.png' : 'help.png')
            }*/
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      contextValue: "goal",
    };
    item.command = {
      command: "why3.getTask",
      title: "Get Task for Node",
      arguments: [node.id],
    };

    return item;
  }

  public getChildren(node?: Node): Node[] {
    return node ? Tree.getChildren(node) : Tree.roots;
  }

  public getParent(node: Node): Node | null {
    return node.id === 0 ? null : Tree.getNode(node.parentId);
  }
}
