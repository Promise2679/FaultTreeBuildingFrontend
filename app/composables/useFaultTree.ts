import type { FaultTreeResponse } from '~/types/api/faultTree'
import type { CreateNodeRequest, UpdateNodeRequest } from '~/types/api/faultTreeNode'
import type { GraphEdge, GraphNode, GraphNodeData } from '~/types/faultTree'

import { faultTreeNodeApi } from '~/utils/api/faultTreeNode'

export interface SelectedNodeData {
  description?: string
  id: string
  label: string
  nodeType: 'event' | 'gate'
  probability?: number
}

const selectedNode = ref<SelectedNodeData>()
const isSidebarOpen = ref(false)
const currentFaultTreeId = ref<number>()

const graphState = ref<{ edges: GraphEdge[]; nodes: GraphNode[] }>({ edges: [], nodes: [] })
const { canRedo, canUndo, clear, commit, redo, undo } = useManualRefHistory(graphState, { capacity: 50, clone: true })

export function useFaultTree() {
  return {
    addChildNode,
    canAddChild,
    canRedo,
    canUndo,
    clearSelection,
    currentFaultTreeId,
    deleteNodeWithDescendants,
    graphState: readonly(graphState),
    isRootNode,
    isSidebarOpen: readonly(isSidebarOpen),
    redo,
    saveNodeEdit,
    selectedNode: readonly(selectedNode),
    selectNode,
    transformFaultTreeData,
    undo
  }
}

function addChildNode(parentId: string) {
  const parentNode = graphState.value.nodes.find(n => n.id === parentId)
  if (!parentNode?.data?.nodeType) return

  const isParentGate = parentNode.data.nodeType === 'gate'
  const newNodeType = isParentGate ? 'event' : 'gate'
  const newLabel = isParentGate ? '新事件' : 'AND'
  const tempNodeId = crypto.randomUUID()

  const newNode: GraphNode = {
    data: {
      description: newLabel,
      gate: isParentGate ? undefined : 'AND',
      hasChildren: 0,
      nodeType: newNodeType,
      probability: undefined
    },
    id: tempNodeId,
    label: isParentGate ? newLabel : undefined,
    shape: isParentGate ? undefined : 'and-gate-node',
    size: newNodeType === 'gate' ? { height: 50, width: 40 } : { height: 50, width: 140 }
  }

  const newEdge: GraphEdge = { shape: 'fault-tree-edge', source: parentId, target: tempNodeId }

  graphState.value.nodes.push(newNode)
  graphState.value.edges.push(newEdge)
  if (typeof parentNode.data.hasChildren === 'number') parentNode.data.hasChildren++
  commit()

  if (currentFaultTreeId.value == null) return

  const faultTreeId = currentFaultTreeId.value
  const request = buildCreateNodeRequest(newNode, parentId)

  faultTreeNodeApi
    .create(faultTreeId, request)
    .then(res => {
      const backendNodeId = res.data.nodeId
      if (backendNodeId && backendNodeId !== tempNodeId) {
        replaceNodeId(tempNodeId, backendNodeId)
        commit()
      }
    })
    .catch(() => {
      undo()
    })
}

function buildCreateNodeRequest(node: GraphNode, parentId?: string): CreateNodeRequest {
  return {
    description: node.data?.description,
    gate: node.data?.gate,
    node_name: node.label ?? node.data?.gate ?? '',
    node_type: node.data?.nodeType ?? 'event',
    parent_id: parentId
  }
}

function buildUpdateNodeRequest(node: GraphNode): UpdateNodeRequest {
  return {
    description: node.data?.description,
    gate: node.data?.gate,
    node_name: node.label ?? node.data?.gate ?? '',
    node_type: node.data?.nodeType ?? 'event',
    parent_id: findParentId(node.id)
  }
}

function canAddChild(nodeType: string, nodeData: GraphNodeData) {
  if (nodeType === 'gate') return true
  if (nodeType === 'event') return !nodeData.hasChildren
  return false
}

function clearSelection() {
  selectedNode.value = undefined
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

  if (currentFaultTreeId.value == null) return

  faultTreeNodeApi.delete(currentFaultTreeId.value, nodeId).catch(() => {
    undo()
  })
}

function findParentId(nodeId: string): string | undefined {
  const edge = graphState.value.edges.find(e => e.target === nodeId)
  return edge?.source
}

function getGateShape(gateName: string) {
  return gateName === 'or' ? 'or-gate-node' : 'and-gate-node'
}

function isRootNode(nodeId: string) {
  return !graphState.value.edges.some(e => e.target === nodeId)
}

function replaceNodeId(oldId: string, newId: string) {
  const node = graphState.value.nodes.find(n => n.id === oldId)
  if (node) node.id = newId

  for (const edge of graphState.value.edges) {
    if (edge.source === oldId) edge.source = newId
    if (edge.target === oldId) edge.target = newId
  }

  if (selectedNode.value?.id === oldId) selectedNode.value = { ...selectedNode.value, id: newId }
}

function saveNodeEdit(updates: { description?: string; label: string; probability?: number }) {
  if (!selectedNode.value) return

  const nodeId = selectedNode.value.id
  const node = graphState.value.nodes.find(n => n.id === nodeId)
  if (!node) return

  const oldNodeType = selectedNode.value.nodeType
  const isGate = oldNodeType === 'gate'

  if (node.data) {
    node.data.description = updates.description
    node.data.probability = updates.probability
    if (isGate) {
      node.data.gate = updates.label
      node.shape = getGateShape(updates.label.toLowerCase())
    }
  }
  if (!isGate) node.label = updates.label

  commit()

  selectedNode.value = {
    ...selectedNode.value,
    description: updates.description,
    label: updates.label,
    probability: updates.probability
  }

  if (currentFaultTreeId.value == null) return

  const request = buildUpdateNodeRequest(node)

  faultTreeNodeApi.update(currentFaultTreeId.value, nodeId, request).catch(() => {
    undo()
  })
}

function selectNode(node: SelectedNodeData) {
  selectedNode.value = node
  isSidebarOpen.value = true
}

function transformFaultTreeData(data: FaultTreeResponse) {
  graphState.value.nodes = []
  graphState.value.edges = []
  const { nodes } = data

  for (const node of nodes) {
    const isGate = node.nodeType === 'gate'
    const nodeType = isGate ? 'gate' : 'event'
    const graphNode: GraphNode = {
      data: {
        description: node.nodeName,
        gate: isGate ? node.nodeName : undefined,
        hasChildren: node.hasChildren,
        nodeType,
        probability: undefined
      },
      id: node.nodeId,
      label: isGate ? undefined : node.nodeName,
      shape: isGate ? getGateShape(node.nodeName) : undefined,
      size: isGate ? { height: 50, width: 40 } : { height: 50, width: 140 }
    }
    graphState.value.nodes.push(graphNode)

    if (node.parentId)
      graphState.value.edges.push({ shape: 'fault-tree-edge', source: node.parentId, target: node.nodeId })
  }
  commit()
  clear()
}
