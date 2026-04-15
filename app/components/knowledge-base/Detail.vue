<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import type { KnowledgeBaseFile, KnowledgeBaseFileStatus } from '~/types/knowledgeBase'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const { backToList, currentFiles, currentKnowledgeBase, deleteFile, loading, uploadFile } = useKnowledgeBase()

const fileInputRef = ref<HTMLInputElement | null>(null)

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files) return

  for (const file of files) await uploadFile(file)
  input.value = ''
}

function triggerUpload() {
  fileInputRef.value?.click()
}

const statusConfig: Record<
  KnowledgeBaseFileStatus,
  { color: 'error' | 'info' | 'success' | 'warning'; label: string }
> = {
  parsed: { color: 'success', label: '已解析' },
  parseFailed: { color: 'error', label: '解析失败' },
  parsing: { color: 'info', label: '解析中' },
  uploaded: { color: 'success', label: '已上传' }
}

const columns: Array<TableColumn<KnowledgeBaseFile>> = [
  { accessorKey: 'name', header: '文件名' },
  {
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.getValue<KnowledgeBaseFileStatus>('status')
      const config = statusConfig[status]
      return h(UBadge, { color: config.color, variant: 'subtle' }, () => config.label)
    },
    header: '状态',
    meta: { class: { td: 'text-center', th: 'w-28 text-center' } }
  },
  {
    cell: ({ row }) =>
      h(UButton, {
        color: 'error',
        icon: 'i-lucide-trash-2',
        onClick: async () => {
          await deleteFile(row.original.name)
        },
        size: 'xs',
        variant: 'ghost'
      }),
    header: '操作',
    id: 'actions',
    meta: { class: { td: 'text-center', th: 'w-24 text-center' } }
  }
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <UButton
        icon="i-lucide-arrow-left"
        size="sm"
        variant="ghost"
        color="neutral"
        label="返回知识库列表"
        @click="backToList"
      />
      <UButton icon="i-lucide-upload" size="sm" label="上传文件" @click="triggerUpload" />
      <input ref="fileInputRef" type="file" multiple class="hidden" @change="handleFileChange" />
    </div>

    <div class="rounded-lg bg-neutral-50 px-4 py-2 text-sm">
      当前知识库：<span class="font-medium text-neutral-900">{{ currentKnowledgeBase?.name }}</span>
      <span class="ml-4">共 {{ currentFiles.length }} 个文件</span>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin" />
      <span class="ml-2 text-sm text-neutral-500">加载中...</span>
    </div>
    <UTable v-else-if="currentFiles.length" :data="currentFiles" :columns="columns" />
    <div v-else class="flex flex-col items-center justify-center py-12">
      <UIcon name="i-lucide-file-x" class="mb-2 size-10" />
      <p>暂无文件，点击上方按钮上传</p>
    </div>
  </div>
</template>
