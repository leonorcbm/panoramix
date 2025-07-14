# 🧙‍♂️ Panoramix A WhyML Extension in VSCode

> The development of this extension aims to implement the functionality and performance of the Why3 IDE platform, to improve the user experience of programmers who need this deductive program verification tool in their development environment.

## Features
- Tree View, where the data is processed to divide it hierarchically into nodes, with their respective tasks.
- Task View, a side panel that shows a node's task, when you click on it.
- Terminal View, this Panoramix window will be able to show menus, transformations, and a functional command text-box.

## Getting Started

Setting up the development environment involves the following steps:

1. **Install the OCaml Package Manager (`opam`) and Node.js.**

2. **Install Why3 version 1.7.2 through opam:**

   ```sh
   opam install why3.1.7.2
   ```

3. **Modify the Why3 source code for compatibility:**

   First, download the source code:

   ```sh
   opam source why3.1.7.2
   ```

   Then, make the following changes:

   - In `src/ide/why3web.ml`:
     - Line 110: Change `"\n"` to `"\r\n"`
     - Line 111: Change `"\n"` to `"\r\n"`
   - In `src/ide/wserver.ml`:
     - Line 122: Change `"HTTP/1.0"` to `"HTTP/1.1"`

4. **Rebuild Why3 with your modifications:**

   ```sh
   opam pin add why3.1.7.2
   opam upgrade why3
   ```

5. **Install the OCaml extension in VSCode.**

6. **Prepare a `.ml` file** if you're going to test the extension.  
   Make sure the file is reachable by the extension.


## Patching Why3 for Panoramix

To enable VSCode integration with Panoramix, some internal Why3 source files must be modified. In the "Getting Started" section, you can ignore the steps 1 to 4, and alternativily do the next steps.

A patch file `why3-panoramix.patch` is included to execute this process.

### Apply the Patch (via opam)

1. **Download the Why3 1.7.2 source code without installing it yet:**
   ```bash
   mkdir ~/why3-src
   cd ~/why3-src
   opam source why3.1.7.2 
   ```

2. **Aply the Panoramix patch**
   ```bash
   cd why3.1.7.2
   patch -p1 < /path/to/why3-panoramix.patch
      ```

3. **Pin the patched Why3 version to your opam environment**
   ```bash
   opam pin add why3.1.7.2
   opam install why3.1.7.2
      ```

After this tutorial you are ready to test the Panoramix extension.


## Testing Panoramix
> To test Panoramix, you should be aware of the steps above.

As soon as you run the extension, you should see your selected test file, a window to your right (where the task will show up), a terminal with the name “Panoramix” in the terminal windows and, in the activity bar, you should see the Why3 logo. <br>
To get the tree view of the chosen document, you need to run the why3.start command. To easily access the extension's commands, click `CTRL + Shift + P`. After this step, search for `"Start proofing session"` and run this command.

> **Keep in mind**: The extension wont provide a tree if the document is not selected in the editor. To ensure that the document is selected, click on the editor to select the test file.

When this command is executed, by clicking on the Why3 logo, you will be able to see the tree of the document, to the left of your editor.

To visualize the task element, you need to click a tree's node. On your right window, the task document will appear.

Finally, you can explore the terminal view that simulates the Why3 platform in the VSCode environment. This terminal conatins buttons and menus similar to the Why3 IDE's and it alows u to write commands, although they are not yet functional.


## Panoramix File Organization
📦 panoramix/<br>
├── 📁 .vscode/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
│   └── vscode-test.mjs &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
├── 📁 dist/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
│   ├── extension.js<br>
│   └── extension.js.map<br>
├── 📁 media/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<br>
│   └── fatcow/<br>
│       └── logo_why3.png &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
├── 📁 node_modules/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
│   └── ...<br>
├── 📁 src/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<br>
│   ├── 📁 language/<br>
│   │   ├── language-configuration.json<br>
│   │   └── syntaxes/<br>
│   │       └── whyml.tmLanguage.json<br>
│   ├── 📁 webViews/<br>
│   │   ├── terminal.ts &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
│   │   └── view.html &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
│   ├── commands.ts &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
│   ├── extension.ts &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
│   ├── nodeProviders.ts &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
│   ├── notificationsClient.ts &nbsp; &nbsp; <br>
│   ├── server.ts &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
│   ├── taskProviders.ts &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
│   └── webRequests.ts &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
├── .gitignore &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
├── .prettierignore &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
├── .prettierrc &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
├── esbuild.js &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
├── eslint.config.mjs &nbsp; &nbsp; &nbsp; &nbsp; <br>
├── package-lock.json<br>
├── package.json &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
├── README.md &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; # You're here!<br>
├── tsconfig.json &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
└── why3-panoramix.patch &nbsp; <br>


<h2> Thanks for Reading!