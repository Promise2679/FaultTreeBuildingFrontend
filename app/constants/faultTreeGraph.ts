import { Graph } from '@antv/x6'

const GATE_NODE_CONFIG = {
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
}

const FAULT_TREE_EDGE_CONFIG = {
  connector: { args: { radius: 8 }, name: 'rounded' },
  router: { name: 'orth' }
}

export function registerFaultTreeShapes() {
  Graph.registerNode('gate-node', GATE_NODE_CONFIG)
  Graph.registerEdge('fault-tree-edge', FAULT_TREE_EDGE_CONFIG)
}
