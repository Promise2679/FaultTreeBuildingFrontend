export interface ChatMessage {
  attachments?: File[]
  content: string
  elapsedTime?: number
  id: string
  role: 'assistant' | 'user'
  status?: 'error' | 'generating' | 'success'
}

export interface UploadedFile {
  file: File
  id: string
  name: string
  size: number
  type: string
}
