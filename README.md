# 🧙‍♂️ Panoramix A WhyML Extension in VSCode

> The development of this extension aims to implement the functionality and performance of the Why3 IDE platform, to improve the user experience of programmers who need this deductive program verification tool in their development environment.

![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-blue?style=flat-square)

## Features
- Tree View, where the data is processed to divide it hierarchically into nodes, with their respective tasks.
- Task View, a side panel that shows a node's task, when you click on it.
- Terminal View, this Panoramix window will be able to show menus, transformations, and a functional command text-box.

## Getting Started
> Setting up the development environment, envolves the following steps: <br>
    >> 1. Install the Ocaml Package Manager (opam) and Node.js. <br>
    >>
    >> 2. Install Why3.1.7.2 through opam.<br>
    >>
    >> 3. Next, for compatibility u should follow some steps to change some lines in the Why3.1.7.2 source code.<br>
        >>>  ` opam source why3.1.7.2 ` (in your terminal)<br>
        >>>
        >>> Now, in the source code:<br>
        >>> 
        >>> - Change ` src/ide/why3web.ml ` - in line 110 "\n" to "\r\n"<br>
        >>> - Change  `src/ide/why3web.ml` - in line 111 "\n" to "\r\n"<br>
        >>> - Change `src/ide/wserver.ml` - in line 122 "HTTP/1.0" to "HTTP/1.1"<br>
        >>>
        >>>Now you go back to the terminal and do these<br>
        >>>
        >>> ` opam pin add why3.1.7.2 `<br>
        >>>
        >>>  ` opam upgrade why3 `<br>
    >>
    >>
    >> Install Ocaml extension on VSCode.<br>
    >>
    >>Prepare a **.ml** file format file if you're going to test the extension. Keep in mind, the file has to be reachable.<br>

After going through these steps you're ready to go and run the project.

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
├── CHANGELOG.md &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
├── esbuild.js &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
├── eslint.config.mjs &nbsp; &nbsp; &nbsp; &nbsp; <br>
├── package-lock.json<br>
├── package.json &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
├── README.md &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; # You're here!<br>
├── tsconfig.json &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br>
└── vsc-extension-quickstart.md &nbsp; <br>


<h2> Thanks for Reading!