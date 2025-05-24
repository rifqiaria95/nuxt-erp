<template>
  <div class="layout-wrapper layout-content-navbar">
    <div class="layout-container">
      <Sidebar />

      <div class="layout-page">
        <Navbar />
        <div class="content-wrapper">
          <slot />
          <Footer />
        </div>
      </div>

      <div class="layout-overlay layout-menu-toggle"></div>
      <div class="drag-target"></div>
    </div>
  </div>
</template>

<script setup>
// Import your components
import Sidebar from '~/components/Sidebar.vue';
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';

</script>

<style>

</style>