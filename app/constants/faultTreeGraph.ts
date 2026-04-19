import { Graph } from '@antv/x6'

const OR_GATE_PATH = 'M 0 0 L 40 0 L 40 25 Q 40 45 20 50 Q 0 45 0 25 Z'
const AND_GATE_PATH = 'M 0 50 L 0 25 Q 0 0 20 0 Q 40 0 40 25 L 40 50 Z'

const FAULT_TREE_EDGE_CONFIG = {
  connector: { args: { radius: 8 }, name: 'rounded' },
  router: { name: 'orth' }
}

export function registerFaultTreeShapes() {
  Graph.registerNode('or-gate-node', {
    attrs: {
      body: {
        fill: '#fef3c7',
        refD: OR_GATE_PATH,
        stroke: '#f59e0b',
        strokeWidth: 2
      }
    },
    height: 50,
    inherit: 'path',
    width: 40
  })

  Graph.registerNode('and-gate-node', {
    attrs: {
      body: {
        fill: '#dbeafe',
        refD: AND_GATE_PATH,
        stroke: '#3b82f6',
        strokeWidth: 2
      }
    },
    height: 50,
    inherit: 'path',
    width: 40
  })

  Graph.registerNode('event-node', {
    attrs: {
      body: {
        fill: '#ffffff',
        rx: 4,
        ry: 4,
        stroke: '#d1d5db',
        strokeWidth: 1
      },
      label: {
        fontSize: 14,
        refX: '50%',
        refY: '50%',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        textWrap: {
          ellipsis: false,
          text: '',
          width: -20
        }
      }
    },
    height: 50,
    inherit: 'rect',
    width: 140
  })

  Graph.registerEdge('fault-tree-edge', FAULT_TREE_EDGE_CONFIG)
}

export const ADD_BUTTON_MARKUP = [
  {
    attrs: {
      cursor: 'pointer',
      cx: 0,
      cy: 0,
      fill: '#22c55e',
      r: 10,
      stroke: '#16a34a',
      'stroke-width': 1.5
    },
    tagName: 'circle'
  },
  {
    attrs: {
      cursor: 'pointer',
      'dominant-baseline': 'central',
      fill: '#ffffff',
      'font-size': 16,
      'font-weight': 'bold',
      'pointer-events': 'none',
      'text-anchor': 'middle'
    },
    tagName: 'text',
    textContent: '+'
  }
]
