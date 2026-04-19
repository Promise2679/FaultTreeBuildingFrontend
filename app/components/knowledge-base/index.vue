<script setup lang="ts">
const isOpen = defineModel<boolean>('open', { default: false })

const { currentKnowledgeBase, resetView, view } = useKnowledgeBase()

const title = computed(() => {
  if (view.value === 'detail' && currentKnowledgeBase.value) return `知识库 - ${currentKnowledgeBase.value.name}`
  return '知识库管理'
})

whenever(() => !isOpen.value, resetView)
</script>

<template>
  <UModal v-model:open="isOpen" :title="title" :ui="{ content: 'sm:max-w-3xl' }">
    <template #body>
      <KnowledgeBaseList v-if="view === 'list'" />
      <KnowledgeBaseDetail v-else-if="view === 'detail'" />
    </template>
  </UModal>
</template>
