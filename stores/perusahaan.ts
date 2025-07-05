import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'

export interface Perusahaan {
  id: number
  kodePerusahaan: string
  nmPerusahaan: string
  npwpPerusahaan: string
  alamatPerusahaan: string
  tlpPerusahaan: string
  emailPerusahaan: string
  logoPerusahaan: string
  createdAt: string
  updatedAt: string
}

interface PerusahaanState {
  perusahaans: Perusahaan[]
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
  form: any
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
  selectedPerusahaan: Perusahaan | null
}

export const usePerusahaanStore = defineStore('perusahaan', {
  state: (): PerusahaanState => ({
    perusahaans: [],
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
    selectedPerusahaan: null,
  }),
  actions: {
    async fetchPerusahaans() {
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

        const response = await fetch(`${$api.perusahaan()}?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include'
        })
        const result = await response.json()
        this.perusahaans = result.data
        this.totalRecords = result.meta.total
      } catch (error) {
        console.error('Gagal mengambil data perusahaan:', error)
        Swal.fire('Error', 'Gagal memuat data perusahaan', 'error')
      } finally {
        this.loading = false
      }
    },
    async savePerusahaan() {
        this.loading = true;
        this.validationErrors = [];
        const { $api } = useNuxtApp();

        try {
            const token = localStorage.getItem('token');

            const formData = new FormData();
            Object.keys(this.form).forEach(key => {
                if (key === 'logoPerusahaan' && this.form[key] instanceof File) {
                    formData.append(key, this.form[key]);
                } else if (this.form[key] !== null && this.form[key] !== undefined) {
                    formData.append(key, this.form[key]);
                }
            });

            let url = $api.perusahaan();
            let method = 'POST';

            if (this.isEditMode && this.form.id) {
                url = `${$api.perusahaan()}/${this.form.id}`;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.errors) {
                   this.validationErrors = Object.values(errorData.errors).flat();
                }
               throw new Error(errorData.message || 'Gagal menyimpan data perusahaan');
           }

            this.closeModal();
            await this.fetchPerusahaans();
            Swal.fire('Berhasil!', `Perusahaan berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');

        } catch (error: any) {
            Swal.fire('Error', error.message || 'Operasi gagal', 'error');
        } finally {
            this.loading = false;
        }
    },
    async deletePerusahaan(id: number) {
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

          const response = await fetch(`${$api.perusahaan()}/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus perusahaan');
          }

          await this.fetchPerusahaans();
          Swal.fire('Berhasil!', 'Perusahaan berhasil dihapus.', 'success');
      } catch (error: any) {
          Swal.fire('Error', error.message || 'Gagal menghapus perusahaan', 'error');
      } finally {
          this.loading = false;
      }
    },
    openModal(perusahaan: Perusahaan | null = null) {
        this.isEditMode = !!perusahaan;
        this.validationErrors = [];
        if (perusahaan) {
            this.form = { ...perusahaan };
        } else {
            this.form = {
                kodePerusahaan: '',
                nmPerusahaan: '',
                npwpPerusahaan: '',
                alamatPerusahaan: '',
                tlpPerusahaan: '',
                emailPerusahaan: '',
                logoPerusahaan: null,
            };
        }
        this.showModal = true;
    },
    closeModal() {
        this.showModal = false;
        this.isEditMode = false;
        this.form = {};
        this.validationErrors = [];
        this.selectedPerusahaan = null;
    },
    setPagination(event: any) {
        this.params.first = event.first;
        this.params.rows = event.rows;
        this.fetchPerusahaans();
    },
    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchPerusahaans();
    },
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchPerusahaans();
    },
    setLogo(file: File) {
        this.form.logoPerusahaan = file;
    }
  },
})
