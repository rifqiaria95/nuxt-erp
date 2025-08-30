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
  selectedIds: string[]
  selectAll: boolean
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
    selectedIds: [],
    selectAll: false,
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

        const url = `${$api.stockOut()}/${id}`

        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
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

        const url = `${$api.postStockOut(id)}`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
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

        const response = await fetch(`${$api.getStockOutDetails(id)}`, {
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

    // Methods untuk checkbox selection
    toggleSelectAll() {
      this.selectAll = !this.selectAll;
      if (this.selectAll) {
        // Pilih semua stock out yang berstatus draft
        this.selectedIds = this.stockOuts
          .filter(stock => stock.status === 'draft')
          .map(stock => stock.id);
      } else {
        this.selectedIds = [];
      }
    },

    toggleSelection(id: string) {
      const index = this.selectedIds.indexOf(id);
      if (index > -1) {
        this.selectedIds.splice(index, 1);
      } else {
        this.selectedIds.push(id);
      }
      
      // Update selectAll status
      const draftStockOuts = this.stockOuts.filter(stock => stock.status === 'draft');
      this.selectAll = this.selectedIds.length === draftStockOuts.length && draftStockOuts.length > 0;
    },

    clearSelection() {
      this.selectedIds = [];
      this.selectAll = false;
    },

    // Method untuk export data dengan detail
    async exportStockOutWithDetails() {
      try {
        const { $api } = useNuxtApp();
        const token = localStorage.getItem('token');
        
        // Ambil semua data stock out dengan detail untuk export
        const response = await fetch(`${$api.stockOutExport()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal export data stock out' }));
            throw new Error(errorData.message || 'Gagal export data stock out');
        }

        const result = await response.json();
        return result.data || [];
      } catch (error) {
          throw error;
      }
    },

    // Method untuk posting multiple stock out
    async postAllStockOut(ids: string[]) {
      try {
        const { $api } = useNuxtApp();
        const token = localStorage.getItem('token');

        const response = await fetch($api.postAllStockOut(), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids }),
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Gagal memposting stock out' }));
          throw new Error(errorData.message);
        }

        const result = await response.json();
        return result;
      } catch (e) {
        console.error('Error posting all stock out:', e);
        this.error = e;
        throw e;
      }
    },
  }
})
