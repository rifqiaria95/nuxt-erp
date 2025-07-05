<template>
    <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
      <div class="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
        <a class="nav-item nav-link px-0 me-xl-6" href="javascript:void(0)" @click="toggleSidebar">
          <i class="ri-menu-fill ri-22px"></i>
        </a>
      </div>
  
      <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
        <!-- Conditional rendering for Search Bar -->
        <template v-if="!isSearchVisible">
            <div class="navbar-nav align-items-center">
                <div class="nav-item navbar-search-wrapper mb-0">
                    <a class="nav-item nav-link search-toggler fw-normal px-0" href="javascript:void(0);" @click="toggleSearch">
                    <i class="ri-search-line ri-22px scaleX-n1-rtl me-3"></i>
                    <span class="d-none d-md-inline-block text-muted">Search (Ctrl+/)</span>
                    </a>
                </div>
            </div>
    
            <ul class="navbar-nav flex-row align-items-center ms-auto">
              <!-- Language -->
                <li class="nav-item dropdown-language dropdown">
                    <a
                    class="nav-link btn btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow"
                    href="javascript:void(0);"
                    data-bs-toggle="dropdown">
                    <i class="ri-translate-2 ri-22px"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                        <a class="dropdown-item" href="javascript:void(0);" data-language="en" data-text-direction="ltr">
                        <span class="align-middle">English</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="javascript:void(0);" data-language="fr" data-text-direction="ltr">
                        <span class="align-middle">French</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="javascript:void(0);" data-language="ar" data-text-direction="rtl">
                        <span class="align-middle">Arabic</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="javascript:void(0);" data-language="de" data-text-direction="ltr">
                        <span class="align-middle">German</span>
                        </a>
                    </li>
                    </ul>
                </li>
                <!--/ Language -->

                <!-- Quick links: This dropdown will also need a Vue-native implementation if used. -->
                <li class="nav-item dropdown-shortcuts navbar-dropdown dropdown me-1 me-xl-0">
                    <a
                    class="nav-link btn btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow"
                    href="javascript:void(0);"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false">
                    <i class="ri-star-smile-line ri-22px"></i>
                    </a>
                    <!-- Dropdown content here -->
                </li>
                <!-- Quick links -->

                <!-- Notification: This dropdown will also need a Vue-native implementation if used. -->
                <li class="nav-item dropdown-notifications navbar-dropdown dropdown me-4 me-xl-1">
                    <a
                    class="nav-link btn btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow"
                    href="javascript:void(0);"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false">
                    <i class="ri-notification-2-line ri-22px"></i>
                    <span
                        class="position-absolute top-0 start-50 translate-middle-y badge badge-dot bg-danger mt-2 border"></span>
                    </a>
                    <!-- Dropdown content here -->
                </li>
                <!--/ Notification -->

                <!-- User -->
                <li class="nav-item navbar-dropdown dropdown-user dropdown" ref="avatarDropdownRef">
                    <a class="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" @click.prevent="isAvatarDropdownOpen = !isAvatarDropdownOpen">
                        <div class="avatar avatar-online">
                            <img src="/img/avatars/1.png" alt class="rounded-circle" />
                        </div>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" :class="{show: isAvatarDropdownOpen}">
                    <li>
                        <a class="dropdown-item" href="#">
                        <div class="d-flex">
                            <div class="flex-shrink-0 me-2">
                            <div class="avatar avatar-online">
                                <img src="/img/avatars/1.png" alt class="rounded-circle" />
                            </div>
                            </div>
                            <div class="flex-grow-1">
                            <span class="fw-medium d-block small">{{ userStore.user?.fullName || 'Guest' }}</span>
                            <small class="text-muted">{{ userStore.user?.roles?.[0]?.name || 'Guest' }}</small>
                            </div>
                        </div>
                        </a>
                    </li>
                    <li>
                        <div class="dropdown-divider"></div>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#">
                        <i class="ri-user-3-line ri-22px me-3"></i><span class="align-middle">My Profile</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#">
                        <i class="ri-settings-4-line ri-22px me-3"></i><span class="align-middle">Settings</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#">
                        <span class="d-flex align-items-center align-middle">
                            <i class="flex-shrink-0 ri-file-text-line ri-22px me-3"></i>
                            <span class="flex-grow-1 align-middle">Billing</span>
                            <span class="flex-shrink-0 badge badge-center rounded-pill bg-danger">4</span>
                        </span>
                        </a>
                    </li>
                    <li>
                        <div class="dropdown-divider"></div>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#">
                        <i class="ri-money-dollar-circle-line ri-22px me-3"></i
                        ><span class="align-middle">Pricing</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#">
                        <i class="ri-question-line ri-22px me-3"></i><span class="align-middle">FAQ</span>
                        </a>
                    </li>
                    <li>
                        <div class="d-grid px-4 pt-2 pb-1">
                        <a class="btn btn-sm btn-danger d-flex" href="javascript:void(0);" @click="handleLogout">
                            <small class="align-middle">Logout</small>
                            <i class="ri-logout-box-r-line ms-2 ri-16px"></i>
                        </a>
                        </div>
                    </li>
                    </ul>
                </li>
                <!--/ User -->
            </ul>
        </template>
        <!-- The search input that appears when toggled -->
        <template v-else>
            <div class="navbar-search-wrapper search-input-wrapper w-100">
                <input
                ref="searchInput"
                type="text"
                class="form-control search-input container-xxl border-0"
                placeholder="Search..."
                aria-label="Search..." />
                <i class="ri-close-fill search-toggler cursor-pointer" @click="toggleSearch"></i>
            </div>
        </template>
      </div>
    </nav>
  </template>
  
  <script setup>
    import { useUserStore } from '~/stores/user'
    import { ref, onMounted, onUnmounted, nextTick } from 'vue'
    import { useRouter } from 'vue-router'
    import { useLayoutStore } from '~/stores/layout';

    const { $api }    = useNuxtApp()
    const userStore   = useUserStore()
    const router      = useRouter()
    const layoutStore = useLayoutStore();

    // --- Search bar logic ---
    const isSearchVisible = ref(false);
    const searchInput = ref(null);

    const toggleSearch = async () => {
        isSearchVisible.value = !isSearchVisible.value;
        if (isSearchVisible.value) {
            await nextTick();
            searchInput.value?.focus();
        }
    };

    const handleKeydown = (event) => {
        if (event.ctrlKey && event.key === '/') {
            event.preventDefault();
            toggleSearch();
        }
    };
    // --- End search bar logic ---

    // --- Avatar Dropdown Logic ---
    const isAvatarDropdownOpen = ref(false);
    const avatarDropdownRef = ref(null);

    const handleClickOutside = (event) => {
        if (avatarDropdownRef.value && !avatarDropdownRef.value.contains(event.target)) {
            isAvatarDropdownOpen.value = false;
        }
    };
    // --- End Avatar Dropdown Logic ---

    onMounted(() => {
        userStore.loadUser()
        window.addEventListener('keydown', handleKeydown);
        document.addEventListener('click', handleClickOutside);
    })

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('click', handleClickOutside);
    });

    const toggleSidebar = () => {
        layoutStore.toggleSidebar();
    }

    const handleLogout = async () => {
        userStore.clearUser()
        document.documentElement.className = ''
        localStorage.removeItem('token')
        const response = await fetch($api.logout(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      // Cek status response sebelum parsing data
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
        }
        toast.error({
          title: 'Logout Gagal!',
          icon: 'ri-close-line',
          message: `Gagal logout: ${errorData?.message || `Terjadi kesalahan (${response.status})`}`,
          timeout: 3000,
          position: 'topRight',
          layout: 2,
        });
        return;
      }
      router.push('/auth/login')
    }
  </script>

<style>
/* Replicate Popper.js positioning for the user dropdown */
.navbar-nav .dropdown .dropdown-menu {
  position: absolute;
  top: 100%;
  left: auto;
  right: 0;
  margin-top: 0.125rem;
}
</style>