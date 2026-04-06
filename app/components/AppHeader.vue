<script setup lang="ts">
const { exportAsImage } = useGraphInstance()
const { isCollapsed, toggle } = useChatSidebar()
const isHistoryOpen = ref(false)
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
    </div>
    <div class="flex-1 text-center font-medium text-neutral-700">故障树编辑器</div>
    <div class="flex items-center gap-1 px-3">
      <UButton icon="i-lucide-download" size="sm" variant="ghost" @click="exportAsImage" />
    </div>
  </header>

  <ChatHistoryDrawer v-model:open="isHistoryOpen" />
</template>
