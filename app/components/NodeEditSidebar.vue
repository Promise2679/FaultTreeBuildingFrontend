<script setup lang="ts">
const { clearSelection, saveNodeEdit, selectedNode } = useFaultTree()

const formData = reactive({ description: '', label: '', probability: 0 })

watchImmediate(selectedNode, node => {
  if (node) {
    formData.label = node.label
    formData.description = node.description ?? ''
    formData.probability = node.probability ?? 0
  }
})

function handleSave() {
  if (!selectedNode.value) return
  saveNodeEdit({ description: formData.description, label: formData.label, probability: formData.probability })
  clearSelection()
}
</script>

<template>
  <div class="fixed top-0 right-0 z-50 flex h-full w-80 flex-col border-l border-neutral-200 bg-neutral-50 shadow-lg">
    <div class="flex items-center justify-between border-b border-neutral-200 p-4">
      <h2 class="font-medium text-neutral-700">节点信息</h2>
      <UButton icon="i-lucide-x" size="sm" variant="ghost" @click="clearSelection" />
    </div>

    <div class="flex-1 overflow-auto p-4">
      <div class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-700">节点名称</label>
          <UInput v-model="formData.label" placeholder="请输入节点名称" />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-700">节点类型</label>
          <UInput :model-value="selectedNode?.nodeType === 'gate' ? '门节点 (Gate)' : '事件节点 (Event)'" readonly />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-700">描述</label>
          <UTextarea v-model="formData.description" placeholder="请输入描述" :rows="4" />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-700">失效概率</label>
          <UInput
            v-model="formData.probability"
            type="number"
            min="0"
            max="1"
            step="0.01"
            placeholder="0-1 之间的小数"
          />
        </div>
      </div>
    </div>

    <div class="border-t border-neutral-200 p-4">
      <div class="flex gap-2">
        <UButton color="primary" class="flex-1" @click="handleSave">保存</UButton>
        <UButton variant="outline" class="flex-1" @click="clearSelection">取消</UButton>
      </div>
    </div>
  </div>
</template>
