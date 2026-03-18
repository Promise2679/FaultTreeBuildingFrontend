<script setup lang="ts">
const [isCollapsed, toggle] = useToggle()

interface ChatMessage {
  content: string
  id: string
  role: 'assistant' | 'user'
}

const messages = ref<ChatMessage[]>([
  { content: '你好！我是故障树分析助手，有什么可以帮助你的吗？', id: '1', role: 'assistant' },
  { content: '帮我创建一个串联系统', id: '2', role: 'user' }
])

const chatMessages = computed(() =>
  messages.value.map(msg => ({
    id: msg.id,
    parts: [{ text: msg.content, type: 'text' }],
    role: msg.role
  }))
)

const input = ref('')

function handleSend() {
  if (!input.value.trim()) return
  messages.value.push({
    content: input.value,
    id: Date.now().toString(),
    role: 'user'
  })
  input.value = ''
}
</script>

<template>
  <div
    class="fixed top-0 left-0 z-50 flex h-full flex-col border-r border-neutral-200 bg-neutral-50 shadow-lg transition-all duration-300"
    :class="isCollapsed ? 'w-14' : 'w-80'"
  >
    <div class="flex items-center justify-between border-b border-neutral-200 p-3">
      <span v-if="!isCollapsed" class="font-medium whitespace-nowrap text-neutral-700">AI 助手</span>
      <UButton
        :icon="isCollapsed ? 'i-lucide-panel-right' : 'i-lucide-panel-left-close'"
        size="sm"
        variant="ghost"
        @click="toggle()"
      />
    </div>

    <div v-if="!isCollapsed" class="flex-1 overflow-auto p-3">
      <UChatMessages :messages="chatMessages" :user="{ variant: 'solid' }" :assistant="{ variant: 'soft' }" />
    </div>

    <div v-if="!isCollapsed" class="border-t border-neutral-200 p-3">
      <UChatPrompt v-model="input" placeholder="输入消息..." @submit="handleSend">
        <UChatPromptSubmit />
      </UChatPrompt>
    </div>
  </div>
</template>
