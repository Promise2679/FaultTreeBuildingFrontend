<script setup lang="ts">
const { isCollapsed } = useChatSidebar()

const {
  chatMessages,
  fileInputRef,
  handleFileSelect,
  handleSend,
  input,
  removeFile,
  triggerFileUpload,
  uploadedFiles
} = useChat()
</script>

<template>
  <div
    class="fixed top-14 left-0 z-30 flex h-[calc(100vh-3.5rem)] flex-col border-r border-neutral-200 bg-neutral-50 shadow-lg"
    :class="isCollapsed ? 'w-0' : 'w-80'"
  >
    <div v-show="!isCollapsed" class="flex-1 overflow-auto p-3">
      <UChatMessages :messages="chatMessages" :user="{ variant: 'solid' }" :assistant="{ variant: 'soft' }" />
    </div>

    <div v-show="!isCollapsed" class="border-t border-neutral-200 p-3">
      <div v-if="uploadedFiles.length > 0" class="mb-2 flex flex-wrap gap-2">
        <div
          v-for="file in uploadedFiles"
          :key="file.id"
          class="flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700"
        >
          <UIcon name="i-lucide-paperclip" class="size-3" />
          <span class="max-w-24 truncate">{{ file.name }}</span>
          <button
            type="button"
            class="ml-1 cursor-pointer text-neutral-500 hover:text-neutral-700"
            @click="removeFile(file.id)"
          >
            <UIcon name="i-lucide-x" class="size-3" />
          </button>
        </div>
      </div>
      <UChatPrompt v-model="input" placeholder="输入消息..." @submit="handleSend">
        <template #footer>
          <input ref="fileInputRef" type="file" class="hidden" multiple @change="handleFileSelect" />
          <div class="flex items-center gap-1">
            <UButton icon="i-lucide-paperclip" size="sm" variant="link" color="neutral" @click="triggerFileUpload" />
            <UChatPromptSubmit />
          </div>
        </template>
      </UChatPrompt>
    </div>
  </div>
</template>
