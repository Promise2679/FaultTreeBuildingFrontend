<script setup lang="ts">
import { Graph, Keyboard } from '@antv/x6'
import dagre from '@dagrejs/dagre'

import type { GraphEdge, GraphNode, GraphNodeData, GraphNodePosition } from '~/types/faultTree'

import { ADD_BUTTON_MARKUP, registerFaultTreeShapes } from '~/constants/faultTreeGraph'

const {
  addChildNode,
  canAddChild,
  canRedo,
  canUndo,
  clearSelection,
  deleteNodeWithDescendants,
  graphState,
  isRootNode,
  redo,
  selectedNode,
  selectNode,
  transformFaultTreeData,
  undo
} = useFaultTree()

const containerRef = ref<HTMLElement>()

let graph: Graph | null = null

watchDeep(graphState, renderGraph)

useEventListener('resize', () => {
  graph?.resize(window.innerWidth, window.innerHeight)
})

useEventListener('keydown', handleKeyDown)

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
    node.position = { x: layoutNode.x - node.size.width / 2, y: layoutNode.y - node.size.height / 2 }
  }

  return { edges, nodes }
}

function handleKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault()
    if (e.shiftKey && canRedo.value) redo()
    else if (canUndo.value) undo()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    e.preventDefault()
    if (canRedo.value) redo()
  }
  if (e.key === 'Delete' && selectedNode.value && !isRootNode(selectedNode.value.id)) {
    e.preventDefault()
    deleteNodeWithDescendants(selectedNode.value.id)
  }
}

function initGraph() {
  if (!containerRef.value) return

  graph = new Graph({
    container: containerRef.value,
    grid: { size: 10, type: 'dot', visible: true },
    mousewheel: true
  })

  graph.use(new Keyboard({ enabled: true }))

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
    node.removeTools()
  })
}

function renderGraph() {
  if (!graph) return

  const nodes = graphState.value.nodes.map(n => ({ ...n }))
  const edges = graphState.value.edges.map(e => ({ ...e }))
  const layoutedData = applyDagreLayout(nodes, edges)
  graph.fromJSON(layoutedData)
  graph.centerContent()
}
</script>

<template>
  <div ref="containerRef" class="size-full bg-neutral-50" />
</template>
