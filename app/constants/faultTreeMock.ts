import type { HandlerFaultTreeResponse } from '~/types/faultTree'

export const mockFaultTreeData: HandlerFaultTreeResponse = {
  deviceType: '电机控制系统',
  id: 1,
  nodes: [
    { gate: 'OR', hasChildren: 2, nodeId: 'node_1', nodeName: '系统失效', nodeType: 'TOP', parentId: undefined },
    {
      gate: 'OR',
      hasChildren: 2,
      nodeId: 'node_2',
      nodeName: '电源故障',
      nodeType: 'INTERMEDIATE',
      parentId: 'node_1'
    },
    {
      gate: 'AND',
      hasChildren: 2,
      nodeId: 'node_3',
      nodeName: '控制单元故障',
      nodeType: 'INTERMEDIATE',
      parentId: 'node_1'
    },
    { hasChildren: 0, nodeId: 'node_4', nodeName: '电源输入中断', nodeType: 'BASIC', parentId: 'node_2' },
    { hasChildren: 0, nodeId: 'node_5', nodeName: '保险丝熔断', nodeType: 'BASIC', parentId: 'node_2' },
    { hasChildren: 0, nodeId: 'node_6', nodeName: 'CPU 故障', nodeType: 'BASIC', parentId: 'node_3' },
    { hasChildren: 0, nodeId: 'node_7', nodeName: '存储器故障', nodeType: 'BASIC', parentId: 'node_3' }
  ],
  rootNodeId: 'node_1',
  topEvent: '系统失效',
  treeName: '示例故障树'
}
