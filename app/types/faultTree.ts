export interface GraphEdge {
  shape?: string
  source: string
  target: string
}

export interface GraphNode {
  attrs?: Record<string, Record<string, any>>
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
}

export interface GraphNodePosition {
  x: number
  y: number
}

export interface SelectedNodeData {
  description?: string
  id: string
  label: string
  nodeType: 'event' | 'gate'
  rules?: SelectedNodeRule[]
  source?: string
}

export interface SelectedNodeRule {
  condition: string
  deviceType: string
  duration: string
  measurePoint: string
}
