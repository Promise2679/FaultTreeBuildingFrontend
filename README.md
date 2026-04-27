# 故障树构建前端

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

基于 Nuxt 4 + AntV X6 的故障树可视化构建系统，采用现代化的前端技术栈实现故障树的创建、编辑与 AI 智能生成。

后端仓库：https://github.com/sqb550/FaultTreeBuilding

AI 端仓库：https://github.com/roverstargazer1-max/industry-tree

## 项目简介

FaultTreeBuildingFrontend 是一款专业的故障树可视化构建系统，提供直观的图形化界面，支持通过自然语言描述或文档上传智能生成故障树，同时具备完整的知识库管理功能。

## 核心功能

### 故障树可视化编辑

- **图形化编辑**：基于 AntV X6 的专业流程图编辑器
- **节点类型**：支持 AND 门、OR 门及基础事件节点
- **布局算法**：Dagre 自动布局算法，生成整齐美观的树状结构
- **交互操作**：拖拽定位、缩放浏览、节点增删改
- **历史管理**：支持撤销/重做操作

### AI 智能生成

- **自然语言生成**：通过自然语言描述自动构建故障树
- **文档解析**：支持上传相关技术文档作为生成依据
- **实时反馈**：流式响应展示生成进度

### 知识库管理

- **多知识库**：支持创建和管理多个专业知识库
- **文档管理**：上传、解析、查看技术文档
- **状态追踪**：实时显示文档解析状态

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Nuxt 4 + Vue 3 |
| 语言 | TypeScript |
| UI 组件 | @nuxt/ui v4 |
| 图形引擎 | @antv/x6 |
| 布局算法 | @dagrejs/dagre |
| 样式方案 | Tailwind CSS v4 |
| 包管理 | pnpm |

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

```bash
pnpm build
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
│   │   ├── AppHeader.vue              # 顶部导航栏
│   │   ├── ChatSidebar.vue            # 聊天侧边栏
│   │   ├── ChatHistoryDrawer.vue      # 历史记录抽屉
│   │   ├── FaultTreeCanvas.vue        # 故障树画布
│   │   ├── NodeEditSidebar.vue        # 节点编辑侧边栏
│   │   └── KnowledgeBaseModal.vue     # 知识库弹窗
│   ├── composables/           # Composables（自动导入）
│   │   ├── useFaultTree.ts    # 故障树状态管理
│   │   ├── useChat.ts         # 聊天功能
│   │   ├── useKnowledgeBase.ts # 知识库管理
│   │   └── useGraphInstance.ts # 图形实例管理
│   ├── pages/                 # 页面文件
│   │   └── index.vue          # 首页
│   ├── types/                 # 类型定义
│   │   ├── api/               # API 响应类型
│   │   ├── faultTree.ts       # 故障树类型
│   │   ├── chat.ts            # 聊天类型
│   │   └── knowledgeBase.ts   # 知识库类型
│   └── utils/                 # 工具函数
│       └── api/               # API 请求封装
├── nuxt.config.ts             # Nuxt 配置
├── tsconfig.json              # TypeScript 配置
├── eslint.config.mjs          # ESLint 配置
└── package.json               # 项目依赖
```

## 主要特性

- **现代化 UI**：基于 Nuxt UI 的专业界面设计
- **类型安全**：完整的 TypeScript 类型定义
- **状态管理**：基于 Composition API 的响应式状态管理
- **后端代理**：开发环境自动代理 API 请求
- **代码规范**：ESLint + Prettier + EditorConfig 统一代码风格

## 许可证

MIT
