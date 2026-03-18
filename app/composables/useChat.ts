import type { ChatMessage, UploadedFile } from '~/types/chat'

export function useChat() {
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
  const uploadedFiles = ref<UploadedFile[]>([])
  const fileInputRef = ref<HTMLInputElement | null>(null)

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (!files) return

    for (const file of files)
      uploadedFiles.value.push({
        file,
        id: Date.now().toString() + crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type
      })

    target.value = ''
  }

  function handleSend() {
    if (!input.value.trim() && uploadedFiles.value.length === 0) return
    const files = [...uploadedFiles.value].map(f => f.file)
    messages.value.push({
      attachments: files.length > 0 ? files : undefined,
      content: input.value,
      id: Date.now().toString(),
      role: 'user'
    })
    input.value = ''
    uploadedFiles.value = []
  }

  function removeFile(id: string) {
    uploadedFiles.value = uploadedFiles.value.filter(f => f.id !== id)
  }

  function triggerFileUpload() {
    fileInputRef.value?.click()
  }

  return {
    chatMessages,
    fileInputRef,
    handleFileSelect,
    handleSend,
    input,
    messages,
    removeFile,
    triggerFileUpload,
    uploadedFiles
  }
}
