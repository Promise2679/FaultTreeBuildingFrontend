import type { ChatMessage } from '~/types/chat'

import { faultTreeApi } from '~/api/faultTree'
import { knowledgeBaseApi } from '~/api/knowledgeBase'

const messages = ref<ChatMessage[]>([])

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
const loadingState = ref<{ actionText: string; elapsed: number }>()

const { pause: pauseTimer, resume: resumeTimer } = useIntervalFn(
  () => {
    if (loadingState.value) loadingState.value.elapsed++
  },
  1000,
  { immediate: false }
)

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
    loadChatHistory,
    loadingState: readonly(loadingState),
    messages,
    resetMessages,
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

  const { currentFaultTreeId, transformFaultTreeData } = useFaultTree()
  const isValidation = currentFaultTreeId.value != null
  const actionText = isValidation ? '校验' : '生成'

  isGenerating.value = true
  loadingState.value = { actionText, elapsed: 0 }
  resumeTimer()

  try {
    if (isValidation) {
      const res = await faultTreeApi.validate({
        fault_content: userContent,
        id: currentFaultTreeId.value!,
        knowledge_base_name: selectedKnowledgeBase.value
      })
      transformFaultTreeData(res.data.faultTree)

      messages.value.push({
        content: res.data.turnSummary,
        id: `assistant-${Date.now()}`,
        role: 'assistant'
      })
    } else {
      const res = await faultTreeApi.generate({
        fault_content: userContent,
        knowledge_base_name: selectedKnowledgeBase.value
      })
      transformFaultTreeData(res.data)

      messages.value.push({
        content: `已生成故障树：${res.data.treeName}`,
        id: `assistant-${Date.now()}`,
        role: 'assistant'
      })
    }
  } finally {
    pauseTimer()
    loadingState.value = undefined
    isGenerating.value = false
  }
}

async function loadChatHistory(id: number) {
  const res = await faultTreeApi.getChatHistory(id)
  messages.value = res.data.map(item => ({
    content: item.content,
    id: String(item.id),
    role: item.role as ChatMessage['role']
  }))
}

function resetMessages() {
  messages.value = []
}

function triggerFileUpload() {
  fileInputRef.value?.click()
}
