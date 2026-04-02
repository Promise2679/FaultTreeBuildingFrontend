<script setup lang="ts">
const isOpen = defineModel<boolean>('open', { default: false })

const historyList = ref([
  { id: '1', preview: '帮我创建一个串联系统', time: '2024-03-15 14:30', title: '串联系统分析' },
  { id: '2', preview: '如何设计并联冗余系统？', time: '2024-03-15 10:15', title: '并联系统设计' },
  { id: '3', preview: '帮我优化这个故障树的结构', time: '2024-03-14 16:45', title: '故障树优化' }
])

function handleClose() {
  isOpen.value = false
}

function selectHistory() {
  handleClose()
}
</script>

<template>
  <USlideover v-model:open="isOpen" title="历史记录" description="查看和管理聊天历史">
    <template #body>
      <div class="flex flex-col gap-3">
        <div
          v-for="item in historyList"
          :key="item.id"
          class="cursor-pointer rounded-lg border border-neutral-200 bg-white p-3 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
          @click="selectHistory"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium text-neutral-900">{{ item.title }}</span>
            <span class="text-xs text-neutral-500">{{ item.time }}</span>
          </div>
          <p class="mt-1 text-sm text-neutral-600">{{ item.preview }}</p>
        </div>

        <div v-if="historyList.length === 0" class="py-8 text-center text-neutral-500">暂无历史记录</div>
      </div>
    </template>
  </USlideover>
</template>
