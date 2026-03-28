import type { CommonResponse } from './common'

export interface FaultTreeDetailResponse extends CommonResponse {
  data: FaultTreeResponse
}

export interface FaultTreeNodeResponse {
  hasChildren: number
  nodeId: string
  nodeName: string
  nodeType: string
  parentId: string
}

export interface FaultTreeResponse {
  deviceType: string
  id: number
  nodes: FaultTreeNodeResponse[]
  rootNodeId: string
  topEvent: string
  treeName: string
}

export interface GenerateFaultTreeRequest {
  deviceType: string
  faultContent: string
  treeName: string
}
