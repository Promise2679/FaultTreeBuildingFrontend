import type { GraphEdge, GraphNode, GraphNodeData } from '~/types/faultTree'

import { mockFaultTreeData } from '~/constants/faultTreeMock'

export interface SelectedNodeData {
  description?: string
  id: string
  label: string
  nodeType: 'event' | 'gate'
  probability?: number
}

const selectedNode = ref<null | SelectedNodeData>(null)
const isSidebarOpen = ref(false)

const graphState = ref<{ edges: GraphEdge[]; nodes: GraphNode[] }>({ edges: [], nodes: [] })
const { canRedo, canUndo, clear, commit, redo, undo } = useManualRefHistory(graphState, { capacity: 50, clone: true })

export function useFaultTree() {
  return {
    addChildNode,
    canAddChild,
    canRedo,
    canUndo,
    clearSelection,
    deleteNodeWithDescendants,
    graphState: readonly(graphState),
    isRootNode,
    isSidebarOpen: readonly(isSidebarOpen),
    redo,
    selectedNode: readonly(selectedNode),
    selectNode,
    transformFaultTreeData,
    undo,
    updateSelectedNode
  }
}

function addChildNode(parentId: string) {
  const parentNode = graphState.value.nodes.find(n => n.id === parentId)
  if (!parentNode?.data?.nodeType) return

  const isParentGate = parentNode.data.nodeType === 'gate'
  const newNodeType = isParentGate ? 'event' : 'gate'
  const newLabel = isParentGate ? '新事件' : 'AND'
  const newNodeId = crypto.randomUUID()

  const newNode: GraphNode = {
    data: { description: newLabel, hasChildren: 0, nodeType: newNodeType, probability: undefined },
    id: newNodeId,
    label: newLabel,
    size: newNodeType === 'gate' ? { height: 40, width: 40 } : { height: 50, width: 140 }
  }

  const newEdge: GraphEdge = { shape: 'fault-tree-edge', source: parentId, target: newNodeId }

  graphState.value.nodes.push(newNode)
  graphState.value.edges.push(newEdge)
  commit()

  if (typeof parentNode.data.hasChildren === 'number') parentNode.data.hasChildren++
}

function canAddChild(nodeType: string, nodeData: GraphNodeData) {
  if (nodeType === 'gate') return true
  if (nodeType === 'event') return !nodeData.hasChildren
  return false
}

function clearSelection() {
  selectedNode.value = null
  isSidebarOpen.value = false
}

function collectDescendantIds(nodeId: string, edges: GraphEdge[]) {
  const descendants: string[] = []
  const queue = [nodeId]

  while (queue.length > 0) {
    const currentId = queue.shift()
    const childEdges = edges.filter(e => e.source === currentId)
    for (const edge of childEdges) {
      descendants.push(edge.target)
      queue.push(edge.target)
    }
  }

  return descendants
}

function deleteNodeWithDescendants(nodeId: string) {
  if (isRootNode(nodeId)) return

  const { edges, nodes } = graphState.value
  const idsToDelete = new Set([nodeId, ...collectDescendantIds(nodeId, edges)])

  const parentEdge = edges.find(e => e.target === nodeId)
  if (parentEdge) {
    const parentNode = nodes.find(n => n.id === parentEdge.source)
    if (parentNode?.data && typeof parentNode.data.hasChildren === 'number') parentNode.data.hasChildren--
  }

  graphState.value.nodes = nodes.filter(n => !idsToDelete.has(n.id))
  graphState.value.edges = edges.filter(e => !idsToDelete.has(e.source) && !idsToDelete.has(e.target))
  commit()

  if (selectedNode.value && idsToDelete.has(selectedNode.value.id)) clearSelection()
}

function isRootNode(nodeId: string) {
  return !graphState.value.edges.some(e => e.target === nodeId)
}

function selectNode(node: SelectedNodeData) {
  selectedNode.value = node
  isSidebarOpen.value = true
}

function transformFaultTreeData() {
  const { nodes } = mockFaultTreeData

  for (const node of nodes) {
    const nodeType = node.nodeType === 'GATE' ? 'gate' : 'event'
    const graphNode: GraphNode = {
      data: { description: node.nodeName, hasChildren: node.hasChildren, nodeType, probability: undefined },
      id: node.nodeId,
      label: node.nodeName,
      size: nodeType === 'gate' ? { height: 40, width: 40 } : { height: 50, width: 140 }
    }
    graphState.value.nodes.push(graphNode)

    if (node.parentId)
      graphState.value.edges.push({ shape: 'fault-tree-edge', source: node.parentId, target: node.nodeId })
  }
  commit()
  clear()
}

function updateSelectedNode(updates: Partial<SelectedNodeData>) {
  if (selectedNode.value) selectedNode.value = { ...selectedNode.value, ...updates }
}
