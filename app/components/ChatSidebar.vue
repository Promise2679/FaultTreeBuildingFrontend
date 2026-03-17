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
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-full bg-white border-r border-neutral-200 shadow-lg z-50 transition-all duration-300 flex flex-col"
    :class="isCollapsed ? 'w-14' : 'w-80'"
  >
    <header class="flex items-center justify-between p-3 border-b border-neutral-200">
      <span v-if="!isCollapsed" class="font-medium text-neutral-700 whitespace-nowrap">AI 助手</span>
      <UButton
        :icon="isCollapsed ? 'i-lucide-panel-right' : 'i-lucide-panel-left-close'"
        size="sm"
        variant="ghost"
        @click="toggle()"
      />
    </header>

    <main v-if="!isCollapsed" class="flex-1 overflow-auto p-3">
      <UChatMessages :messages="chatMessages" :user="{ variant: 'solid' }" :assistant="{ variant: 'soft' }" />
    </main>

    <footer v-if="!isCollapsed" class="p-3 border-t border-neutral-200 flex items-center gap-2">
      <UInput placeholder="输入消息..." />
      <UButton icon="i-lucide-send" size="sm" variant="solid" color="primary" disabled />
    </footer>
  </aside>
</template>
