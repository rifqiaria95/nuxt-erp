import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'

export interface Warehouse {
  id: number
  name: string
  address: string
  code: string
  phone: string
  email: string
}

interface Stats {
  total: number | undefined
}

interface WarehouseState {
  warehouses: Warehouse[]
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
  form: Partial<Warehouse>
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useWarehouseStore = defineStore('warehouse', {
    state: (): WarehouseState => ({
        warehouses: [],
        loading: false,
        error: null,
        stats: {
            total: undefined,
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
        async fetchWarehouses() {
          this.loading = true
          const { $api } = useNuxtApp();
          try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page     : ((this.params.first / this.params.rows) + 1).toString(),
                rows     : this.params.rows.toString(),
                sortField: this.params.sortField || '',
                sortOrder: (this.params.sortOrder || 1) > 0 ? 'asc' : 'desc',
                search   : this.params.search || '',
            });
    
            const response = await fetch(`${$api.warehouse()}?${params.toString()}`, {
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              credentials: 'include'
            });
            const result = await response.json()
            this.warehouses = result.data
            this.totalRecords = result.meta.total
          } catch (error) {
            console.error('Failed to fetch warehouse:', error)
            Swal.fire('Error', 'Gagal memuat data gudang', 'error')
          } finally {
            this.loading = false
          }
        },
        async fetchStats() {
            const { $api } = useNuxtApp();
            const defaultStats = {
              total: undefined,
            };
            try {
              const token = localStorage.getItem('token');
              const response = await fetch($api.getTotalWarehouse(), {
                  headers: { 
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json'
                  },
                  credentials: 'include'
              });
          
              if (response.ok) {
                const result = await response.json();
                this.stats = result;
              } else {
                this.stats = defaultStats;
              }
            } catch (error) {
              console.error('Gagal mengambil data statistik (exception):', error);
              this.stats = defaultStats;
            }
        },
        async saveWarehouse() {
            this.loading = true;
            this.validationErrors = [];
            const { $api } = useNuxtApp();
    
            try {
                const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
                const csrfData = await csrfResponse.json();
                const csrfToken = csrfData.token;
                const token = localStorage.getItem('token');
    
                let url = $api.warehouse();
                let method = 'POST';
    
                if (this.isEditMode && this.form.id) {
                    url = `${$api.warehouse()}/${this.form.id}`;
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
                    body: JSON.stringify(this.form),
                    credentials: 'include'
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    if (errorData.errors) {
                       this.validationErrors = Object.values(errorData.errors).flat();
                    }
                   throw new Error(errorData.message || 'Gagal menyimpan data gudang');
               }
    
                this.closeModal();
                await this.fetchWarehouses();
                await this.fetchStats();
                Swal.fire('Berhasil!', `Gudang berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');
    
            } catch (error: any) {
                Swal.fire('Error', error.message || 'Operasi gagal', 'error');
            } finally {
                this.loading = false;
            }
        },
        async deleteWarehouse(id: number) {
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
              const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
              const csrfData = await csrfResponse.json();
              const csrfToken = csrfData.token;
              const token = localStorage.getItem('token');
    
              const response = await fetch(`${$api.warehouse()}/${id}`, {
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
                  throw new Error(errorData.message || 'Gagal menghapus gudang');
              }
    
              await this.fetchWarehouses();
              await this.fetchStats();
              Swal.fire('Berhasil!', 'Gudang berhasil dihapus.', 'success');
          } catch (error: any) {
              Swal.fire('Error', error.message || 'Gagal menghapus gudang', 'error');
          } finally {
              this.loading = false;
          }
        },
        openModal(warehouse: Warehouse | null = null) {
            console.log('openModal', warehouse);
            this.isEditMode = !!warehouse;
            this.validationErrors = [];
            if (warehouse) {
                this.form = { ...warehouse };
            } else {
                this.form = {
                    name: '',
                    address: '',
                    code: '',
                    phone: '',
                    email: '',
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
            this.fetchWarehouses();
        },
        setSort(event: any) {
            this.params.sortField = event.sortField;
            this.params.sortOrder = event.sortOrder;
            this.fetchWarehouses();
        },
        setSearch(value: string) {
            this.params.search = value;
            this.params.first = 0;
            this.fetchWarehouses();
        },
    }
})
