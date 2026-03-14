<script setup lang="ts">
import { Graph, History, Keyboard } from '@antv/x6'

const containerRef = ref<HTMLElement>()
let graph: Graph | null = null

const initGraph = () => {
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

  graph.addNode({
    attrs: {
      body: { fill: '#f3f4f6', rx: 4, ry: 4, stroke: '#374151', strokeWidth: 1 },
      label: { fill: '#111827', fontSize: 14 }
    },
    height: 40,
    id: 'root',
    label: '顶事件',
    width: 120,
    x: window.innerWidth / 2,
    y: 100
  })
}

useEventListener('resize', () => {
  graph?.resize(window.innerWidth, window.innerHeight)
})

onMounted(() => {
  initGraph()
})

onUnmounted(() => {
  graph?.dispose()
})
</script>

<template>
  <div ref="containerRef" class="w-full h-full bg-white" />
</template>
