<script setup lang="ts">
const [isCollapsed, toggle] = useToggle()
</script>

<template>
  <div
    class="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 transition-all duration-300"
    :class="isCollapsed ? 'w-14' : 'w-80'"
  >
    <div class="h-full flex flex-col">
      <div class="flex items-center justify-between p-3 border-b border-gray-200">
        <span v-if="!isCollapsed" class="font-medium text-gray-700 whitespace-nowrap">AI 助手</span>
        <UButton
          :icon="isCollapsed ? 'i-lucide-panel-right' : 'i-lucide-panel-left-close'"
          size="sm"
          variant="ghost"
          @click="toggle()"
        />
      </div>

      <div v-if="!isCollapsed" class="flex-1 overflow-auto p-3">
        <div class="text-sm text-gray-500 text-center mt-20 whitespace-nowrap">AI 聊天功能开发中...</div>
      </div>
    </div>
  </div>
</template>
