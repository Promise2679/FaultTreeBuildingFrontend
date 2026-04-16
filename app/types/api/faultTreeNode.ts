import type { CommonResponse } from './common'

export interface CreateNodeDetailResponse extends CommonResponse {
  data: CreateNodeResponse
}

export interface CreateNodeRequest {
  description?: string
  gate?: string
  level?: number
  node_name: string
  node_type: string
  parent_id?: string
  rules?: NodeRuleRequest[]
  source?: string
}

export interface CreateNodeResponse {
  nodeId: string
}

export interface FaultTreeRuleResponse {
  condition: string
  deviceType: string
  duration: string
  measurePoint: string
  nodeId: string
}

export interface GetNodeDetailResponse extends CommonResponse {
  data: GetNodeResponse
}

export interface GetNodeResponse {
  description: string
  hasChildren: number
  nodeId: string
  nodeName: string
  nodeType: string
  parentId: string
  rules: FaultTreeRuleResponse[]
  source: string
}

export interface NodeRuleRequest {
  condition?: string
  deviceType?: string
  duration?: string
  measurePoint?: string
}

export type UpdateNodeRequest = CreateNodeRequest
