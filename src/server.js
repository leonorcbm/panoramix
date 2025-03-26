"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = start;
const node_child_process_1 = require("node:child_process");
const vscode = __importStar(require("vscode"));
// import { execFile, ChildProcess } from 'child_process';
var process;
function start() {
    if (!process) {
        if (vscode.window.activeTextEditor) {
            const args = ["webserver", "-L", ".", vscode.window.activeTextEditor.document.fileName];
            let why3_path = vscode.workspace.getConfiguration().get('why3.path');
            let why3 = why3_path ? why3_path : 'why3';
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
            if (workspaceFolder) {
                (0, node_child_process_1.execFile)(why3, args, { cwd: workspaceFolder }, (error, stdout, stderr) => {
                    if (error) {
                        vscode.window.showErrorMessage(`Error executing command: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        vscode.window.showErrorMessage(`stderr: ${stderr}`);
                        return;
                    }
                    vscode.window.showInformationMessage(`stdout: ${stdout}`);
                });
            }
            else {
                vscode.window.showErrorMessage('No workspace folder found.');
            }
            // process = execFile(why3, args, { cwd: vscode.workspace.workspaceFolders });
        }
    }
}
//# sourceMappingURL=server.js.map