import type { Graph } from '@antv/x6'

let graphState: Graph

export function useGraph() {
  return {
    exportAsImage,
    setGraph
  }
}

function exportAsImage() {
  graphState.exportPNG(`fault-tree-${Date.now()}.png`, { backgroundColor: '#ffffff', padding: 20 })
}

function setGraph(graph: Graph) {
  graphState = graph
}
