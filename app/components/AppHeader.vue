<script setup lang="ts">
import type { FaultTreeHistoryItemResponse } from '~/types/api/faultTree'

const { exportAsImage } = useGraph()
const { isCollapsed, loadChatHistory, resetMessages, toggle } = useChat()
const { currentFaultTreeId, resetFaultTree } = useFaultTree()
const isHistoryOpen = ref(false)
const isKnowledgeBaseOpen = ref(false)

function handleClick() {
  resetFaultTree()
  resetMessages()
}

async function handleHistorySelect(item: FaultTreeHistoryItemResponse) {
  currentFaultTreeId.value = item.id
  await loadChatHistory(item.id)
}
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b border-neutral-200 bg-neutral-50">
    <div class="flex items-center gap-1 px-3">
      <UButton
        :icon="isCollapsed ? 'i-lucide-panel-right' : 'i-lucide-panel-left-close'"
        size="sm"
        variant="ghost"
        @click="toggle()"
      />
      <UButton icon="i-lucide-history" size="sm" variant="ghost" @click="isHistoryOpen = true" />
      <UButton icon="i-lucide-book-open" size="sm" variant="ghost" @click="isKnowledgeBaseOpen = true" />
      <UButton icon="i-lucide-file-plus" size="sm" variant="ghost" @click="handleClick" />
    </div>
    <div class="flex-1 text-center font-medium text-neutral-700">故障树编辑器</div>
    <div class="flex items-center gap-1 px-3">
      <UButton icon="i-lucide-download" size="sm" variant="ghost" @click="exportAsImage" />
    </div>
  </header>

  <HistoryDrawer v-model:open="isHistoryOpen" @select="handleHistorySelect" />
  <KnowledgeBase v-model:open="isKnowledgeBaseOpen" />
</template>
