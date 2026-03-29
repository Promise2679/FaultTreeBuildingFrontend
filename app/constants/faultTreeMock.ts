import type { FaultTreeResponse } from '~/types/api/faultTree'

export const mockFaultTreeData: FaultTreeResponse = {
  deviceType: '电机控制系统',
  id: 1,
  nodes: [
    { hasChildren: 1, nodeId: 'node_1', nodeName: '系统失效', nodeType: 'TOP', parentId: '' },
    { hasChildren: 2, nodeId: 'gate_1', nodeName: 'OR', nodeType: 'GATE', parentId: 'node_1' },
    { hasChildren: 1, nodeId: 'node_2', nodeName: '电源故障', nodeType: 'INTERMEDIATE', parentId: 'gate_1' },
    { hasChildren: 2, nodeId: 'gate_2', nodeName: 'OR', nodeType: 'GATE', parentId: 'node_2' },
    { hasChildren: 1, nodeId: 'node_3', nodeName: '控制单元故障', nodeType: 'INTERMEDIATE', parentId: 'gate_1' },
    { hasChildren: 2, nodeId: 'gate_3', nodeName: 'AND', nodeType: 'GATE', parentId: 'node_3' },
    { hasChildren: 0, nodeId: 'node_4', nodeName: '电源输入中断', nodeType: 'BASIC', parentId: 'gate_2' },
    { hasChildren: 0, nodeId: 'node_5', nodeName: '保险丝熔断', nodeType: 'BASIC', parentId: 'gate_2' },
    { hasChildren: 0, nodeId: 'node_6', nodeName: 'CPU 故障', nodeType: 'BASIC', parentId: 'gate_3' },
    { hasChildren: 0, nodeId: 'node_7', nodeName: '存储器故障', nodeType: 'BASIC', parentId: 'gate_3' }
  ],
  rootNodeId: 'node_1',
  topEvent: '系统失效',
  treeName: '示例故障树'
}
