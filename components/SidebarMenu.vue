
<template>
  <nav class="sidebar sidebar-offcanvas" id="sidebar">
    <ul class="nav">
      <li class="nav-item">
        <a class="nav-link" href="index.html">
          <i class="mdi mdi-grid-large menu-icon"></i>
          <span class="menu-title">Dashboard</span>
        </a>
      </li>
      <li class="nav-item nav-category">Apps</li>
      <li class="nav-item">
        <a class="nav-link" href="/todo">
          <i class="menu-icon mdi mdi-file-document"></i>
          <span class="menu-title">Task</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
import { menuItems } from '~/data/menu';

export default {
  name: 'Menu',
  data() {
    return {
      menuItems,
      currentYear: new Date().getFullYear()
    };
  },
};
</script>

<style>
</style>