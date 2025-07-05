import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'
import type { Divisi } from './divisi'

export interface Departemen {
  id: number
  nmDepartemen: string
  divisiId: number
  divisi?: Divisi
}

interface DepartemenState {
  departemens: Departemen[]
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
  form: Partial<Departemen>
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useDepartemenStore = defineStore('departemen', {
    state: (): DepartemenState => ({
        departemens: [],
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
    async fetchDepartemens() {
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
        const response = await fetch(`${$api.departemen()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Gagal mengambil data departemen');
        }

        const result = await response.json();
        this.departemens = result.data || [];
        this.totalRecords = result.meta?.total || 0;

      } catch (e: any) {
        this.error = e.message
        Swal.fire('Error', `Tidak dapat memuat data departemen: ${e.message}`, 'error');
      } finally {
        this.loading = false
      }
    },
    
    async fetchDivisisForSelect() {
        const { $api } = useNuxtApp();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch($api.divisi(), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            if (!response.ok) throw new Error('Gagal mengambil data divisi');
            const result = await response.json();
            this.divisis = result.data || [];
        } catch (error) {
            console.error('Error fetching divisis:', error);
            Swal.fire('Error', 'Gagal mengambil data Divisi untuk pilihan.', 'error');
        }
    },

    async saveDepartemen() {
      this.loading = true;
      this.validationErrors = [];
      const { $api } = useNuxtApp();

      try {
        const token = localStorage.getItem('token');

        let url = $api.departemen();
        let method = 'POST';

        const body = JSON.stringify({
            nm_departemen: this.form.nmDepartemen,
            divisi_id: this.form.divisiId,
        });

        if (this.isEditMode && this.form.id) {
          url = `${$api.departemen()}/${this.form.id}`;
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
            throw new Error(errorData.message || 'Gagal menyimpan data departemen');
        }
        
        this.closeModal();
        await this.fetchDepartemens();
        Swal.fire('Berhasil!', `Departemen berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');

      } catch (error: any) {
        if (error.message !== 'Data validasi tidak valid') {
            Swal.fire('Error', error.message || 'Operasi gagal', 'error');
        }
      } finally {
        this.loading = false;
      }
    },

    async deleteDepartemen(id: number) {
      this.loading = true;
      const { $api } = useNuxtApp();

      const result = await Swal.fire({
          title: 'Apakah Anda yakin?',
          text: "Data departemen yang dihapus tidak dapat dikembalikan!",
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

          const response = await fetch(`${$api.departemen()}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus departemen');
          }

          await this.fetchDepartemens();
          Swal.fire('Berhasil!', 'Departemen berhasil dihapus.', 'success');
      } catch (error: any) {
          console.error('Gagal menghapus departemen:', error);
          Swal.fire('Error', error.message || 'Gagal menghapus departemen', 'error');
      } finally {
          this.loading = false;
      }
    },

    async openModal(departemen: Departemen | null = null) {
        await this.fetchDivisisForSelect();
        
        this.isEditMode = !!departemen;
        this.validationErrors = [];
        if (departemen) {
            this.form = { ...departemen };
        } else {
            this.form = {
                nmDepartemen: '',
                divisiId: undefined,
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
        this.fetchDepartemens();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchDepartemens();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchDepartemens();
    },

    async fetchDepartemensByDivisi(divisiId: number) {
        if (!divisiId) {
            this.departemens = []
            return
        }
        this.loading = true
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token');
        try {
            const response = await fetch($api.departemen() + `?divisi_id=${divisiId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            })
            if (!response.ok) {
                throw new Error('Gagal mengambil data departemen by divisi');
            }
            const result = await response.json()
            this.departemens = result.data || []
        } catch (error) {
            console.error('Gagal mengambil data departemen by divisi:', error)
        } finally {
            this.loading = false
        }
    },
  }
})
