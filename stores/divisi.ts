import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'

export interface Divisi {
  id: number
  nmDivisi: string
}

interface DivisiState {
  divisis: Divisi[]
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
  form: Partial<Divisi>
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useDivisiStore = defineStore('divisi', {
    state: (): DivisiState => ({
        divisis: [],
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
    async fetchDivisis() {
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
        const response = await fetch(`${$api.divisi()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Gagal mengambil data divisi');
        }

        const result = await response.json();
        this.divisis = result.data.map((divisi: any) => ({
            id: divisi.id,
            nmDivisi: divisi.nmDivisi,
        })) || [];
        this.totalRecords = result.meta?.total || 0;

      } catch (e: any) {
        this.error = e.message
        Swal.fire('Error', `Tidak dapat memuat data divisi: ${e.message}`, 'error');
      } finally {
        this.loading = false
      }
    },

    async saveDivisi() {
      this.loading = true;
      this.validationErrors = [];
      const { $api } = useNuxtApp();

      try {
        const token = localStorage.getItem('token');

        let url = $api.divisi();
        let method = 'POST';
        
        const body = JSON.stringify({
            nmDivisi: this.form.nmDivisi,
        });

        if (this.isEditMode && this.form.id) {
          url = `${$api.divisi()}/${this.form.id}`;
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
            throw new Error(errorData.message || 'Gagal menyimpan data divisi');
        }
        
        this.closeModal();
        await this.fetchDivisis();
        Swal.fire('Berhasil!', `Divisi berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');

      } catch (error: any) {
        if (error.message !== 'Data validasi tidak valid') {
            Swal.fire('Error', error.message || 'Operasi gagal', 'error');
        }
      } finally {
        this.loading = false;
      }
    },

    async deleteDivisi(id: number) {
      this.loading = true;
      const { $api } = useNuxtApp();

      const result = await Swal.fire({
          title: 'Apakah Anda yakin?',
          text: "Data divisi yang dihapus tidak dapat dikembalikan!",
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

          const response = await fetch(`${$api.divisi()}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus divisi');
          }

          await this.fetchDivisis();
          Swal.fire('Berhasil!', 'Divisi berhasil dihapus.', 'success');
      } catch (error: any) {
          console.error('Gagal menghapus divisi:', error);
          Swal.fire('Error', error.message || 'Gagal menghapus divisi', 'error');
      } finally {
          this.loading = false;
      }
    },

    openModal(divisi: Divisi | null = null) {
        this.isEditMode = !!divisi;
        this.validationErrors = [];
        if (divisi) {
            this.form = { ...divisi };
        } else {
            this.form = {
                nmDivisi: '',
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
        this.fetchDivisis();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchDivisis();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchDivisis();
    },
  }
})
