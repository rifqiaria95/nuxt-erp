import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    isSidebarExpanded: true, // Sidebar is expanded by default
    isSidebarHovered: false, // Track hover state
    loading: false,
  }),
  actions: {
    setLoading(isLoading: boolean) {
      this.loading = isLoading;
    },
    toggleSidebar() {
      this.isSidebarExpanded = !this.isSidebarExpanded;
      this.updateHtmlClasses();
    },
    
    setSidebarHovered(isHovered: boolean) {
      if (!this.isSidebarExpanded) { // Only apply hover effect when collapsed
        this.isSidebarHovered = isHovered;
        this.updateHtmlClasses();
      }
    },

    // Centralized function to manage all layout classes on the <html> tag
    updateHtmlClasses() {
        if (!process.client) return;
        const html = document.documentElement;

        // Handle expanded/collapsed state
        if (this.isSidebarExpanded) {
          html.classList.add('layout-menu-expanded');
          html.classList.remove('layout-menu-collapsed');
        } else {
          html.classList.remove('layout-menu-expanded');
          html.classList.add('layout-menu-collapsed');
        }

        // Handle hover state
        if (this.isSidebarHovered) {
          html.classList.add('layout-menu-hover');
        } else {
          html.classList.remove('layout-menu-hover');
        }
    },

    initializeLayout() {
        this.updateHtmlClasses();
    }
  },
}); 