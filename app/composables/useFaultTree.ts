export interface SelectedNodeData {
  description?: string
  id: string
  label: string
  nodeType: 'event' | 'gate'
  probability?: number
}

const selectedNode = ref<null | SelectedNodeData>(null)
const isSidebarOpen = ref(false)

export function useFaultTree() {
  function selectNode(node: SelectedNodeData) {
    selectedNode.value = node
    isSidebarOpen.value = true
  }

  function clearSelection() {
    selectedNode.value = null
    isSidebarOpen.value = false
  }

  function updateSelectedNode(updates: Partial<SelectedNodeData>) {
    if (selectedNode.value) selectedNode.value = { ...selectedNode.value, ...updates }
  }

  return {
    clearSelection,
    isSidebarOpen: readonly(isSidebarOpen),
    selectedNode: readonly(selectedNode),
    selectNode,
    updateSelectedNode
  }
}
