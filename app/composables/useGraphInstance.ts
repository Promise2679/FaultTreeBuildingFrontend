import type { Graph } from '@antv/x6'

let graphState: Graph

export function exportAsImage() {
  graphState.exportPNG(`fault-tree-${Date.now()}.png`, { backgroundColor: '#ffffff', padding: 20 })
}

export function setGraph(graph: Graph) {
  graphState = graph
}

export function useGraphInstance() {
  return {
    exportAsImage,
    setGraph
  }
}
