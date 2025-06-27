import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'

export interface Unit {
  id: number
  name: string
  symbol: string
}

interface UnitState {
  units: Unit[]
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
  form: Partial<Unit>
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useUnitStore = defineStore('unit', {
    state: (): UnitState => ({
    units: [],
    loading: false,
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
    async fetchUnit() {
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
        const response = await fetch(`${$api.unit()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Gagal mengambil data unit');
        }

        const result = await response.json();
        this.units = result.data || [];
        this.totalRecords = result.meta?.total || 0;

      } catch (e: any) {
        this.error = e.message
        Swal.fire('Error', `Tidak dapat memuat data unit: ${e.message}`, 'error');
      } finally {
        this.loading = false
      }
    },

    async saveUnit() {
      this.loading = true;
      this.validationErrors = [];
      const { $api } = useNuxtApp();

      try {
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;
        const token = localStorage.getItem('token');

        if (!csrfToken) {
          throw new Error('CSRF token tidak ditemukan. Tidak dapat melanjutkan request.');
        }

        let url = $api.unit();
        let method = 'POST';

        const body = JSON.stringify(this.form);

        if (this.isEditMode && this.form.id) {
          url = `${$api.unit()}/${this.form.id}`;
          method = 'PUT';
        }

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrfToken,
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
            throw new Error(errorData.message || 'Gagal menyimpan data unit');
        }
        
        this.closeModal();
        await this.fetchUnit();
        Swal.fire('Berhasil!', `Unit berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');

      } catch (error: any) {
        if (error.message !== 'Data validasi tidak valid') {
            Swal.fire('Error', error.message || 'Operasi gagal', 'error');
        }
      } finally {
        this.loading = false;
      }
    },

    async deleteUnit(id: number) {
      this.loading = true;
      const { $api } = useNuxtApp();

      const result = await Swal.fire({
          title: 'Apakah Anda yakin?',
          text: "Data unit yang dihapus tidak dapat dikembalikan!",
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
          const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
          const csrfData = await csrfResponse.json();
          const csrfToken = csrfData.token;
          const token = localStorage.getItem('token');

          if (!csrfToken) {
            throw new Error('CSRF token tidak ditemukan. Tidak dapat melanjutkan request.');
          }

          const response = await fetch(`${$api.unit()}/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus unit');
          }

          await this.fetchUnit();
          Swal.fire('Berhasil!', 'Unit berhasil dihapus.', 'success');
      } catch (error: any) {
          console.error('Gagal menghapus unit:', error);
          Swal.fire('Error', error.message || 'Gagal menghapus unit', 'error');
      } finally {
          this.loading = false;
      }
    },

    openModal(unit: Unit | null = null) {
        this.isEditMode = !!unit;
        this.validationErrors = [];
        if (unit) {
            this.form = { ...unit };
        } else {
            this.form = {
                name: '',
                symbol: ''
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
        this.fetchUnit();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchUnit();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchUnit();
    },
  }
})
