import type { FaultTreeResponse } from '~/types/api/faultTree'
import type { GraphEdge, GraphNode, GraphNodeData, SelectedNodeData } from '~/types/faultTree'

import { faultTreeNodeApi } from '~/api/faultTreeNode'

const selectedNode = ref<SelectedNodeData>()
const isSidebarOpen = ref(false)
const isLoadingNodeDetail = ref(false)
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
    isLoadingNodeDetail: readonly(isLoadingNodeDetail),
    isRootNode,
    isSidebarOpen: readonly(isSidebarOpen),
    redo,
    resetFaultTree,
    saveNodeEdit,
    selectedNode: readonly(selectedNode),
    selectNode,
    transformFaultTreeData,
    undo
  }
}

async function addChildNode(parentId: string) {
  const parentNode = graphState.value.nodes.find(n => n.id === parentId)
  if (!parentNode?.data?.nodeType || currentFaultTreeId.value == null) return

  const isParentGate = parentNode.data.nodeType === 'gate'
  const newNodeType = isParentGate ? 'event' : 'gate'
  const newLabel = isParentGate ? '新事件' : 'and'

  const res = await faultTreeNodeApi.create(currentFaultTreeId.value, {
    description: newLabel,
    gate: isParentGate ? undefined : 'and',
    node_name: newLabel,
    node_type: newNodeType,
    parent_id: parentId
  })

  const backendNodeId = res.data.nodeId
  const isEvent = newNodeType === 'event'
  const newNode: GraphNode = {
    attrs: isEvent ? { label: { textWrap: { text: newLabel } } } : undefined,
    data: {
      description: newLabel,
      gate: isParentGate ? undefined : 'and',
      hasChildren: 0,
      nodeType: newNodeType
    },
    id: backendNodeId,
    shape: isEvent ? 'event-node' : 'and-gate-node',
    size: isEvent ? { height: calculateEventNodeHeight(newLabel), width: 140 } : { height: 50, width: 40 }
  }

  const newEdge: GraphEdge = { shape: 'fault-tree-edge', source: parentId, target: backendNodeId }

  graphState.value.nodes.push(newNode)
  graphState.value.edges.push(newEdge)
  if (typeof parentNode.data.hasChildren === 'number') parentNode.data.hasChildren++
  commit()
}

function calculateEventNodeHeight(label: string) {
  let textWidth = 0
  for (const ch of label) {
    const code = ch.codePointAt(0)
    if (code == null) continue
    textWidth += code > 127 ? 14 : 7
  }

  const lines = Math.max(1, Math.ceil(textWidth / 120))
  return Math.max(40, 20 * lines + 16)
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

  while (queue.length) {
    const currentId = queue.shift()
    const childEdges = edges.filter(e => e.source === currentId)
    for (const edge of childEdges) {
      descendants.push(edge.target)
      queue.push(edge.target)
    }
  }

  return descendants
}

async function deleteNodeWithDescendants(nodeId: string) {
  if (isRootNode(nodeId) || currentFaultTreeId.value == null) return

  await faultTreeNodeApi.delete(currentFaultTreeId.value, nodeId)

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

function getGateShape(gateName: string) {
  return gateName === 'or' ? 'or-gate-node' : 'and-gate-node'
}

function isRootNode(nodeId: string) {
  return !graphState.value.edges.some(e => e.target === nodeId)
}

function resetFaultTree() {
  graphState.value = { edges: [], nodes: [] }
  currentFaultTreeId.value = undefined
  clearSelection()
  commit()
  clear()
}

async function saveNodeEdit(updates: SelectedNodeData) {
  if (!selectedNode.value || currentFaultTreeId.value == null) return

  const nodeId = selectedNode.value.id
  const node = graphState.value.nodes.find(n => n.id === nodeId)
  if (!node) return

  const oldNodeType = selectedNode.value.nodeType
  const isGate = oldNodeType === 'gate'

  await faultTreeNodeApi.update(currentFaultTreeId.value, nodeId, {
    description: updates.description,
    gate: isGate ? updates.label : node.data?.gate,
    node_name: updates.label,
    node_type: node.data?.nodeType ?? 'event',
    parent_id: graphState.value.edges.find(e => e.target === node.id)?.source,
    rules: updates.rules?.map(r => ({
      condition: r.condition,
      deviceType: r.deviceType,
      duration: r.duration,
      measurePoint: r.measurePoint
    })),
    source: updates.source
  })

  if (node.data) {
    node.data.description = updates.description
    if (isGate) {
      node.data.gate = updates.label
      node.shape = getGateShape(updates.label)
    }
  }
  if (!isGate) {
    node.attrs ??= {}
    node.attrs.label = { ...node.attrs.label, textWrap: { text: updates.label } }
    node.size = { height: calculateEventNodeHeight(updates.label), width: 140 }
  }

  commit()

  selectedNode.value = {
    ...selectedNode.value,
    description: updates.description,
    label: updates.label,
    rules: updates.rules,
    source: updates.source
  }
}

async function selectNode(node: SelectedNodeData) {
  selectedNode.value = node
  isSidebarOpen.value = true
  if (currentFaultTreeId.value == null) return

  isLoadingNodeDetail.value = true
  try {
    const res = await faultTreeNodeApi.getById(currentFaultTreeId.value, node.id)
    const detail = res.data
    if (selectedNode.value.id !== node.id) return

    selectedNode.value = {
      ...selectedNode.value,
      description: detail.description,
      rules: detail.rules.map(r => ({
        condition: r.condition,
        deviceType: r.deviceType,
        duration: r.duration,
        measurePoint: r.measurePoint
      })),
      source: detail.source
    }
  } finally {
    isLoadingNodeDetail.value = false
  }
}

function transformFaultTreeData(data: FaultTreeResponse) {
  currentFaultTreeId.value = data.id
  graphState.value.nodes = []
  graphState.value.edges = []
  const { nodes } = data

  for (const node of nodes) {
    const isGate = node.nodeType === 'gate'
    const nodeType = isGate ? 'gate' : 'event'
    const graphNode: GraphNode = {
      attrs: isGate ? undefined : { label: { textWrap: { text: node.nodeName } } },
      data: {
        description: node.nodeName,
        gate: isGate ? node.nodeName : undefined,
        hasChildren: node.hasChildren,
        nodeType
      },
      id: node.nodeId,
      shape: isGate ? getGateShape(node.nodeName) : 'event-node',
      size: isGate ? { height: 50, width: 40 } : { height: calculateEventNodeHeight(node.nodeName), width: 140 }
    }
    graphState.value.nodes.push(graphNode)

    if (node.parentId)
      graphState.value.edges.push({ shape: 'fault-tree-edge', source: node.parentId, target: node.nodeId })
  }
  commit()
  clear()
}
