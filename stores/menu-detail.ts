import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'
import type { MenuGroup } from './menu-group'
import { useMenuGroupStore } from './menu-group'

export interface MenuDetail {
  id: number
  name: string
  route: string
  status: number
  order: number
  menuGroupId: number
  menu_group?: MenuGroup
}

interface MenuDetailState {
  menuDetails: MenuDetail[]
  menuGroups: MenuGroup[]
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
  form: Partial<MenuDetail>
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useMenuDetailStore = defineStore('menu-detail', {
    state: (): MenuDetailState => ({
        menuDetails: [],
        menuGroups: [],
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
  actions: {
    async fetchMenuDetails() {
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
        });

        const token = localStorage.getItem('token');
        const response = await fetch(`${$api.menuDetails()}?${params.toString()}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Gagal mengambil data menu detail');
        }

        const result = await response.json();
        this.menuDetails = result.data || [];
        this.totalRecords = result.meta?.total || 0;

      } catch (e: any) {
        this.error = e.message
        Swal.fire('Error', `Tidak dapat memuat data menu detail: ${e.message}`, 'error');
      } finally {
        this.loading = false
      }
    },
    
    async fetchMenuGroupsForSelect() {
        const { $api } = useNuxtApp();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch($api.menuGroups(), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            if (!response.ok) throw new Error('Gagal mengambil data menu groups');
            const result = await response.json();
            this.menuGroups = result.data || [];
        } catch (error) {
            console.error('Error fetching menu groups:', error);
            Swal.fire('Error', 'Gagal mengambil data Menu Group untuk pilihan.', 'error');
        }
    },

    async saveMenuDetail() {
      this.loading = true;
      this.validationErrors = [];
      const { $api } = useNuxtApp();

      try {
        const token = localStorage.getItem('token');

        let url = $api.menuDetails();
        let method = 'POST';

        const body = JSON.stringify(this.form);

        if (this.isEditMode && this.form.id) {
          url = `${$api.menuDetails()}/${this.form.id}`;
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
            throw new Error(errorData.message || 'Gagal menyimpan data menu detail');
        }
        
        this.closeModal();
        await this.fetchMenuDetails();

        const menuGroupStore = useMenuGroupStore();
        await menuGroupStore.fetchAllMenuGroups();
        
        Swal.fire('Berhasil!', `Menu detail berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');

      } catch (error: any) {
        if (error.message !== 'Data validasi tidak valid') {
            Swal.fire('Error', error.message || 'Operasi gagal', 'error');
        }
      } finally {
        this.loading = false;
      }
    },

    async deleteMenuDetail(id: number) {
      this.loading = true;
      const { $api } = useNuxtApp();

      const result = await Swal.fire({
          title: 'Apakah Anda yakin?',
          text: "Data menu detail yang dihapus tidak dapat dikembalikan!",
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

          const response = await fetch(`${$api.menuDetails()}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus menu detail');
          }

          await this.fetchMenuDetails();
          const menuGroupStore = useMenuGroupStore();
          await menuGroupStore.fetchAllMenuGroups();

          Swal.fire('Berhasil!', 'Menu detail berhasil dihapus.', 'success');
      } catch (error: any) {
          console.error('Gagal menghapus menu detail:', error);
          Swal.fire('Error', error.message || 'Gagal menghapus menu detail', 'error');
      } finally {
          this.loading = false;
      }
    },

    async openModal(menuDetail: MenuDetail | null = null) {
      
      this.isEditMode = !!menuDetail;
      this.validationErrors = [];
      if (menuDetail) {
        this.form = { ...menuDetail };
      } else {
        this.form = {
          name: '',
          route: '',
          order: undefined,
          status: 1,
          menuGroupId: undefined,
        };
      }
      this.showModal = true;
      
      await this.fetchMenuGroupsForSelect();
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
        this.fetchMenuDetails();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchMenuDetails();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchMenuDetails();
    },
  }
})
