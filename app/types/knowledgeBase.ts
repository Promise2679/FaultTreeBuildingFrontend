export interface KnowledgeBase {
  documentCount: number
  name: string
}

export interface KnowledgeBaseFile {
  name: string
  status: KnowledgeBaseFileStatus
}

export type KnowledgeBaseFileStatus = 'parseFailed' | 'parsing' | 'ready' | 'uploaded'
