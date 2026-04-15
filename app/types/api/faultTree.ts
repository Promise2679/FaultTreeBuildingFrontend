import type { CommonResponse } from './common'

export interface FaultTreeDetailResponse extends CommonResponse {
  data: FaultTreeResponse
}

export interface FaultTreeHistoryItemResponse {
  createdAt: string
  deviceType: string
  id: number
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
  nodes: FaultTreeNodeResponse[]
  rootNodeId: string
  topEvent?: string
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
  conversationContext?: string
  faultContent: string
  id: number
}
