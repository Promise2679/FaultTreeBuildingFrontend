<script setup lang="ts">
defineProps<{ actionText: string; elapsed: number }>()
</script>

<template>
  <div class="flex items-center gap-2 px-2 py-3 text-sm text-neutral-500">
    <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
    <span>正在{{ actionText }}故障树... 已耗时 {{ elapsed }}s</span>
  </div>
</template>
