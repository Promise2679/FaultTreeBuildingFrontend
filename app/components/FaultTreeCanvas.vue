<script setup lang="ts">
import { Graph, History, Keyboard } from '@antv/x6'
import dagre from '@dagrejs/dagre'

import type { GraphEdge, GraphNode, GraphNodeData, GraphNodePosition } from '~/types/faultTree'

import { ADD_BUTTON_MARKUP, registerFaultTreeShapes } from '~/constants/faultTreeGraph'
import { mockFaultTreeData } from '~/constants/faultTreeMock'

const { clearSelection, selectNode } = useFaultTree()

const containerRef = ref<HTMLElement>()

const currentNodes: GraphNode[] = []
const currentEdges: GraphEdge[] = []

let graph: Graph | null = null

useEventListener('resize', () => {
  graph?.resize(window.innerWidth, window.innerHeight)
})

onMounted(initGraph)

onUnmounted(() => {
  graph?.dispose()
})

function addChildNode(parentId: string) {
  const parentNode = currentNodes.find(n => n.id === parentId)
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

  currentNodes.push(newNode)
  currentEdges.push(newEdge)

  if (typeof parentNode.data.hasChildren === 'number') parentNode.data.hasChildren++

  renderGraph()
}

function applyDagreLayout(nodes: GraphNode[], edges: GraphEdge[]) {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel({})
  g.setGraph({ nodesep: 40, rankdir: 'TB', ranksep: 80 })

  for (const node of nodes) g.setNode(node.id, { height: node.size.height, width: node.size.width })
  for (const edge of edges) g.setEdge(edge.source, edge.target)

  dagre.layout(g)

  for (const node of nodes) {
    const layoutNode = g.node(node.id) as GraphNodePosition
    node.position = { x: layoutNode.x - node.size.width / 2, y: layoutNode.y - node.size.height / 2 }
  }

  return { edges, nodes }
}

function canAddChild(nodeType: string, nodeData: GraphNodeData) {
  if (nodeType === 'gate') return true
  if (nodeType === 'event') return !nodeData.hasChildren
  return false
}

function initGraph() {
  if (!containerRef.value) return

  graph = new Graph({
    container: containerRef.value,
    grid: { size: 10, type: 'dot', visible: true },
    mousewheel: true
  })

  graph.use(new Keyboard({ enabled: true }))
  graph.use(new History({ enabled: true }))

  graph.bindKey('ctrl+z', () => graph?.undo())
  graph.bindKey('ctrl+y', () => graph?.redo())

  registerFaultTreeShapes()
  transformFaultTreeData()

  renderGraph()

  graph.on('node:click', ({ node }) => {
    const nodeData = node.getData<GraphNodeData>()
    const label = node.attr<string>('text/text')
    const nodeType = nodeData.nodeType
    selectNode({
      description: nodeData.description,
      id: node.id,
      label,
      nodeType: nodeType === 'gate' ? 'gate' : 'event',
      probability: nodeData.probability
    })
  })

  graph.on('blank:click', clearSelection)

  graph.on('node:mouseenter', ({ node }) => {
    const nodeData = node.getData<GraphNodeData>()
    const nodeType = nodeData.nodeType ?? ''
    if (!canAddChild(nodeType, nodeData)) return

    node.addTools({
      args: {
        markup: ADD_BUTTON_MARKUP,
        offset: { x: 0, y: 5 },
        onClick: ({ cell }: { cell: { id: string } }) => {
          addChildNode(cell.id)
        },
        x: '50%',
        y: '100%'
      },
      name: 'button'
    })
  })

  graph.on('node:mouseleave', ({ node }) => {
    if (node.hasTool('button')) node.removeTool('button')
  })
}

function renderGraph() {
  if (!graph) return

  const layoutedData = applyDagreLayout(currentNodes, currentEdges)
  graph.fromJSON(layoutedData)
  graph.centerContent()
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
    currentNodes.push(graphNode)

    if (node.parentId) currentEdges.push({ shape: 'fault-tree-edge', source: node.parentId, target: node.nodeId })
  }
}
</script>

<template>
  <div ref="containerRef" class="size-full bg-neutral-50" />
</template>
