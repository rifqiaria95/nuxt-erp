import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'
import { useUserStore } from './user'
import type { MenuDetail } from './menu-detail'

export interface MenuGroup {
  id: number
  name: string
  icon: string
  order: number
  jenisMenu: number
  menuDetails?: MenuDetail[]
}

interface MenuGroupState {
  menuGroups: MenuGroup[]
  sidebarMenuGroups: MenuGroup[]
  loading: boolean
  error: any
  totalRecords: number
  params: {
    first: number
    rows: number
    sortField: string | null
    sortOrder: number | null
    search: string
  }
  form: Partial<MenuGroup>
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useMenuGroupStore = defineStore('menu-group', {
    state: (): MenuGroupState => ({
        menuGroups: [],
        sidebarMenuGroups: [],
        loading: true,
        error: null,
        totalRecords: 0,
        params: {
            first: 0,
            rows: 10,
            sortField: 'id',
            sortOrder: 1,
            search: '',
        },
        form: {},
        isEditMode: false,
        showModal: false,
        validationErrors: [],
    }),
  getters: {
    // Memfilter menu group berdasarkan permission user
    filteredMenuGroups: (state) => {
      // Gunakan import untuk mengakses user store
      const userStore = useUserStore()
      
      // Pastikan user store sudah siap
      if (!userStore.user || !state.sidebarMenuGroups) return []
      
      // Cek apakah user adalah superadmin
      const isSuperAdmin = userStore.user.roles.some(role => role.name === 'superadmin')
      
      return state.sidebarMenuGroups.filter(group => {
        // Jika menu group adalah Admin, hanya tampilkan untuk superadmin
        if (group.name === 'Admin' || group.jenisMenu === 7) {
          return isSuperAdmin
        }
        
        // Jika user adalah superadmin, tampilkan semua menu group (kecuali Admin yang sudah dihandle di atas)
        if (isSuperAdmin) {
          return true
        }
        
        // Filter berdasarkan permission menu group untuk user non-superadmin
        const groupPermissionName = `view_${group.name.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`
        
        // Cek apakah user memiliki permission untuk menu group ini
        const hasGroupPermission = userStore.hasPermission(groupPermissionName)
        
        // Cek apakah user memiliki permission untuk salah satu menu detail di dalam group ini
        let hasDetailPermission = false
        if (group.menuDetails && group.menuDetails.length > 0) {
          hasDetailPermission = group.menuDetails.some(detail => {
            const detailPermissionName = `view_${detail.name.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`
            return userStore.hasPermission(detailPermissionName)
          })
        }
        
        // Tampilkan group jika user memiliki permission untuk group ATAU salah satu detail di dalamnya
        return hasGroupPermission || hasDetailPermission
      }).map(group => {
        // Buat copy dari group untuk menghindari mutasi state
        const groupCopy = { ...group }
        
        // Filter menu details untuk group ini
        if (groupCopy.menuDetails && groupCopy.menuDetails.length > 0) {
          // Jika superadmin, tampilkan semua menu details
          if (isSuperAdmin) {
            return groupCopy
          }
          
          // Untuk user non-superadmin, filter berdasarkan permission
          groupCopy.menuDetails = groupCopy.menuDetails.filter(detail => {
            const detailPermissionName = `view_${detail.name.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`
            return userStore.hasPermission(detailPermissionName)
          })
        }
        
        return groupCopy
      })
    }
  },
  actions: {
    async fetchMenuGroups() {
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
      try {
        const params = new URLSearchParams({
            page     : ((this.params.first / this.params.rows) + 1).toString(),
            rows     : this.params.rows.toString(),
            sortField: this.params.sortField || 'id',
            sortOrder: (this.params.sortOrder || 1) > 0 ? 'asc' : 'desc',
            search   : this.params.search || '',
            all      : 'true',
        });

        const token = localStorage.getItem('token');
        const response = await fetch(`${$api.menuGroups()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Gagal mengambil data menu group');
        }

        const result = await response.json();
        this.menuGroups = result.data || [];
        this.totalRecords = result.meta?.total || 0;

      } catch (e: any) {
        this.error = e.message
        Swal.fire('Error', `Tidak dapat memuat data menu group: ${e.message}`, 'error');
      } finally {
        this.loading = false
      }
    },

    async prefetchMenuGroups() {
        if (this.menuGroups.length > 0 && this.params.rows === 999) { // Already fetched all
            return;
        }
        if(this.loading) return;
        
        // This store has two fetch actions, we should prefetch the one for the main page, not fetchAll
        await this.fetchMenuGroups();
    },

    async fetchAllMenuGroups() {
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
      try {
        const params = new URLSearchParams({
            page     : '1',
            rows     : '999', // Ambil semua data
        });

        const token = localStorage.getItem('token');
        const response = await fetch(`${$api.menuGroupsAll()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Gagal mengambil semua data menu group');
        }

        const result = await response.json();
        this.sidebarMenuGroups = result.data || [];
      } catch (e: any) {
        this.error = e.message
        // Fail silently for sidebar
        console.error(`Tidak dapat memuat data menu group untuk sidebar: ${e.message}`);
      } finally {
        this.loading = false
      }
    },

    async saveMenuGroup() {
      this.loading = true;
      this.validationErrors = [];
      const { $api } = useNuxtApp();

      try {
        const token = localStorage.getItem('token');

        let url = $api.menuGroups();
        let method = 'POST';

        const body = JSON.stringify(this.form);

        if (this.isEditMode && this.form.id) {
          url = `${$api.menuGroups()}/${this.form.id}`;
          method = 'PUT';
        }

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: body,
          credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 422) {
                this.validationErrors = Object.values(errorData.errors).flat();
                throw new Error('Data validasi tidak valid');
            }
            throw new Error(errorData.message || 'Gagal menyimpan data menu group');
        }
        
        this.closeModal();
        await this.fetchMenuGroups();
        Swal.fire('Berhasil!', `Menu group berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');

      } catch (error: any) {
        if (error.message !== 'Data validasi tidak valid') {
            Swal.fire('Error', error.message || 'Operasi gagal', 'error');
        }
      } finally {
        this.loading = false;
      }
    },

    async deleteMenuGroup(id: number) {
      this.loading = true;
      const { $api } = useNuxtApp();

      const result = await Swal.fire({
          title: 'Apakah Anda yakin?',
          text: "Data menu group yang dihapus tidak dapat dikembalikan!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal'
      });

      if (!result.isConfirmed) {
          this.loading = false;
          return;
      }

      try {
          const token = localStorage.getItem('token');

          const response = await fetch(`${$api.menuGroups()}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus menu group');
          }

          await this.fetchMenuGroups();
          Swal.fire('Berhasil!', 'Menu group berhasil dihapus.', 'success');
      } catch (error: any) {
          console.error('Gagal menghapus menu group:', error);
          Swal.fire('Error', error.message || 'Gagal menghapus menu group', 'error');
      } finally {
          this.loading = false;
      }
    },

    openModal(menuGroup: MenuGroup | null = null) {
        this.isEditMode = !!menuGroup;
        this.validationErrors = [];
        if (menuGroup) {
            this.form = { ...menuGroup };
        } else {
            this.form = {
                name: '',
                icon: '',
                order: undefined,
                jenisMenu: undefined,
            };
        }
        this.showModal = true;
    },

    closeModal() {
        this.showModal = false;
        this.isEditMode = false;
        this.form = {};
        this.validationErrors = [];
    },

    setPagination(event: any) {
        this.params.first = event.first;
        this.params.rows = event.rows;
        this.fetchMenuGroups();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchMenuGroups();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchMenuGroups();
    },
  }
})