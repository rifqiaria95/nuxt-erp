  <template>
    <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
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
          <a href="/dashboard" class="menu-link">
            <i class="menu-icon tf-icons ri-home-smile-line"></i>
            <div data-i18n="Dashboards">Dashboards</div>
          </a>
        </li>

        <!-- Apps & Pages -->
        <li class="menu-header mt-5">
          <span class="menu-header-text" data-i18n="Apps & Pages">Apps &amp; Pages</span>
        </li>
        <template v-if="menuGroupsStore.menuGroups && menuGroupsStore.menuGroups.length">
          <li
            class="menu-item"
            v-for="group in [...menuGroupsStore.menuGroups].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))"
            :key="group.id"
            :class="{
              open: group.menuDetails && group.menuDetails.some(detail => detail.route === $route.path),
              active: group.menuDetails && group.menuDetails.some(detail => detail.route === $route.path)
            }"
          >
            <a href="javascript:void(0);" class="menu-link menu-toggle">
              <i :class="['menu-icon', 'tf-icons', group.icon]"></i>
              <div>{{ group.name }}</div>
            </a>
            <ul class="menu-sub" v-if="group.menuDetails && group.menuDetails.length">
              <li
                class="menu-item"
                v-for="detail in [...group.menuDetails].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))"
                :key="detail.id"
                :class="{ active: detail.route === $route.path }"
              >
                <a :href="detail.route" class="menu-link">
                  <div>{{ detail.name }}</div>
                </a>
              </li>
            </ul>
          </li>
        </template>
      </ul>
    </aside>
  </template>

  <script setup>
    import {
      useMenuGroupsStore
    } from '~/stores/menu-group';
    import {
      useMenuDetailsStore
    } from '~/stores/menu-detail';
    import {
      onMounted
    } from 'vue';

    const menuGroupsStore = useMenuGroupsStore();
    const menuDetailsStore = useMenuDetailsStore();

    function toggleSidebar() {
      document.body.classList.toggle('layout-menu-expanded');
    }

    onMounted(() => {
      menuGroupsStore.fetchMenuGroups();
      menuDetailsStore.fetchMenuDetails();
    });
  </script>

  <style>
    #layout-menu {
      padding-top: 1rem;
    }
  </style>