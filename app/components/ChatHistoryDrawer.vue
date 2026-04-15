<script setup lang="ts">
import type { FaultTreeHistoryItemResponse } from '~/types/api/faultTree'

import { faultTreeApi } from '~/utils/api/faultTree'

const isOpen = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ select: [item: FaultTreeHistoryItemResponse] }>()

const historyList = ref<FaultTreeHistoryItemResponse[]>([])
const loading = ref(false)

whenever(isOpen, async () => {
  loading.value = true
  try {
    const res = await faultTreeApi.getHistory()
    historyList.value = res.data
  } finally {
    loading.value = false
  }
})

function formatTime(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function handleSelect(item: FaultTreeHistoryItemResponse) {
  emit('select', item)
  isOpen.value = false
}
</script>

<template>
  <USlideover v-model:open="isOpen" title="历史记录" description="查看和管理故障树历史">
    <template #body>
      <div v-if="loading" class="flex items-center justify-center py-8">
        <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin" />
        <span class="ml-2 text-sm text-neutral-500">加载中...</span>
      </div>
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="item in historyList"
          :key="item.id"
          class="cursor-pointer rounded-lg border border-neutral-200 bg-white p-3 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
          @click="handleSelect(item)"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium text-neutral-900">{{ item.treeName }}</span>
            <span class="text-xs text-neutral-500">{{ formatTime(item.createdAt) }}</span>
          </div>
          <p class="mt-1 text-sm text-neutral-600">{{ item.deviceType }}</p>
        </div>

        <div v-if="historyList.length === 0" class="py-8 text-center text-neutral-500">暂无历史记录</div>
      </div>
    </template>
  </USlideover>
</template>
