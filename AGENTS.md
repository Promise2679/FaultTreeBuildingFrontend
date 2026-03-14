# AGENTS.md - 故障树构建前端

## 项目概述

这是一个基于 Nuxt 4 + Nuxt UI + TypeScript 的故障树构建前端应用。使用 pnpm 作为包管理器，采用客户端渲染模式（ssr: false）。

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器（默认端口 3000） |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 本地预览生产构建 |
| `pnpm lint` | 运行 ESLint 检查代码 |
| `pnpm lint:fix` | 自动修复 ESLint 可修复的问题 |
| `pnpm typecheck` | 运行 TypeScript 类型检查 |
| `pnpm postinstall` | 安装依赖后自动运行（nuxt prepare + git hooks） |

## 代码风格指南

### 格式化

- 使用 EditorConfig 标准化编辑器设置（`.editorconfig`）
- 缩进：2 空格
- 换行：LF（Unix 风格）
- 字符编码：UTF-8
- 文件末尾保留一个空行

### ESLint

- 使用 `@promise2/eslint-config` 基础配置
- 配合 `@nuxt/eslint` 模块
- 提交前自动运行 lint 检查（通过 simple-git-hooks）
- 运行 `pnpm lint` 手动检查

### TypeScript

- 启用严格模式
- 使用 Nuxt 自动生成的 `tsconfig`
- 运行 `pnpm typecheck` 进行类型检查
- 组件 props 应定义类型

### Nuxt 自动导入

Nuxt 会自动导入以下内容，无需手动 import：

- `app/components/` 下的所有组件
- `app/composables/` 下的 composables
- `app/utils/` 下的工具函数
- Nuxt 内置的 `useNuxtApp()`、`useState()` 等

### 组件命名

- Vue 组件文件：PascalCase（如 `TemplateMenu.vue`）
- 组件目录：kebab-case（如 `app/components/my-component/`）
- 组件名：PascalCase（如 `<TemplateMenu />`）

### 模板语法

- 使用 `<script setup lang="ts">` 语法
- 优先使用 Nuxt UI 组件（以 `U` 开头，如 `<UButton>`, `<UPageHero>`）
- 图标使用 Iconify 格式：`i-lucide-图标名`、`i-simple-icons-github`

### 样式

- **尽量使用 Tailwind CSS 写 CSS**，优先避免自定义 CSS 类或内联样式
- 使用 Tailwind CSS（通过 Nuxt UI）
- 使用 Nuxt UI 提供的颜色系统（如 `primary`, `neutral`）
- 自定义样式放在 `app/assets/css/main.css`

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
│   │   └── TemplateMenu.vue
│   ├── composables/           # Composables（自动导入）
│   ├── layouts/               # 布局文件
│   ├── pages/                 # 页面文件（基于文件路由）
│   │   └── index.vue
│   ├── plugins/               # Nuxt 插件
│   ├── public/               # 静态资源
│   ├── server/               # Server API
│   ├── types/                # 类型定义
│   └── utils/                # 工具函数（自动导入）
├── .nuxt/                    # Nuxt 生成文件（勿手动编辑）
├── .github/workflows/ci.yml  # CI 工作流
├── nuxt.config.ts            # Nuxt 配置
├── eslint.config.mjs         # ESLint 配置
├── tsconfig.json             # TypeScript 配置
└── package.json              # 项目依赖
```

## 配置说明

### nuxt.config.ts

- `compatibilityDate`: '2025-01-15'
- `ssr: false` - 客户端渲染
- `routeRules`: 首页预渲染

### app/app.config.ts

- Nuxt UI 主题配置
- 颜色：neutral 使用 slate，primary 使用 green

## 开发注意事项

1. **不要提交 `.nuxt/` 目录** - 这是 Nuxt 自动生成的
2. **写完代码后运行 `pnpm lint:fix`** - 自动修复 ESLint 可修复的问题，确保代码风格一致
3. **提交前运行 `pnpm typecheck`** - 确保 TypeScript 类型正确
4. **使用 pnpm** - 不要使用 npm 或 yarn
5. **遵循 EditorConfig** - 确保编辑器配置一致

## CI/CD

GitHub Actions 工作流（`.github/workflows/ci.yml`）在每次 push 时运行：

1. 安装依赖 (`pnpm install`)
2. 代码检查 (`pnpm lint`)
3. 类型检查 (`pnpm typecheck`)

## 依赖版本管理

使用 pnpm workspace + catalog 管理依赖版本，定义在 `pnpm-workspace.yaml` 中。添加新依赖时使用 catalog 方式。

## 常用依赖

- `@nuxt/ui` - UI 组件库
- `@antv/x6` - 流程图/图形库
- `@antv/layout` - 图形布局算法
- `@vueuse/core` - Vue 组合式工具库
- `tailwindcss` - CSS 框架
