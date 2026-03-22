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

  registerGateNode()
  registerFaultTreeEdge()

  const { edges, nodes } = transformFaultTreeData()
  const layoutedData = applyDagreLayout(nodes, edges)
  graph.fromJSON(layoutedData)
  graph.centerContent()
}

function registerFaultTreeEdge() {
  Graph.registerEdge('fault-tree-edge', {
    connector: { args: { radius: 8 }, name: 'rounded' },
    router: { name: 'orth' }
  })
}

function registerGateNode() {
  Graph.registerNode('gate-node', {
    markup: [
      {
        attrs: { fill: '#fef3c7', refPoints: '0,10 10,0 20,10 10,20', stroke: '#f59e0b', 'stroke-width': 2 },
        tagName: 'polygon'
      },
      {
        attrs: {
          'dominant-baseline': 'middle',
          fill: '#92400e',
          'font-size': 14,
          'font-weight': 'bold',
          ref: 'label',
          'text-anchor': 'middle'
        },
        tagName: 'text'
      }
    ],
    propHooks(metadata: Record<string, unknown>) {
      return { label: metadata.label as string }
    }
  })
}

function transformFaultTreeData(): { edges: GraphEdge[]; nodes: GraphNode[] } {
  const { nodes } = mockFaultTreeData

  const graphNodes: GraphNode[] = []
  const graphEdges: GraphEdge[] = []

  for (const node of nodes) {
    node.nodeType === 'gate'
      ? graphNodes.push({ id: node.node_Id, label: node.nodeName, nodeType: 'gate', size: { height: 40, width: 40 } })
      : graphNodes.push({ id: node.node_Id, label: node.nodeName, nodeType: 'event', size: { height: 50, width: 140 } })

    if (node.parentId) graphEdges.push({ shape: 'fault-tree-edge', source: node.parentId, target: node.node_Id })
  }

  return { edges: graphEdges, nodes: graphNodes }
}
</script>

<template>
  <div ref="containerRef" class="size-full bg-neutral-50" />
</template>
