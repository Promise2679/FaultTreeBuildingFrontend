export interface GraphEdge {
  shape?: string
  source: string
  target: string
}

export interface GraphNode {
  data?: GraphNodeData
  id: string
  label?: string
  position?: GraphNodePosition
  shape?: string
  size: { height: number; width: number }
}

export interface GraphNodeData {
  description?: string
  gate?: string
  hasChildren?: number
  nodeType?: string
  probability?: number
}

export interface GraphNodePosition {
  x: number
  y: number
}
