const baseUrl = "http://localhost:6789/";

export interface TaskObject {
  loc_list?: Loclist[];
  node_ID?: number;
  notification?: string;
  task: string;
}

interface Loclist {
  color: string;
  loc: Loc;
}

interface Loc {
  col1: number;
  col2: number;
  file: string;
  line: number;
}

export enum scripts {
  request = "request",
  getNotifications = "getNotifications",
}

export enum requests {
  listProvers = "list-provers",
  getTask = "gettask_",
  reload = "reload",
  command = "command=",
}

export enum commands {
  interrupt = "interrupt",
  listTransforms = "list-transforms",
  listProvers = "list-provers",
  listStrategies = "list-strategies",
  print = "print",
  search = "search",
  searchAll = "search_all",
}

export async function sendWebRequest(
  script: scripts,
  request?: requests,
  task?: number,
  command?: { id: number; command: commands }
) {
  let uri = baseUrl + script.toString();

  if (request) {
    uri += "?" + request;
    if (request === requests.getTask && task) {
      uri += task;
    } else if (request === requests.command && command) {
      uri += command.id + "," + command.command;
    }
  }


  let result = await createRequest(uri)
    .then((response) => {
      return createRequest(scripts.getNotifications).then(
        (response) => response,
      );
    })
    .then((r) => r);

  return result;
}

function createRequest(uri: string) {
  return fetch(uri);
}

export async function getNotifications() {
  return createRequest(scripts.getNotifications).then((r) => r);
}
