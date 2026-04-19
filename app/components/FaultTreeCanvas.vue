<script setup lang="ts">
import { Export, Graph, Keyboard } from '@antv/x6'
import dagre from '@dagrejs/dagre'

import type { GraphEdge, GraphNode, GraphNodeData, GraphNodePosition } from '~/types/faultTree'

import { ADD_BUTTON_MARKUP, registerFaultTreeShapes } from '~/constants/faultTreeGraph'
import { faultTreeApi } from '~/utils/api/faultTree'

const { setGraph } = useGraph()

const {
  addChildNode,
  canAddChild,
  canRedo,
  canUndo,
  clearSelection,
  currentFaultTreeId,
  deleteNodeWithDescendants,
  graphState,
  isRootNode,
  redo,
  selectedNode,
  selectNode,
  transformFaultTreeData,
  undo
} = useFaultTree()

const loading = ref(false)

watch(currentFaultTreeId, async id => {
  if (id == null) return
  await loadFaultTreeById(id)
})

let graph: Graph | null = null
const containerRef = ref<HTMLElement>()

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

async function handleKeyDown(e: KeyboardEvent) {
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
    await deleteNodeWithDescendants(selectedNode.value.id)
  }
}

async function initGraph() {
  if (!containerRef.value) return

  graph = new Graph({
    container: containerRef.value,
    grid: { size: 10, type: 'dot', visible: true },
    mousewheel: true
  })

  graph.use(new Keyboard({ enabled: true }))
  graph.use(new Export())

  setGraph(graph)
  registerFaultTreeShapes()

  await nextTick()
  graph.resize(window.innerWidth, window.innerHeight)

  renderGraph()

  graph.on('node:click', async ({ node }) => {
    const nodeData = node.getData<GraphNodeData>()
    const isGate = nodeData.nodeType === 'gate'
    const textWrap = node.attr<{ text?: string }>('label/textWrap')
    const label = isGate ? (nodeData.gate ?? 'AND') : (textWrap.text ?? '')
    await selectNode({
      description: nodeData.description,
      id: node.id,
      label,
      nodeType: isGate ? 'gate' : 'event'
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
        onClick: async ({ cell }: { cell: { id: string } }) => {
          await addChildNode(cell.id)
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

async function loadFaultTreeById(id: number) {
  loading.value = true
  try {
    const res = await faultTreeApi.getById(id)
    transformFaultTreeData(res.data)
    renderGraph()
  } finally {
    loading.value = false
  }
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
  <div class="relative size-full">
    <div ref="containerRef" class="size-full bg-neutral-50" />
    <div v-if="loading" class="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
      <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-neutral-400" />
    </div>
    <div
      v-else-if="!graphState.nodes.length"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center text-neutral-400"
    >
      <UIcon name="i-lucide-git-fork" class="mb-3 size-12" />
      <p class="text-sm">通过左侧聊天生成故障树，或从历史记录中选择</p>
    </div>
  </div>
</template>
