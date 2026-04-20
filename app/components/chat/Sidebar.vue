<script setup lang="ts">
const {
  chatMessages,
  fileInputRef,
  handleFileSelect,
  handleSend,
  input,
  isCollapsed,
  isGenerating,
  loadingState,
  selectedKnowledgeBase,
  triggerFileUpload
} = useChat()

const { fetchKnowledgeBases, knowledgeBases } = useKnowledgeBase()
const knowledgeBaseOptions = computed(() => knowledgeBases.value.map(kb => ({ label: kb.name, value: kb.name })))

const messagesRef = ref<HTMLElement>()

watchDeep([chatMessages, loadingState], async () => {
  await nextTick()
  if (messagesRef.value) messagesRef.value.scrollTop = messagesRef.value.scrollHeight
})

onMounted(fetchKnowledgeBases)
</script>

<template>
  <div
    class="fixed top-14 left-0 z-30 flex h-[calc(100vh-3.5rem)] flex-col border-r border-neutral-200 bg-neutral-50 shadow-lg"
    :class="isCollapsed ? 'w-0' : 'w-100'"
  >
    <div v-show="!isCollapsed" ref="messagesRef" class="flex-1 overflow-auto p-3">
      <div v-if="!chatMessages.length && !loadingState" class="flex h-full items-center justify-center">
        <p class="text-sm text-neutral-400">输入消息开始对话</p>
      </div>
      <UChatMessages
        v-if="chatMessages.length"
        :messages="chatMessages"
        :user="{ variant: 'solid' }"
        :assistant="{ variant: 'soft' }"
      />
      <ChatLoadingIndicator
        v-if="loadingState"
        :action-text="loadingState.actionText"
        :elapsed="loadingState.elapsed"
      />
    </div>

    <div v-show="!isCollapsed" class="border-t border-neutral-200 p-3">
      <UChatPrompt v-model="input" placeholder="输入消息..." :disabled="isGenerating" @submit="handleSend">
        <template #footer>
          <input ref="fileInputRef" type="file" class="hidden" multiple @change="handleFileSelect" />
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <UButton
                icon="i-lucide-paperclip"
                size="sm"
                variant="link"
                color="neutral"
                :disabled="isGenerating"
                @click="triggerFileUpload"
              />
            </div>
            <UChatPromptSubmit :disabled="isGenerating" />
          </div>
          <USelect
            v-model="selectedKnowledgeBase"
            :items="knowledgeBaseOptions"
            placeholder="选择知识库"
            class="w-35"
            :disabled="isGenerating"
            value-key="value"
          />
        </template>
      </UChatPrompt>
    </div>
  </div>
</template>
