<script setup lang="ts">
import { Graph, History, Keyboard } from '@antv/x6'
import dagre from '@dagrejs/dagre'

import type { GraphEdge, GraphNode, GraphNodePosition } from '~/types/faultTree'

import { mockFaultTreeData } from '~/constants/faultTreeMock'

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

  for (const node of nodes)
    g.setNode(node.id, {
      height: node.size.height,
      width: node.size.width
    })

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

  const { edges, nodes } = transformFaultTreeData()
  const layoutedData = applyDagreLayout(nodes, edges)
  graph.fromJSON(layoutedData)
  graph.centerContent()
}

function transformFaultTreeData(): { edges: GraphEdge[]; nodes: GraphNode[] } {
  const { nodes } = mockFaultTreeData

  const graphNodes: GraphNode[] = nodes.map(node => ({
    data: { gate: node.gate, label: node.nodeName, nodeType: node.nodeType },
    id: node.nodeId,
    size: { height: 50, width: 140 }
  }))

  const graphEdges: GraphEdge[] = nodes
    .filter(node => node.parentId)
    .map(node => ({ source: node.parentId ?? '', target: node.nodeId }))

  return { edges: graphEdges, nodes: graphNodes }
}
</script>

<template>
  <div ref="containerRef" class="size-full bg-neutral-50" />
</template>
