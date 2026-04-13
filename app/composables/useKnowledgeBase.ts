import type { KnowledgeBase, KnowledgeBaseFile } from '~/types/knowledgeBase'

type KnowledgeBaseView = 'detail' | 'list'

const view = ref<KnowledgeBaseView>('list')
const currentKnowledgeBase = ref<KnowledgeBase | null>(null)

let nextKbId = 4
let nextFileId = 7

const knowledgeBases = ref<KnowledgeBase[]>([
  { documentCount: 3, id: 1, name: '航空发动机故障知识库' },
  { documentCount: 2, id: 2, name: '液压系统故障分析' },
  { documentCount: 1, id: 3, name: '电气系统可靠性数据' }
])

const filesMap = ref<Record<number, KnowledgeBaseFile[]>>({
  1: [
    { id: 1, name: '发动机振动分析报告.pdf', status: 'parsed' },
    { id: 2, name: '涡轮叶片故障模式.docx', status: 'uploaded' },
    { id: 3, name: '燃油系统失效数据.xlsx', status: 'parseFailed' }
  ],
  2: [
    { id: 4, name: '液压泵可靠性测试.pdf', status: 'parsed' },
    { id: 5, name: '管路泄漏案例集.docx', status: 'parsing' }
  ],
  3: [{ id: 6, name: '电气接线故障统计.pdf', status: 'uploaded' }]
})

const currentFiles = computed(() => {
  if (!currentKnowledgeBase.value) return []
  return filesMap.value[currentKnowledgeBase.value.id] ?? []
})

export function useKnowledgeBase() {
  return {
    backToList,
    createKnowledgeBase,
    currentFiles,
    currentKnowledgeBase: readonly(currentKnowledgeBase),
    deleteFile,
    deleteKnowledgeBase,
    knowledgeBases,
    openDetail,
    resetView,
    uploadFile,
    view: readonly(view)
  }
}

function backToList() {
  currentKnowledgeBase.value = null
  view.value = 'list'
}

function createKnowledgeBase(name: string) {
  const kb: KnowledgeBase = {
    documentCount: 0,
    id: nextKbId++,
    name
  }
  knowledgeBases.value.push(kb)
  return kb
}

function deleteFile(fileId: number) {
  if (!currentKnowledgeBase.value) return
  const kbId = currentKnowledgeBase.value.id
  const files = filesMap.value[kbId]
  if (!files) return

  const index = files.findIndex(f => f.id === fileId)
  if (index !== -1) {
    files.splice(index, 1)
    const kb = knowledgeBases.value.find(k => k.id === kbId)
    if (kb) kb.documentCount = files.length
  }
}

function deleteKnowledgeBase(id: number) {
  const index = knowledgeBases.value.findIndex(kb => kb.id === id)
  if (index !== -1) {
    knowledgeBases.value.splice(index, 1)
    delete filesMap.value[id]
  }
}

function openDetail(kb: KnowledgeBase) {
  currentKnowledgeBase.value = kb
  view.value = 'detail'
}

function resetView() {
  view.value = 'list'
  currentKnowledgeBase.value = null
}

function uploadFile(file: File) {
  if (!currentKnowledgeBase.value) return
  const kbId = currentKnowledgeBase.value.id

  filesMap.value[kbId] ??= []

  const newFile: KnowledgeBaseFile = {
    id: nextFileId++,
    name: file.name,
    status: 'uploaded'
  }
  filesMap.value[kbId].push(newFile)

  const kb = knowledgeBases.value.find(k => k.id === kbId)
  if (kb) kb.documentCount = filesMap.value[kbId].length
}
