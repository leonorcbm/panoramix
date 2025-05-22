export interface Node {
  id: number;
  name: string;
  detached: boolean;
  parentId: number;
  type: string;
  proved: boolean;
}

export class Tree {
  static singleton = new Tree();

  nodes: Node[] = [];

  static get roots(): Node[] {
    return [Tree.getNode(0)];
  }

  static getChildren(node: Node) {
    return this.singleton.nodes.filter((n) => n.parentId === node.id);
  }

  static getNode(id: number) {
    return this.singleton.nodes[id];
  }

  static setNode(node: Node) {
    this.singleton.nodes[node.id] = node;
  }
  static reset(){
    this.singleton.nodes = [];
  }
}
