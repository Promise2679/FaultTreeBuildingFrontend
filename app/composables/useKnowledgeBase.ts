import type { KnowledgeBase, KnowledgeBaseFile, KnowledgeBaseFileStatus } from '~/types/knowledgeBase'

import { knowledgeBaseApi } from '~/utils/api/knowledgeBase'

type KnowledgeBaseView = 'detail' | 'list'

const view = ref<KnowledgeBaseView>('list')
const currentKnowledgeBase = ref<KnowledgeBase>()

const knowledgeBases = ref<KnowledgeBase[]>([])
const currentFiles = ref<KnowledgeBaseFile[]>([])
const loading = ref(false)

export function useKnowledgeBase() {
  return {
    backToList,
    createKnowledgeBase,
    currentFiles: currentFiles,
    currentKnowledgeBase: readonly(currentKnowledgeBase),
    deleteFile,
    deleteKnowledgeBase,
    fetchKnowledgeBases,
    knowledgeBases: knowledgeBases,
    loading: readonly(loading),
    openDetail,
    resetView,
    uploadFile,
    view: readonly(view)
  }
}

function backToList() {
  currentKnowledgeBase.value = undefined
  currentFiles.value = []
  view.value = 'list'
}

async function createKnowledgeBase(name: string) {
  await knowledgeBaseApi.create({ knowledge_base_name: name })
  await fetchKnowledgeBases()
}

async function deleteFile(fileName: string) {
  if (!currentKnowledgeBase.value) return
  const kbName = currentKnowledgeBase.value.name
  await knowledgeBaseApi.deleteFile(kbName, fileName)
  await fetchFiles(kbName)

  const kb = knowledgeBases.value.find(k => k.name === kbName)
  if (kb) kb.documentCount = currentFiles.value.length
}

async function deleteKnowledgeBase(name: string) {
  await knowledgeBaseApi.delete(name)
  await fetchKnowledgeBases()
}

async function fetchFiles(kbName: string) {
  loading.value = true
  try {
    const res = await knowledgeBaseApi.getByName(kbName)
    currentFiles.value = res.data.files.map(f => ({
      name: f.fileName,
      status: f.parseStatus as KnowledgeBaseFileStatus
    }))
  } finally {
    loading.value = false
  }
}

async function fetchKnowledgeBases() {
  loading.value = true
  try {
    const res = await knowledgeBaseApi.getList()
    knowledgeBases.value = res.data.map(item => ({
      documentCount: item.fileCount,
      name: item.knowledgeBaseName
    }))
  } finally {
    loading.value = false
  }
}

async function openDetail(kb: KnowledgeBase) {
  currentKnowledgeBase.value = kb
  view.value = 'detail'
  await fetchFiles(kb.name)
}

function resetView() {
  view.value = 'list'
  currentKnowledgeBase.value = undefined
  currentFiles.value = []
}

async function uploadFile(file: File) {
  if (!currentKnowledgeBase.value) return
  const kbName = currentKnowledgeBase.value.name
  await knowledgeBaseApi.uploadFile(kbName, file)
  await fetchFiles(kbName)

  const kb = knowledgeBases.value.find(k => k.name === kbName)
  if (kb) kb.documentCount = currentFiles.value.length
}
