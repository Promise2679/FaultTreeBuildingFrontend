export interface GraphEdge {
  source: string
  target: string
}

export interface GraphNode {
  data: { gate?: string; nodeType?: string }
  id: string
  label?: string
  position?: GraphNodePosition
  size: { height: number; width: number }
}

export interface GraphNodePosition {
  x: number
  y: number
}

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
