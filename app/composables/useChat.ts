import type { ChatMessage } from '~/types/chat'

import { faultTreeApi } from '~/api/faultTree'
import { knowledgeBaseApi } from '~/api/knowledgeBase'

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
const fileInputRef = ref<HTMLInputElement>()
const isGenerating = ref(false)
const selectedKnowledgeBase = ref<string>()

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
    selectedKnowledgeBase,
    toggle,
    triggerFileUpload
  }
}

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  const toast = useToast()

  if (!selectedKnowledgeBase.value) {
    toast.add({ color: 'warning', description: '请先选择知识库', title: '提示' })
    target.value = ''
    return
  }

  const kbName = selectedKnowledgeBase.value
  for (const file of files) {
    await knowledgeBaseApi.uploadFile(kbName, file)
    toast.add({ color: 'success', description: `${file.name} 上传成功`, title: '上传成功' })
  }

  target.value = ''
}

async function handleSend() {
  if (isGenerating.value || !input.value.trim()) return

  const userContent = input.value.trim()

  messages.value.push({
    content: userContent,
    id: Date.now().toString(),
    role: 'user'
  })

  input.value = ''

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
    const res = await faultTreeApi.generate({
      fault_content: userContent,
      knowledge_base_name: selectedKnowledgeBase.value
    })
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

function triggerFileUpload() {
  fileInputRef.value?.click()
}
