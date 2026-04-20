import type { CommonResponse } from '~/types/api/common'
import type {
  CreateKnowledgeBaseRequest,
  DeleteKnowledgeBaseFileRequest,
  KnowledgeBaseDetailResponse,
  KnowledgeBaseListDetailResponse,
  RenameKnowledgeBaseRequest
} from '~/types/api/knowledgeBase'

import { apiFetch } from './request'

export const knowledgeBaseApi = {
  create(data: CreateKnowledgeBaseRequest) {
    return apiFetch<CommonResponse>('/knowledge-bases', {
      body: data,
      method: 'POST'
    })
  },
  delete(name: string) {
    return apiFetch<CommonResponse>(`/knowledge-bases/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    })
  },
  deleteFile(data: DeleteKnowledgeBaseFileRequest) {
    return apiFetch<CommonResponse>(`/knowledge-bases//files`, {
      body: data,
      method: 'DELETE'
    })
  },
  getByName(name: string) {
    return apiFetch<KnowledgeBaseDetailResponse>(`/knowledge-bases/${encodeURIComponent(name)}`, {
      method: 'GET'
    })
  },
  getList() {
    return apiFetch<KnowledgeBaseListDetailResponse>('/knowledge-bases', {
      method: 'GET'
    })
  },
  rename(name: string, data: RenameKnowledgeBaseRequest) {
    return apiFetch<CommonResponse>(`/knowledge-bases/${encodeURIComponent(name)}`, {
      body: data,
      method: 'PUT'
    })
  },
  uploadFile(name: string, file: File) {
    const formData = new FormData()
    formData.append('knowledge_base_name', name)
    formData.append('file', file)

    return apiFetch<CommonResponse>('/knowledge-bases/files', {
      body: formData,
      method: 'POST'
    })
  }
}
