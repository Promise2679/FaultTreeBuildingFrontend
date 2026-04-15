import type { CommonResponse } from '~/types/api/common'
import type {
  CreateKnowledgeBaseRequest,
  KnowledgeBaseDetailResponse,
  KnowledgeBaseListDetailResponse,
  RenameKnowledgeBaseRequest
} from '~/types/api/knowledgeBase'

import { apiBaseUrl } from './request'

export const knowledgeBaseApi = {
  create(data: CreateKnowledgeBaseRequest) {
    return useFetch<CommonResponse>('/knowledge-bases', {
      baseURL: apiBaseUrl,
      body: data,
      method: 'POST'
    })
  },
  delete(name: string) {
    return useFetch<CommonResponse>(`/knowledge-bases/${name}`, {
      baseURL: apiBaseUrl,
      method: 'DELETE'
    })
  },
  deleteFile(name: string, fileName: string) {
    return useFetch<CommonResponse>(`/knowledge-bases/${name}/files/${fileName}`, {
      baseURL: apiBaseUrl,
      method: 'DELETE'
    })
  },
  getByName(name: string) {
    return useFetch<KnowledgeBaseDetailResponse>(`/knowledge-bases/${name}`, {
      baseURL: apiBaseUrl,
      method: 'GET'
    })
  },
  getList() {
    return useFetch<KnowledgeBaseListDetailResponse>('/knowledge-bases', {
      baseURL: apiBaseUrl,
      method: 'GET'
    })
  },
  rename(name: string, data: RenameKnowledgeBaseRequest) {
    return useFetch<CommonResponse>(`/knowledge-bases/${name}`, {
      baseURL: apiBaseUrl,
      body: data,
      method: 'PUT'
    })
  },
  uploadFile(name: string, file: File) {
    const formData = new FormData()
    formData.append('knowledge_base_name', name)
    formData.append('file', file)

    return useFetch<CommonResponse>('/knowledge-bases/files', {
      baseURL: apiBaseUrl,
      body: formData,
      method: 'POST'
    })
  }
}
