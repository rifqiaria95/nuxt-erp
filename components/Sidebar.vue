  <template>
    <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <div class="app-brand demo">
        <a href="index.html" class="app-brand-link">
          <span class="app-brand-logo demo">
            <img src="/public/img/branding/logo.png" alt="" height="40" />
          </span>
          <span class="app-brand-text demo menu-text fw-semibold ms-2">Kainnova</span>
        </a>
        <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto" @click="toggleSidebar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.47365 11.7183C8.11707 12.0749 8.11707 12.6531 8.47365 13.0097L12.071 16.607C12.4615 16.9975 12.4615 17.6305 12.071 18.021C11.6805 18.4115 11.0475 18.4115 10.657 18.021L5.83009 13.1941C5.37164 12.7356 5.37164 11.9924 5.83009 11.5339L10.657 6.707C11.0475 6.31653 11.6805 6.31653 12.071 6.707C12.4615 7.09747 12.4615 7.73053 12.071 8.121L8.47365 11.7183Z"
              fill-opacity="0.9" />
            <path
              d="M14.3584 11.8336C14.0654 12.1266 14.0654 12.6014 14.3584 12.8944L18.071 16.607C18.4615 16.9975 18.4615 17.6305 18.071 18.021C17.6805 18.4115 17.0475 18.4115 16.657 18.021L11.6819 13.0459C11.3053 12.6693 11.3053 12.0587 11.6819 11.6821L16.657 6.707C17.0475 6.31653 17.6805 6.31653 18.071 6.707C18.4615 7.09747 18.4615 7.73053 18.071 8.121L14.3584 11.8336Z"
              fill-opacity="0.4" />
          </svg>
        </a>
      </div>

      <div class="menu-inner-shadow"></div>

      <ul class="menu-inner py-7">
        <!-- Dashboards -->
        <li class="menu-item" :class="{ active: $route.path === '/dashboard' }">
          <a href="/dashboard" class="menu-link" @click="handleMenuClick">
            <i class="menu-icon tf-icons ri-home-smile-line"></i>
            <div data-i18n="Dashboards">Dashboards</div>
          </a>
        </li>

        <!-- Apps & Pages -->
        <li class="menu-header mt-5">
          <span class="menu-header-text" data-i18n="Apps & Pages">Apps &amp; Pages</span>
        </li>
        <template v-if="filteredAndSortedMenuGroups.length">
          <li
            class="menu-item"
            v-for="group in filteredAndSortedMenuGroups"
            :key="group.id"
            :class="{
              open: isGroupOpen(group),
              active: isGroupActive(group)
            }"
          >
            <a href="javascript:void(0);" class="menu-link menu-toggle" @click="toggleGroup(group.id)">
              <i :class="['menu-icon', 'tf-icons', group.icon]"></i>
              <div>{{ group.name }}</div>
            </a>
            <transition
              name="menu-expand"
              @before-enter="beforeEnter"
              @enter="enter"
              @after-enter="afterEnter"
              @before-leave="beforeLeave"
              @leave="leave"
            >
              <ul class="menu-sub" v-show="isGroupOpen(group)" v-if="group.menuDetails && group.menuDetails.length">
                <li
                  class="menu-item"
                  v-for="detail in [...group.menuDetails].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))"
                  :key="detail.id"
                  :class="{ active: detail.route === $route.path }"
                  @mouseenter="handlePrefetch(detail.route)"
                >
                  <NuxtLink :to="detail.route" class="menu-link" @click="handleMenuClick">
                    <div>{{ detail.name }}</div>
                  </NuxtLink>
                </li>
              </ul>
            </transition>
          </li>
        </template>
      </ul>
    </aside>
  </template>

  <script setup>
    import { useMenuGroupStore } from '~/stores/menu-group';
    import { useMenuDetailStore } from '~/stores/menu-detail';
    import { useCustomerStore } from '~/stores/customer';
    import { ref, onMounted, watch, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { useLayoutStore } from '~/stores/layout';
    import { useUserStore } from '~/stores/user';

    const menuGroupsStore = useMenuGroupStore();
    const menuDetailsStore = useMenuDetailStore();
    const route = useRoute();
    const layoutStore = useLayoutStore();
    const customerStore = useCustomerStore();
    const userStore = useUserStore();

    const openGroupIds = ref(new Set());
    const isNavigatingFromMenu = ref(false);

    const isSuperAdmin = computed(() => {
      return userStore.user?.roles.some(role => role.name === 'superadmin');
    });

    const filteredAndSortedMenuGroups = computed(() => {
      // Pastikan user store sudah siap
      if (!userStore.user) return [];
      
      // Gunakan filteredMenuGroups dari store yang sudah memfilter berdasarkan permission
      const filteredGroups = menuGroupsStore.filteredMenuGroups;
      
      if (!filteredGroups || filteredGroups.length === 0) return [];

      return filteredGroups.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });

    const prefetchMap = {
      '/master/customer': () => customerStore.prefetchCustomers(),
      '/admin/menu-group': () => menuGroupsStore.prefetchMenuGroups(),
    };

    const handlePrefetch = (route) => {
      if (prefetchMap[route]) {
        prefetchMap[route]();
      }
    };

    const handleMenuClick = () => {
      // Set flag bahwa navigasi berasal dari menu
      isNavigatingFromMenu.value = true;
      // Tutup sidebar ketika menu diklik
      if (layoutStore.isSidebarExpanded) {
        layoutStore.toggleSidebar();
      }
      // Reset flag setelah delay singkat
      setTimeout(() => {
        isNavigatingFromMenu.value = false;
      }, 200);
    };

    const handleMouseEnter = () => {
      layoutStore.setSidebarHovered(true);
    };

    const handleMouseLeave = () => {
      layoutStore.setSidebarHovered(false);
    };

    const toggleGroup = (groupId) => {
      if (openGroupIds.value.has(groupId)) {
        openGroupIds.value.delete(groupId);
      } else {
        openGroupIds.value.clear();
        openGroupIds.value.add(groupId);
      }
    };

    const isGroupActive = (group) => {
      return group.menuDetails?.some(detail => detail.route === route.path);
    };

    const isGroupOpen = (group) => {
      return openGroupIds.value.has(group.id);
    };

    function toggleSidebar() {
      layoutStore.toggleSidebar();
    }

    const setActiveGroup = () => {
      const activeGroup = filteredAndSortedMenuGroups.value.find(isGroupActive);
      if (activeGroup) {
        if (!openGroupIds.value.has(activeGroup.id)) {
          openGroupIds.value.clear();
          openGroupIds.value.add(activeGroup.id);
        }
      }
    };

    onMounted(async () => {
      await userStore.loadUser();
      await menuGroupsStore.fetchAllMenuGroups();
      setActiveGroup();
    });

    // Watch untuk user store agar menu groups di-refresh ketika user berubah
    watch(() => userStore.user, async () => {
      if (userStore.user) {
        await menuGroupsStore.fetchAllMenuGroups();
        setActiveGroup();
      }
    });

    watch(() => route.path, () => {
      setActiveGroup();
      // Tutup sidebar otomatis ketika berpindah halaman (hanya jika bukan dari klik menu)
      if (!isNavigatingFromMenu.value && layoutStore.isSidebarExpanded) {
        layoutStore.toggleSidebar();
      }
    });

    // --- Transition Hooks for smooth animation ---
    const beforeEnter = (el) => {
      el.style.height = '0';
      el.style.overflow = 'hidden';
    };

    const enter = (el, done) => {
      el.style.height = el.scrollHeight + 'px';
      el.addEventListener('transitionend', done, { once: true });
    };

    const afterEnter = (el) => {
      el.style.height = 'auto';
    };

    const beforeLeave = (el) => {
      el.style.height = el.scrollHeight + 'px';
      el.style.overflow = 'hidden';
    };

    const leave = (el, done) => {
      // Force repaint before starting the transition
      getComputedStyle(el).height;
      requestAnimationFrame(() => {
          el.style.height = '0';
      });
      el.addEventListener('transitionend', done, { once: true });
    };
  </script>

  <style>
    .layout-menu {
      transition: width 0.25s ease-in-out;
    }

    html:not(.layout-menu-collapsed) .layout-menu {
        width: 260px;
    }

    html.layout-menu-collapsed .layout-menu {
        width: 82px;
    }

    html.layout-menu-collapsed.layout-menu-hover .layout-menu {
        width: 260px;
    }

    #layout-menu {
      padding-top: 1rem;
    }
    .menu-sub {
      transition: height 0.3s ease-in-out;
      overflow: hidden;
    }
    .menu-inner {
      overflow-y: auto;
    }
  </style>