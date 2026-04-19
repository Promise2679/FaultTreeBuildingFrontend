<script setup lang="ts">
import type { SelectedNodeData } from '~/types/faultTree'

const { clearSelection, isLoadingNodeDetail, saveNodeEdit, selectedNode } = useFaultTree()

const gateOptions = [
  { label: 'AND', value: 'and' },
  { label: 'OR', value: 'or' }
]

const formData = reactive<SelectedNodeData>({ description: '', id: '', label: '', nodeType: 'event' })

watchImmediate(selectedNode, node => {
  if (node) {
    formData.label = node.label
    formData.description = node.description ?? ''
    formData.id = node.id
    formData.nodeType = node.nodeType
    formData.rules = node.rules ? node.rules.map(r => ({ ...r })) : undefined
    formData.source = node.source ?? ''
  }
})

function addRule() {
  formData.rules ??= []
  formData.rules.push({ condition: '', deviceType: '', duration: '', measurePoint: '' })
}

async function handleSave() {
  if (!selectedNode.value) return
  await saveNodeEdit(formData)
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
          <template v-if="formData.nodeType === 'gate'">
            <USelect v-model="formData.label" :items="gateOptions" placeholder="选择门类型" />
          </template>
          <template v-else>
            <UInput model-value="事件节点 (Event)" readonly />
          </template>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-700">描述</label>
          <UTextarea v-model="formData.description" placeholder="请输入描述" :rows="4" />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-700">来源</label>
          <template v-if="isLoadingNodeDetail">
            <div
              class="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-400"
            >
              <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
              <span>加载中...</span>
            </div>
          </template>
          <template v-else>
            <UTextarea v-model="formData.source" placeholder="请输入来源" :rows="4" />
          </template>
        </div>

        <div>
          <div class="mb-1 flex items-center justify-between">
            <label class="text-sm font-medium text-neutral-700">规则</label>
            <UButton v-if="!isLoadingNodeDetail" icon="i-lucide-plus" size="xs" variant="ghost" @click="addRule" />
          </div>
          <template v-if="isLoadingNodeDetail">
            <div
              class="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-400"
            >
              <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
              <span>加载中...</span>
            </div>
          </template>
          <template v-else-if="formData.rules?.length">
            <div class="space-y-2">
              <div
                v-for="(rule, index) in formData.rules"
                :key="index"
                class="rounded-md border border-neutral-200 bg-white p-3"
              >
                <div class="mb-2 flex items-center justify-between">
                  <span class="text-xs font-medium text-neutral-500">规则 {{ index + 1 }}</span>
                  <UButton
                    icon="i-lucide-trash-2"
                    size="xs"
                    color="error"
                    variant="ghost"
                    @click="formData.rules?.splice(index, 1)"
                  />
                </div>
                <div class="space-y-2">
                  <div>
                    <label class="mb-0.5 block text-xs text-neutral-500">条件</label>
                    <UInput v-model="rule.condition" placeholder="请输入条件" size="sm" />
                  </div>
                  <div>
                    <label class="mb-0.5 block text-xs text-neutral-500">设备类型</label>
                    <UInput v-model="rule.deviceType" placeholder="请输入设备类型" size="sm" />
                  </div>
                  <div>
                    <label class="mb-0.5 block text-xs text-neutral-500">持续时间</label>
                    <UInput v-model="rule.duration" placeholder="请输入持续时间" size="sm" />
                  </div>
                  <div>
                    <label class="mb-0.5 block text-xs text-neutral-500">测量点</label>
                    <UInput v-model="rule.measurePoint" placeholder="请输入测量点" size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-400">暂无规则</div>
          </template>
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
