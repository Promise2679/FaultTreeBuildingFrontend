export interface KnowledgeBase {
  documentCount: number
  id: number
  name: string
}

export interface KnowledgeBaseFile {
  id: number
  name: string
  status: KnowledgeBaseFileStatus
}

export type KnowledgeBaseFileStatus = 'parsed' | 'parseFailed' | 'parsing' | 'uploaded'
