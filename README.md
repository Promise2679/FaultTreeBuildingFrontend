# 故障树构建前端

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

基于 Nuxt 4 + Nuxt UI + TypeScript 的故障树可视化构建前端应用。

## 特性

- **可视化编辑** - 拖拽、节点编辑、连边等交互功能
- **图形化界面** - 基于 @antv/x6 构建的流程图编辑器
- **现代化 UI** - 使用 Nuxt UI 组件库

## 技术栈

- **框架**: Nuxt 4
- **UI 库**: Nuxt UI
- **图形库**: @antv/x6 + @antv/layout
- **语言**: TypeScript
- **包管理**: pnpm

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发服务器

启动开发服务器（默认端口 3000）：

```bash
pnpm dev
```

### 生产构建

构建生产版本：

```bash
pnpm build
```

本地预览生产构建：

```bash
pnpm preview
```

## 项目命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 本地预览生产构建 |
| `pnpm lint` | 运行 ESLint 检查代码 |
| `pnpm lint:fix` | 自动修复 ESLint 问题 |
| `pnpm typecheck` | 运行 TypeScript 类型检查 |

## 项目结构

```
FaultTreeBuildingFrontend/
├── app/
│   ├── app.config.ts          # 应用配置（Nuxt UI 主题）
│   ├── app.vue                # 根组件
│   ├── assets/
│   │   └── css/
│   │       └── main.css       # 全局样式
│   ├── components/            # 组件目录（自动导入）
│   │   └── FaultTreeCanvas.vue
│   ├── pages/                 # 页面文件
│   │   └── index.vue          # 首页
│   ├── composables/           # Composables（自动导入）
│   ├── utils/                 # 工具函数（自动导入）
│   └── types/                 # 类型定义
├── .nuxt/                     # Nuxt 生成文件
├── nuxt.config.ts             # Nuxt 配置
├── tsconfig.json              # TypeScript 配置
├── eslint.config.mjs          # ESLint 配置
└── package.json               # 项目依赖
```

## 许可证

MIT
