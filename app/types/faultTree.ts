export interface HandlerFaultTreeNodeResponse {
  gate?: string
  hasChildren: number
  nodeId: string
  nodeName: string
  nodeType: string
  parentId: string | undefined
}

export interface HandlerFaultTreeResponse {
  deviceType: string
  id: number
  nodes: HandlerFaultTreeNodeResponse[]
  rootNodeId: string
  topEvent: string
  treeName: string
}
