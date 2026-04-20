<script setup lang="ts">
const { isSidebarOpen } = useFaultTree()
</script>

<template>
  <AppHeader />
  <ChatSidebar />
  <FaultTreeCanvas class="fixed inset-0" />
  <NodeEditSidebar v-if="isSidebarOpen" />
</template>
