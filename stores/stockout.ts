import { defineStore } from 'pinia'
import type { StockOut, StockOutDetail } from './stocks'
import type { User } from './userManagement'

interface Stats {
  total : number | undefined
  draft : number | undefined
  posted: number | undefined
}

interface StockState {
  stockOuts      : StockOut[]
  selectedStockOut: StockOut | null
  totalRecords   : number
  stockOutDetails: StockOutDetail[]
  stats          : Stats
  loading        : boolean
  error          : any
  params: {
    first: number
    rows: number
    sortField: string | null
    sortOrder: number | null
    draw: number
    search: string
  }
  form: any
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useStockOutStore = defineStore('stockOut', {
  state: (): StockState => ({
    stockOuts: [],
    stockOutDetails: [],
    selectedStockOut: null,
    totalRecords: 0,
    stats: {
      total: undefined,
      draft: undefined,
      posted: undefined
    },
    loading       : false,
    error         : null,
    params: {
        first: 0,
        rows: 10,
        sortField: null,
        sortOrder: null,
        draw: 1,
        search: '',
    },
    form: {},
    isEditMode: false,
    showModal: false,
    validationErrors: [],
  }),
  actions: {
    async fetchStockOutsPaginated() {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
            page     : ((this.params.first / this.params.rows) + 1).toString(),
            rows     : this.params.rows.toString(),
            sortField: this.params.sortField || '',
            sortOrder: this.params.sortOrder ? this.params.sortOrder.toString() : '',
            draw     : (this.params.draw || 1).toString(),
            search   : this.params.search || '',
        });

        const response = await fetch(`${$api.stockOut()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data stock out dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data stock out');
        }

        const result = await response.json();
        this.stockOuts = result.data || []; 
        this.totalRecords = parseInt(result.meta.total) || 0;
        
        return result;
      } catch (error) {
          this.stockOuts = [];
          this.totalRecords = 0;
          throw error;
      } finally {
          this.loading = false;
      }
    },

    async saveStockOut() {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' })
        const csrfData = await csrfResponse.json()
        const csrfToken = csrfData.token || (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content
        const token = localStorage.getItem('token')
        let response
        let url
  
        const payload: any = {
          noSo: this.form.noSo,
          date: this.form.date,
          warehouseId: this.form.warehouseId,
          status: this.form.status,
        }
  
        if (this.isEditMode) {
          if (!this.form.id) {
            throw new Error('ID Stock Out tidak ditemukan untuk update.')
          }
          url = `${$api.stockOut()}/${this.form.id}`
          response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-CSRF-TOKEN': csrfToken || '',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          })
        }
        else {
          payload.status = 'draft'
          url = $api.stockOut()
          response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-CSRF-TOKEN': csrfToken || '',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          })
        }
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `Gagal ${this.isEditMode ? 'memperbarui' : 'membuat'} stock out` }))
          throw errorData
        }
  
        return await response.json()
      }
      catch (error) {
        throw error
      }
      finally {
        this.loading = false
      }
    },
    // Fungsi untuk mengambil data stock in
    async fetchStockOuts() {
      try {
        this.loading = true;
        const { $api }     = useNuxtApp();
        const url          = `${$api.stockOut()}`;
        const token        = localStorage.getItem('token');

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Failed to fetch Stock Out details! status: ${response.status}. Response: ${errorBody}`);
        }

        const resData = await response.json();
        this.stockOuts = resData

        console.log('Pinia store stockOut state after refresh load:', this.stockOuts);
      } catch (e) {
        console.error('Error fetching stock out details:', e);
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    // Fungsi untuk menghapus stock in
    async deleteStockOut(id: string) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')

        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' })
        if (!csrfResponse.ok)
          throw new Error('Gagal mengambil token CSRF')

        const csrfData = await csrfResponse.json()
        const csrfToken = csrfData.token

        const url = `${$api.stockOut()}/${id}`

        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
          credentials: 'include',
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Gagal menghapus stock out' }))
          throw new Error(errorData.message)
        }

        return true
      }
      catch (e: any) {
        console.error('Terjadi kesalahan saat menghapus stock out:', e)
        throw e
      }
        finally {
          this.loading = false
      }
    },
    // Fungsi untuk memposting stock out
    async postStockOut(id: string) {
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')

        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' })
        if (!csrfResponse.ok)
          throw new Error('Gagal mengambil token CSRF')

        const csrfData = await csrfResponse.json()
        const csrfToken = csrfData.token

        const url = `${$api.postStockOut(id)}`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
          credentials: 'include',
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Gagal memposting stock out' }))
          throw new Error(errorData.message)
        }

        return true
      } catch (e) {
        console.error('Error posting stock out:', e)
        this.error = e
        throw e
      }
      finally {
        this.loading = false
      }
    },
    // Fungsi untuk mengambil data statistik stock out
    async fetchStats() {
      const defaultStats = {
        total: undefined,
        draft: undefined,
        posted: undefined,
      };
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')
        const response = await fetch($api.countStockOut(), {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    
        if (response.ok) {
          const result = await response.json();
          if (result && typeof result === 'object' && result !== null) {
            this.stats = {
                total : result.total,
                draft : result.draft,
                posted: result.posted,
            };
          } else {
            this.stats = defaultStats;
            console.warn('Data statistik dari API tidak dalam format objek yang diharapkan atau null:', result);
          }
        } else {
            this.stats = defaultStats;
            console.error('Gagal mengambil data statistik, status respons:', response.status);
        }
      } catch (error: any) {
        console.error('Gagal mengambil data statistik (exception):', error);
        this.stats = defaultStats;
        this.error = error;
      }
    },
    openModal(stockOutData: StockOut | null = null) {
        this.isEditMode = !!stockOutData;
        this.validationErrors = [];

        if (stockOutData) {
            this.form = {
                ...JSON.parse(JSON.stringify(stockOutData)),
                date: stockOutData.date ? new Date(stockOutData.date).toISOString().slice(0, 10) : '',
            };
        } else {
            this.form = {
              noSo: '',
              date: '',
              status: '',
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
        this.fetchStockOutsPaginated();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchStockOutsPaginated();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchStockOutsPaginated();
    },

    handleRowsChange() {
        this.params.first = 0;
        this.fetchStockOutsPaginated();
    },

    async fetchStockOutById(id: string) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')

        const response = await fetch(`${$api.stockOutDetail()}/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: 'Gagal memuat data stock out',
          }))
          throw new Error(errorData.message)
        }

        const result = await response.json()
        this.selectedStockOut = result
      }
      catch (e) {
        this.error = e
        throw e
      }
      finally {
        this.loading = false
      }
    },
    resetStockOut() {
        this.selectedStockOut = null;
        this.error = null;
    },
  }
})
