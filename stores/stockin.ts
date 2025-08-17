import { defineStore } from 'pinia'
import type { StockIn, StockOut, Stock, StockInDetail, StockOutDetail, StockTransfer } from './stocks'

interface Stats {
  total : number | undefined
  draft : number | undefined
  posted: number | undefined
}

interface StockState {
  stockIns       : StockIn[]
  selectedStockIn: StockIn | null
  totalRecords   : number
  stockOuts      : StockOut[]
  stockInDetails : StockInDetail[]
  stockOutDetails: StockOutDetail[]
  stockTransfers : StockTransfer[]
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
    id: string
  }
  form: any
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useStockStore = defineStore('stock', {
  state: (): StockState => ({
    stockIns: [],
    stockOuts: [],
    stockInDetails: [],
    stockOutDetails: [],
    stockTransfers: [],
    selectedStockIn: null,
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
        id: '',
    },
    form: {},
    isEditMode: false,
    showModal: false,
    validationErrors: [],
  }),
  actions: {
    async fetchStockInsPaginated() {
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

        const response = await fetch(`${$api.stockIn()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data stock in dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data stock in');
        }

        const result = await response.json();
        this.stockIns = result.data || []; 
        this.totalRecords = parseInt(result.meta.total) || 0;
        
        return result;
      } catch (error) {
          this.stockIns = [];
          this.totalRecords = 0;
          throw error;
      } finally {
          this.loading = false;
      }
    },
    // Fungsi untuk mengambil data stock in
    async fetchStockIns() {
      try {
        this.loading = true;
        const { $api }     = useNuxtApp();
        const url          = `${$api.stockIn()}`;
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
          throw new Error(`Failed to fetch Stock In details! status: ${response.status}. Response: ${errorBody}`);
        }

        const resData = await response.json();
        this.stockIns = resData
      } catch (e) {
        console.error('Error fetching stock in details:', e);
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    // Fungsi untuk menghapus stock in
    async deleteStockIn(id: string) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')

        const url = `${$api.stockIn()}/${id}`

        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Gagal menghapus stock in' }))
          throw new Error(errorData.message)
        }

        return true
      }
      catch (e: any) {
        console.error('Terjadi kesalahan saat menghapus stock in:', e)
        throw e
      }
        finally {
          this.loading = false
      }
    },
    // Fungsi untuk memposting stock in
    async postStockIn(id: string) {
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')

        const url = `${$api.postStockIn(id)}`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Gagal memposting stock in' }))
          throw new Error(errorData.message)
        }

        return true
      } catch (e) {
        console.error('Error posting stock in:', e)
        this.error = e
        throw e
      }
      finally {
        this.loading = false
      }
    },
    // Fungsi untuk mengambil data statistik stock in
    async fetchStats() {
      const defaultStats = {
        total: undefined,
        draft: undefined,
        posted: undefined,
      };
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')
        const response = await fetch($api.countStockIn(), {
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

    setPagination(event: any) {
        this.params.first = event.first;
        this.params.rows = event.rows;
        this.fetchStockInsPaginated();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchStockInsPaginated();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchStockInsPaginated();
    },

    handleRowsChange() {
        this.params.first = 0;
        this.fetchStockInsPaginated();
    },

    async fetchStockInById(id: string) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')

        const response = await fetch(`${$api.getStockInDetails(id)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: 'Gagal memuat data stock in',
          }))
          throw new Error(errorData.message)
        }

        const result = await response.json()
        this.selectedStockIn = result
      }
      catch (e) {
        this.error = e
        throw e
      }
      finally {
        this.loading = false
      }
    },
    resetStockIn() {
      this.selectedStockIn = null;
      this.error = null;
    },

    // Method untuk export data dengan detail
    async exportStockInWithDetails() {
      try {
        const { $api } = useNuxtApp();
        const token = localStorage.getItem('token');
        
        // Ambil semua data stock in dengan detail untuk export
        const response = await fetch(`${$api.stockInExport()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal export data stock in' }));
            throw new Error(errorData.message || 'Gagal export data stock in');
        }

        const result = await response.json();
        
        return result.data || [];
      } catch (error) {
          throw error;
      }
    },
  }
})
