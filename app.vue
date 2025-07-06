<template>
  <div>
    <LoadingOverlay />
    <NuxtLayout>
      <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// 
</script>

<style>
.page-enter-active, .page-leave-active {
  transition: opacity 0.3s;
}
.page-enter-from, .page-leave-to {
  opacity: 0;
}
</style>