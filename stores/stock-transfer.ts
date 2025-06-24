import { defineStore } from 'pinia'
import type { StockTransfer } from './stocks'
import Swal from 'sweetalert2'

interface Stats {
  total : number | undefined
  draft : number | undefined
  approved: number | undefined
  rejected: number | undefined
}

interface StockTransferState {
  totalRecords   : number
  stockTransfers : StockTransfer[]
  selectedStockTransfer: StockTransfer | null
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

export const useStockTransferStore = defineStore('stockTransfer', {
  state: (): StockTransferState => ({
    stockTransfers: [],
    selectedStockTransfer: null,
    totalRecords: 0,
    stats: {
      total: undefined,
      draft: undefined,
      approved: undefined,
      rejected: undefined
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
    async fetchStockTransfersPaginated() {
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

        const response = await fetch(`${$api.stockTransfer()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data stock transfer dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data stock transfer');
        }

        const result = await response.json();
        this.stockTransfers = result.data || []; 
        this.totalRecords = parseInt(result.meta.total) || 0;
        
        return result;
      } catch (error) {
          this.stockTransfers = [];
          this.totalRecords = 0;
          throw error;
      } finally {
          this.loading = false;
      }
    },

    async saveStockTransfer() {
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
          noTransfer: this.form.noTransfer,
          date: this.form.date,
          fromWarehouseId: this.form.fromWarehouseId,
          toWarehouseId: this.form.toWarehouseId,
          status: this.form.status,
        }
  
        if (this.isEditMode) {
          if (!this.form.id) {
            throw new Error('ID Stock Transfer tidak ditemukan untuk update.')
          }
          url = `${$api.stockTransfer()}/${this.form.id}`
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
          url = $api.stockTransfer()
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
          const errorData = await response.json().catch(() => ({ message: `Gagal ${this.isEditMode ? 'memperbarui' : 'membuat'} stock transfer` }))
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
    // Fungsi untuk mengambil data stock transfer
    async fetchStockTransfers() {
      try {
        this.loading = true;
        const { $api }     = useNuxtApp();
        const url          = `${$api.stockTransfer()}`;
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
          throw new Error(`Failed to fetch Stock Transfer details! status: ${response.status}. Response: ${errorBody}`);
        }

        const resData = await response.json();
        this.stockTransfers = resData

        console.log('Pinia store stockTransfer state after refresh load:', this.stockTransfers);
      } catch (e) {
        console.error('Error fetching stock in details:', e);
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    // Fungsi untuk menghapus stock transfer
    async deleteStockTransfer(id: string) {
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

        const url = `${$api.stockTransfer()}/${id}`

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
          const errorData = await response.json().catch(() => ({ message: 'Gagal menghapus stock transfer' }))
          throw new Error(errorData.message)
        }

        return true
      }
      catch (e: any) {
        console.error('Terjadi kesalahan saat menghapus stock transfer:', e)
        throw e
      }
        finally {
          this.loading = false
      }
    },
    async approveStockTransfer(stockTransferId: string) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
          const token        = localStorage.getItem('token');
          const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
          if (!csrfResponse.ok) throw new Error('Gagal mendapatkan CSRF token.');
          const csrfData  = await csrfResponse.json();
          const csrfToken = csrfData.token;

          const response = await fetch($api.approveStockTransfer(stockTransferId), {
              method: 'PATCH',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type' : 'application/json',
                  'Accept'       : 'application/json',
                  'X-CSRF-TOKEN' : csrfToken,
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Gagal mengapprove stock transfer' }));
              throw new Error(errorData.message || 'Gagal mengapprove stock transfer');
          }

          await this.fetchStockTransfers();
          await Swal.fire('Berhasil!', 'Stock Transfer berhasil diapprove.', 'success');

          return true;
      } catch (error: any) {
          console.error('Error approving stock transfer:', error);
          await Swal.fire('Error', error.message || 'Gagal mengapprove stock transfer.', 'error');
          return false;
      } finally {
          this.loading = false;
      }
    },
    // Fungsi untuk mengambil data statistik stock transfer
    async fetchStats() {
      const defaultStats = {
        total   : undefined,
        draft   : undefined,
        approved: undefined,
        rejected: undefined,
      };
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')
        const response = await fetch($api.countStockTransfer(), {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    
        if (response.ok) {
          const result = await response.json();
          if (result && typeof result === 'object' && result !== null) {
            this.stats = {
                total   : result.total,
                draft   : result.draft,
                approved: result.approved,
                rejected: result.rejected,
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
    openModal(stockTransferData: StockTransfer | null = null) {
        this.isEditMode = !!stockTransferData;
        this.validationErrors = [];

        if (stockTransferData) {
          this.form = {
            id: (stockTransferData as any).id,
            noTransfer: (stockTransferData as any).noTransfer || '',
            date: (stockTransferData as any).date
              ? new Date((stockTransferData as any).date).toISOString().slice(0, 10)
              : '',
            fromWarehouseId: (stockTransferData as any).fromWarehouseId ?? null,
            toWarehouseId: (stockTransferData as any).toWarehouseId ?? null,
            status: (stockTransferData as any).status ?? '',
          };
        } else {
          this.form = {
            id: null,
            noTransfer: '',
            date: '',
            fromWarehouseId: null,
            toWarehouseId: null,
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
        this.fetchStockTransfersPaginated();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchStockTransfersPaginated();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchStockTransfersPaginated();
    },

    handleRowsChange() {
        this.params.first = 0;
        this.fetchStockTransfersPaginated();
    },

    async fetchStockTransferById(id: string) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')

        const response = await fetch(`${$api.getStockTransferDetails(id)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: 'Gagal memuat data stock transfer',
          }))
          throw new Error(errorData.message)
        }

        const result = await response.json()
        this.selectedStockTransfer = result
      }
      catch (e) {
        this.error = e
        throw e
      }
      finally {
        this.loading = false
      }
    },
    resetStockTransfer() {
      this.selectedStockTransfer = null;
      this.error = null;
    },
    addItem() {
      if (!this.form.stockTransferItems) {
          this.form.stockTransferItems = [];
      }
      this.form.stockTransferItems.push({
          stockTransferItemId: null,
          quantity: 0
      });
    },
    removeItem(index: number) {
        if (this.form.stockTransferItems) {
            this.form.stockTransferItems.splice(index, 1);
        }
    }
  }
})
