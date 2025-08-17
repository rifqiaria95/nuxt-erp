<template>
  <div class="layout-wrapper layout-content-navbar">
    <div class="layout-container">
      <Sidebar />
      <div class="layout-overlay layout-menu-toggle" @click="closeSidebar"></div>

      <div class="layout-page">
        <Navbar />
        <div class="content-wrapper">
          <div class="container-xxl flex-grow-1 container-p-y">
            <slot />
          </div>
          <Footer />
          <div class="content-backdrop fade"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLayoutStore } from '~/stores/layout';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const title = route.meta.title;

const layoutStore = useLayoutStore();

onMounted(() => {
    layoutStore.initializeLayout();
});

const closeSidebar = () => {
    if (layoutStore.isSidebarExpanded) {
        layoutStore.toggleSidebar();
    }
};

// Import your components
import Sidebar from '~/components/Sidebar.vue';
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';

</script>

<style>

</style>