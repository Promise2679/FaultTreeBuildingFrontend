import type { ChatMessage, UploadedFile } from '~/types/chat'

import { faultTreeApi } from '~/utils/api/faultTree'

const messages = ref<ChatMessage[]>([
  { content: '你好！我是故障树分析助手，有什么可以帮助你的吗？', id: '1', role: 'assistant' }
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
const fileInputRef = ref<HTMLInputElement>()
const isGenerating = ref(false)

let timerInterval: NodeJS.Timeout | null = null

const [isCollapsed, toggle] = useToggle()

export function useChat() {
  return {
    chatMessages,
    fileInputRef,
    handleFileSelect,
    handleSend,
    input,
    isCollapsed,
    isGenerating: readonly(isGenerating),
    messages,
    removeFile,
    toggle,
    triggerFileUpload,
    uploadedFiles
  }
}

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

async function handleSend() {
  if (isGenerating.value) return
  if (!input.value.trim() && uploadedFiles.value.length === 0) return

  const userContent = input.value.trim()
  const files = [...uploadedFiles.value].map(f => f.file)

  messages.value.push({
    attachments: files.length > 0 ? files : undefined,
    content: userContent,
    id: Date.now().toString(),
    role: 'user'
  })

  input.value = ''
  uploadedFiles.value = []

  const assistantMsgId = `gen-${Date.now()}`
  const assistantMsg: ChatMessage = {
    content: '正在生成故障树... 已耗时 0s',
    elapsedTime: 0,
    id: assistantMsgId,
    role: 'assistant',
    status: 'generating'
  }
  messages.value.push(assistantMsg)

  isGenerating.value = true
  const startTime = Date.now()

  timerInterval = setInterval(() => {
    const msg = messages.value.find(m => m.id === assistantMsgId)
    if (msg) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      msg.elapsedTime = elapsed
      msg.content = `正在生成故障树... 已耗时 ${elapsed}s`
    }
  }, 1000)

  try {
    const res = await faultTreeApi.generate({ fault_content: userContent })
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const nodeCount = res.data.nodes.length

    const msg = messages.value.find(m => m.id === assistantMsgId)
    if (msg) {
      msg.status = 'success'
      msg.elapsedTime = elapsed
      msg.content = `故障树已生成，共 ${nodeCount} 个节点，耗时 ${elapsed}s`
    }

    const { transformFaultTreeData } = useFaultTree()
    transformFaultTreeData(res.data)
  } catch (error) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const msg = messages.value.find(m => m.id === assistantMsgId)
    if (msg) {
      msg.status = 'error'
      msg.elapsedTime = elapsed
      const errMsg = error instanceof Error ? error.message : '未知错误'
      msg.content = `生成失败：${errMsg}`
    }
  } finally {
    clearInterval(timerInterval)
    timerInterval = null
    isGenerating.value = false
  }
}

function removeFile(id: string) {
  uploadedFiles.value = uploadedFiles.value.filter(f => f.id !== id)
}

function triggerFileUpload() {
  fileInputRef.value?.click()
}
