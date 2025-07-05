import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'

export interface Jabatan {
  id: number
  nmJabatan: string
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number | undefined
  direktur_utama: number | undefined
  direktur_keuangan: number | undefined
  direktur_operasional: number | undefined
  general_manager: number | undefined
}

interface JabatanState {
  jabatans: Jabatan[]
  loading: boolean
  error: any
  stats: Stats
  totalRecords: number
  params: {
    first: number
    rows: number
    sortField: string | null
    sortOrder: number | null
    search: string
  }
  form: Partial<Jabatan> & { nmJabatan?: string }
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useJabatanStore = defineStore('jabatan', {
  state: (): JabatanState => ({
    jabatans: [],
    loading: false,
    error: null,
    stats: {
        total: undefined,
        direktur_utama: undefined,
        direktur_keuangan: undefined,
        direktur_operasional: undefined,
        general_manager: undefined
    },
    totalRecords: 0,
    params: {
        first: 0,
        rows: 10,
        sortField: 'id',
        sortOrder: 1,
        search: '',
    },
    form: {
        nmJabatan: ''
    },
    isEditMode: false,
    showModal: false,
    validationErrors: [],
  }),
  actions: {
    async fetchJabatans() {
      this.loading = true
      const { $api } = useNuxtApp()
      
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
            page     : ((this.params.first / this.params.rows) + 1).toString(),
            rows     : this.params.rows.toString(),
            sortField: this.params.sortField || '',
            sortOrder: (this.params.sortOrder || 1) > 0 ? 'asc' : 'desc',
            search   : this.params.search || '',
        });

        const response = await fetch(`${$api.jabatan()}?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include'
        })
        const result = await response.json()
        this.jabatans = (result.data || []).map((item: any) => ({
          id       : item.idJabatan,
          nmJabatan: item.nmJabatan,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }))
        this.totalRecords = result.meta.total
      } catch (error) {
        console.error('Gagal mengambil data jabatan:', error)
        Swal.fire('Error', 'Gagal mengambil data jabatan', 'error')
      } finally {
        this.loading = false
      }
    },
    async fetchStats() {
        const { $api } = useNuxtApp();
        const defaultStats = {
            total: undefined,
            direktur_utama: undefined,
            direktur_keuangan: undefined,
            direktur_operasional: undefined,
            general_manager: undefined,
        };
        try {
            const token = localStorage.getItem('token');
            const response = await fetch($api.countPegawaiByJabatan(), {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                this.stats = result
            } else {
                this.stats = defaultStats;
            }
        } catch (error) {
            console.error('Gagal mengambil data statistik (exception):', error);
            this.stats = defaultStats;
        }
    },
    async saveJabatan() {
        this.loading = true;
        this.validationErrors = [];
        const { $api } = useNuxtApp();

        try {
            const token = localStorage.getItem('token');

            let url = $api.jabatan();
            let method = 'POST';

            if (this.isEditMode && this.form.id) {
                url = `${$api.jabatan()}/${this.form.id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nm_jabatan: this.form.nmJabatan }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.errors) {
                   this.validationErrors = Object.values(errorData.errors).flat();
                }
               throw new Error(errorData.message || 'Gagal menyimpan data jabatan');
           }

            this.closeModal();
            await this.fetchJabatans();
            await this.fetchStats();
            Swal.fire('Berhasil!', `Jabatan berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');

        } catch (error: any) {
            Swal.fire('Error', error.message || 'Operasi gagal', 'error');
        } finally {
            this.loading = false;
        }
    },
    async deleteJabatan(id: number) {
      this.loading = true;
      const { $api } = useNuxtApp();

      const result = await Swal.fire({
          title: 'Apakah Anda yakin?',
          text: "Data yang dihapus tidak dapat dikembalikan!",
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

          const response = await fetch(`${$api.jabatan()}/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus jabatan');
          }

          await this.fetchJabatans();
          await this.fetchStats();
          Swal.fire('Berhasil!', 'Jabatan berhasil dihapus.', 'success');
      } catch (error: any) {
          Swal.fire('Error', error.message || 'Gagal menghapus jabatan', 'error');
      } finally {
          this.loading = false;
      }
    },
    openModal(jabatan: Jabatan | null = null) {
        this.isEditMode = !!jabatan;
        this.validationErrors = [];
        if (jabatan) {
            this.form = { id: jabatan.id, nmJabatan: jabatan.nmJabatan };
        } else {
            this.form = {
                nmJabatan: ''
            };
        }
        this.showModal = true;
    },
    closeModal() {
        this.showModal = false;
        this.isEditMode = false;
        this.form = { nmJabatan: '' };
        this.validationErrors = [];
    },
    setPagination(event: any) {
        this.params.first = event.first;
        this.params.rows = event.rows;
        this.fetchJabatans();
    },
    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchJabatans();
    },
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchJabatans();
    },
  }
})
