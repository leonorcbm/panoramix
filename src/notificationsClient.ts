export declare namespace Notification {
  export interface Loc {
    col1: number;
    col2: number;
    file: string;
    line: number;
  }

  export interface RelLoc {
    col1: number;
    col2: number;
    file: string;
    line: number;
  }

  export interface Message {
    information: string;
    mess_notif: string;
    error: string;
    loc: Loc;
    rel_loc: RelLoc;
    node_ID?: number;
    qinfo: string;
    qerror: string;
  }

  export interface Update {
    proved: boolean;
    update_info: string;
  }

  export interface RootObject {
    notification: string;
    message: Message;
    detached?: boolean;
    name: string;
    node_ID?: number;
    node_type: string;
    parent_ID?: number;
    update: Update;
    content: string;
    file: string;
    loc_list: any[];
    task: string;
  }
}