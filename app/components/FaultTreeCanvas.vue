<script setup lang="ts">
import { Graph, History, Keyboard } from '@antv/x6'
import dagre from '@dagrejs/dagre'

import type { GraphEdge, GraphNode, GraphNodeData, GraphNodePosition } from '~/types/faultTree'

import { registerFaultTreeShapes } from '~/constants/faultTreeGraph'
import { mockFaultTreeData } from '~/constants/faultTreeMock'

const { clearSelection, selectNode } = useFaultTree()

const containerRef = ref<HTMLElement>()
let graph: Graph | null = null

useEventListener('resize', () => {
  graph?.resize(window.innerWidth, window.innerHeight)
})

onMounted(initGraph)

onUnmounted(() => {
  graph?.dispose()
})

function applyDagreLayout(nodes: GraphNode[], edges: GraphEdge[]) {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel({})
  g.setGraph({ nodesep: 40, rankdir: 'TB', ranksep: 80 })

  for (const node of nodes) g.setNode(node.id, { height: node.size.height, width: node.size.width })
  for (const edge of edges) g.setEdge(edge.source, edge.target)

  dagre.layout(g)

  for (const node of nodes) {
    const layoutNode = g.node(node.id) as GraphNodePosition
    node.position = {
      x: layoutNode.x - node.size.width / 2,
      y: layoutNode.y - node.size.height / 2
    }
  }

  return { edges, nodes }
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

  const { edges, nodes } = transformFaultTreeData()
  const layoutedData = applyDagreLayout(nodes, edges)
  graph.fromJSON(layoutedData)
  graph.centerContent()

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
}

function transformFaultTreeData(): { edges: GraphEdge[]; nodes: GraphNode[] } {
  const { nodes } = mockFaultTreeData

  const graphNodes: GraphNode[] = []
  const graphEdges: GraphEdge[] = []

  for (const node of nodes) {
    const nodeType = node.nodeType === 'GATE' ? 'gate' : 'event'
    const graphNode: GraphNode = {
      data: { description: node.nodeName, nodeType, probability: undefined },
      id: node.node_Id,
      label: node.nodeName,
      nodeType,
      size: nodeType === 'gate' ? { height: 40, width: 40 } : { height: 50, width: 140 }
    }
    graphNodes.push(graphNode)

    if (node.parentId) graphEdges.push({ shape: 'fault-tree-edge', source: node.parentId, target: node.node_Id })
  }

  return { edges: graphEdges, nodes: graphNodes }
}
</script>

<template>
  <div ref="containerRef" class="size-full bg-neutral-50" />
</template>
