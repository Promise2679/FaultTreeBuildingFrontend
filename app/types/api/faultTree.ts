import type { CommonResponse } from './common'

export interface ChatHistoryItemResponse {
  content: string
  createdAt: string
  id: number
  modifyReason?: string
  role: string
  turnSummary?: string
}

export interface ChatHistoryListResponse extends CommonResponse {
  data: ChatHistoryItemResponse[]
}

export interface FaultTreeDetailResponse extends CommonResponse {
  data: FaultTreeResponse
}

export interface FaultTreeHistoryItemResponse {
  createdAt: string
  deviceType: string
  id: number
  knowledgeBaseName?: string
  rootNodeId: string
  treeName: string
  updatedAt: string
}

export interface FaultTreeHistoryListResponse extends CommonResponse {
  data: FaultTreeHistoryItemResponse[]
}

export interface FaultTreeNodeResponse {
  hasChildren: number
  nodeId: string
  nodeName: string
  nodeType: string
  parentId: string
  rules?: FaultTreeRuleResponse[]
}

export interface FaultTreeResponse {
  deviceType: string
  id: number
  knowledgeBaseName?: string
  nodes: FaultTreeNodeResponse[]
  rootNodeId: string
  treeName: string
}

export interface FaultTreeRuleResponse {
  condition: string
  deviceType: string
  duration: string
  measurePoint: string
  nodeId: string
}

export interface GenerateFaultTreeRequest {
  fault_content: string
  knowledge_base_name?: string
}

export interface ModifyFaultTreeDataResponse {
  faultTree: FaultTreeResponse
  modifyReason: string
  turnSummary: string
}

export interface ModifyFaultTreeDetailResponse extends CommonResponse {
  data: ModifyFaultTreeDataResponse
}

export interface ModifyFaultTreeRequest {
  fault_content: string
  id: number
  knowledge_base_name?: string
}
