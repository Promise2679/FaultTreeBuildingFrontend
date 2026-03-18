export interface ChatMessage {
  attachments?: File[]
  content: string
  id: string
  role: 'assistant' | 'user'
}

export interface UploadedFile {
  file: File
  id: string
  name: string
  size: number
  type: string
}
