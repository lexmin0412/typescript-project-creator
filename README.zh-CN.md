# TPC

![version](https://img.shields.io/npm/v/@lexmin0412/tpc) 
![downloads-month](https://img.shields.io/npm/dm/@lexmin0412/tpc)

[English](./README.md) | 中文

TypeScript 项目创建工具，类似于 `npm init`，但是用于 TS 库的初始化。

全局安装 tpc：

```sh
npm i -g @lexmin0412/tpc
```

从现在开始，每当你想要创建一个新的 TypeScript 项目时，只需在工作目录运行：

```sh
npm init -y
tpc init
```

**它实际上做了什么？** 嗯，不多！它将：

1. 安装开发依赖项：[TypeScript](https://github.com/Microsoft/TypeScript)、[ts-node](https://www.npmjs.com/package/ts-node) 和 [rimraf](https://github.com/isaacs/rimraf)（用于跨平台的 `rm -rf`）。
2. 创建 npm 脚本，使用 TS 编译器构建您的项目并使用 `ts-node` 运行它。构建文件也将在您的 `package.json` 中正确声明，并添加到 `.gitignore` 中。
3. 创建一个具有合理默认值的简约 `tsconfig.json` 文件：ES6，并将以下标志设置为真：`alwaysStrict`、`strictNullChecks`、`noImplicitAny`。

## 脚本

* `npm run build` - 构建您的项目
* `npm run ts` - 使用 `ts-node` 运行您的项目

## 项目结构

* `src/` - 您的源文件，必须包含 `index.ts` 文件。
* `test/` - 您的测试文件
* `es/` - 使用 ES 模块的 ES6 产物
* `lib/` - 使用 CommonJS（npm）模块的 ES5 产物。此目录还包含 `*.d.ts` 声明文件。

## 动机

> 几乎每个 JavaScript 库都应该用 TypeScript 编写。

该项目旨在提供创建 npm 库（以及可能的任何其他 JS 项目）所需的一切，使用现代 TypeScript 编译器。这样您就可以使用现代的 ES6 功能和静态类型，而无需任何成本。

同时，它试图不强迫您使用只是一种有倾向性的工具。**它不包括** 一个 lint 工具、像 Jest 这样的测试库或一些重型 TS 配置。一切都保持尽可能的最小化。

## 许可证

MIT

## 更多

这个项目受到 [michowski/ts-init](https://github.com/michowski/ts-init) 的启发。
