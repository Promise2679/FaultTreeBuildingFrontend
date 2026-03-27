export interface GraphEdge {
  shape?: string
  source: string
  target: string
}

export interface GraphNode {
  data?: GraphNodeData
  id: string
  label?: string
  nodeType?: 'event' | 'gate'
  position?: GraphNodePosition
  size: { height: number; width: number }
}

export interface GraphNodeData {
  description?: string
  nodeType?: string
  probability?: number
}

export interface GraphNodePosition {
  x: number
  y: number
}

export interface HandlerFaultTreeNodeResponse {
  hasChildren: number
  node_Id: string
  nodeName: string
  nodeType: string
  parentId: string
}

export interface HandlerFaultTreeResponse {
  deviceType: string
  id: number
  nodes: HandlerFaultTreeNodeResponse[]
  rootNodeId: string
  topEvent: string
  treeName: string
}
