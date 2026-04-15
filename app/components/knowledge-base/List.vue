<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import type { KnowledgeBase } from '~/types/knowledgeBase'

const UButton = resolveComponent('UButton')

const { createKnowledgeBase, deleteKnowledgeBase, fetchKnowledgeBases, knowledgeBases, loading, openDetail } =
  useKnowledgeBase()

const isCreating = ref(false)
const newName = ref('')

onMounted(fetchKnowledgeBases)

function cancelCreate() {
  newName.value = ''
  isCreating.value = false
}

async function handleCreate() {
  const name = newName.value.trim()
  if (!name) return
  await createKnowledgeBase(name)
  newName.value = ''
  isCreating.value = false
}

const columns: Array<TableColumn<KnowledgeBase>> = [
  {
    accessorKey: 'name',
    header: '知识库名称'
  },
  {
    accessorKey: 'documentCount',
    header: '文档数',
    meta: { class: { td: 'text-center', th: 'w-24 text-center' } }
  },
  {
    cell: ({ row }) =>
      h('div', { class: 'flex items-center justify-center gap-1' }, [
        h(UButton, {
          color: 'primary',
          icon: 'i-lucide-pencil',
          onClick: async () => {
            await openDetail(row.original)
          },
          size: 'xs',
          variant: 'ghost'
        }),
        h(UButton, {
          color: 'error',
          icon: 'i-lucide-trash-2',
          onClick: async () => {
            await deleteKnowledgeBase(row.original.name)
          },
          size: 'xs',
          variant: 'ghost'
        })
      ]),
    header: '操作',
    id: 'actions',
    meta: { class: { td: 'text-center', th: 'w-32 text-center' } }
  }
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <span class="text-sm">共 {{ knowledgeBases.length }} 个知识库</span>
      <UButton v-if="!isCreating" icon="i-lucide-plus" size="sm" label="新建知识库" @click="isCreating = true" />
    </div>

    <div v-if="isCreating" class="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <UInput
        v-model="newName"
        placeholder="请输入知识库名称"
        class="flex-1"
        autofocus
        @keyup.enter="handleCreate"
        @keyup.escape="cancelCreate"
      />
      <UButton size="sm" label="确认" @click="handleCreate" />
      <UButton size="sm" variant="outline" color="neutral" label="取消" @click="cancelCreate" />
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin" />
      <span class="ml-2 text-sm text-neutral-500">加载中...</span>
    </div>
    <UTable v-else-if="knowledgeBases.length" :data="knowledgeBases" :columns="columns" />
    <div v-else class="flex flex-col items-center justify-center py-12">
      <UIcon name="i-lucide-database" class="mb-2 size-10" />
      <p>暂无知识库，点击上方按钮新建</p>
    </div>
  </div>
</template>
