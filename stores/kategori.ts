import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'
import { apiFetch } from '~/utils/apiFetch'

export interface Category {
  id: number
  name: string
  description: string
}

interface Stats {
    total     : number | undefined
    sparepart : number | undefined
    oli       : number | undefined
    alat_berat: number | undefined
    tooling   : number | undefined
}

interface KategoriState {
  kategori    : Category[]
  loading     : boolean
  error       : any
  stats       : Stats
  totalRecords: number
  params      : {
    first    : number
    rows     : number
    sortField: string | null
    sortOrder: number | null
    search   : string
  }
  form: Partial<Category>
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useKategoriStore = defineStore('kategori', {
    state: (): KategoriState => ({
    kategori: [],
    loading: false,
    error: null,
    stats: {
        total: undefined,
        sparepart: undefined,
        oli: undefined,
        alat_berat: undefined,
        tooling: undefined
    },
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
    async fetchKategori() {
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
      try {
        const token = localStorage.getItem('token');
        const url = new URL($api.categories())

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        if (!response.ok) throw new Error('Gagal mengambil data kategori')

        const result = await response.json()
        const params = new URLSearchParams({
            page     : ((this.params.first / this.params.rows) + 1).toString(),
            rows     : this.params.rows.toString(),
            sortField: this.params.sortField || '',
            sortOrder: (this.params.sortOrder || 1) > 0 ? 'asc' : 'desc',
            search   : this.params.search || '',
        });
        this.kategori = result.data
        this.totalRecords = result.meta.total
      } catch (e: any) {
        this.error = e.message
        Swal.fire('Error', `Tidak dapat memuat data kategori: ${e.message}`, 'error');
      } finally {
        this.loading = false
      }
    },
    
    async fetchStats() {
        const { $api } = useNuxtApp();
            const defaultStats = {
            total: undefined,
            sparepart: undefined,
            oli: undefined,
            alat_berat: undefined,
            tooling: undefined,
        };
        try {
            const token = localStorage.getItem('token');

            const response = await fetch($api.countProductByCategory(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Gagal mengambil data statistik')

            const result = await response.json()
            this.stats = result
        } catch (error: any) {
            console.error('Gagal mengambil data statistik (exception):', error);
            this.stats = defaultStats;
        }
    },

    async saveKategori() {
        this.loading = true;
        this.validationErrors = [];
        const { $api } = useNuxtApp();

        try {
            const token     = localStorage.getItem('token');

            let url = $api.categories();
            let method = 'POST';

            // Jika edit mode, gunakan endpoint /api/categories/:id dan method PUT
            if (this.isEditMode && this.form.id) {
                url = `${$api.categories()}/${this.form.id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.form),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Endpoint tidak ditemukan. Pastikan endpoint dan method sudah benar.');
                }
                throw new Error('Gagal menyimpan data kategori');
            }

            const result = await response.json();
            
            this.closeModal();
            await this.fetchKategori();
            await this.fetchStats();
            Swal.fire('Berhasil!', `Kategori berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');

        } catch (error: any) {
            Swal.fire('Error', error.message || 'Operasi gagal', 'error');
        } finally {
            this.loading = false;
        }
    },

    async deleteKategori(id: number) {
      this.loading = true;
      const { $api } = useNuxtApp();

      const result = await Swal.fire({
          title: 'Apakah Anda yakin?',
          text: "Data kategori yang dihapus tidak dapat dikembalikan!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal'
      });

      if (!result.isConfirmed) {
          return;
      }

      try {
          const token = localStorage.getItem('token');

          const response = await fetch($api.categories() + `/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus kategori');
          }

          await this.fetchKategori();
          Swal.fire('Berhasil!', 'Kategori berhasil dihapus.', 'success');
      } catch (error: any) {
          console.error('Gagal menghapus kategori:', error);
          Swal.fire('Error', error.message || 'Gagal menghapus kategori', 'error');
      } finally {
          this.loading = false;
      }
    },

    openModal(kategori: Category | null = null) {
        this.isEditMode = !!kategori;
        this.validationErrors = [];
        if (kategori) {
            this.form = { ...kategori };
        } else {
            this.form = {
                name: '', description: ''
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
        this.fetchKategori();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchKategori();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchKategori();
    },
  }
})
