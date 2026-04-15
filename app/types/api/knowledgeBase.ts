import type { CommonResponse } from './common'

export interface CreateKnowledgeBaseRequest {
  knowledge_base_name: string
}

export interface KnowledgeBaseDetailDataResponse {
  files: KnowledgeBaseFileResponse[]
  knowledgeBaseName: string
}

export interface KnowledgeBaseDetailResponse extends CommonResponse {
  data: KnowledgeBaseDetailDataResponse
}

export interface KnowledgeBaseFileResponse {
  fileName: string
  parseStatus: string
}

export interface KnowledgeBaseListDetailResponse extends CommonResponse {
  data: KnowledgeBaseSummaryResponse[]
}

export interface KnowledgeBaseSummaryResponse {
  fileCount: number
  knowledgeBaseName: string
}

export interface RenameKnowledgeBaseRequest {
  newName: string
}
