<template>
  <AppHeader />
  <ChatSidebar />
  <FaultTreeCanvas class="fixed inset-0" />
  <NodeEditSidebar v-if="isSidebarOpen" />
</template>

<script setup lang="ts">
const { isSidebarOpen } = useFaultTree()
</script>
