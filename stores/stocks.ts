import { defineStore } from 'pinia'
import type { PurchaseOrder } from './purchaseOrder'
import type { Warehouse } from './warehouse'
import type { User } from './userManagement'
import type { SalesOrder } from './sales-order'
import type { Product } from './product'

export interface StockIn {
  id             : string
  noSi           : string
  date           : string
  purchaseOrderId: number
  warehouseId    : number
  userId         : number
  stockId        : number
  quantity       : number
  description    : string
  status         : string
  purchaseOrder  : PurchaseOrder
  warehouse      : Warehouse
  user           : User
  stock          : Stock
  createdAt      : string
  updatedAt      : string
  product?       : Product
}

export interface StockOut {
  id          : number
  noSo        : string
  date        : string
  salesOrderId: number
  userId      : number
  stockId     : number
  description : string
  status      : string
  salesOrder  : SalesOrder
  user        : User
  stock       : Stock
  createdAt   : string
  updatedAt   : string
}

export interface Stock {
  id          : number
  productId   : number
  warehouseId : number
  quantity    : number
  createdAt   : string
  updatedAt   : string
}

export interface StockInDetail {
  id          : number
  nmCabang    : string
  alamatCabang: string
  kodeCabang  : string
  perusahaanId: number
  createdAt   : string
  updatedAt   : string
}

export interface StockOutDetail {
  id        : number
  name      : string
  sku       : string
  unitId    : number
  categoryId: number
  stockMin  : string
  priceBuy  : string
  priceSell : string
  isService : boolean
  image     : string
  createdAt : string
  updatedAt : string
}

export interface StockTransfer {
  id             : string
  purchaseOrderId: string
  productId      : number
  quantity       : string
  price          : string
  description    : string
  subtotal       : string
  statusPartial  : boolean
  receivedQty    : string
  createdAt      : string
  updatedAt      : string
  product?       : Product
}

interface Stats {
  total : number | undefined
  perWarehouse: {
    warehouse_id: number
    total: number
  }[]
}

interface StockState {
  stocks       : StockIn[]
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
  }
  form: any
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useStocksStore = defineStore('stocks', {
  state: (): StockState => ({
    stocks: [],
    stockOuts: [],
    stockInDetails: [],
    stockOutDetails: [],
    stockTransfers: [],
    totalRecords: 0,
    stats: {
      total: undefined,
      perWarehouse: []
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
    async validateStockBatch(items: { productId: number, warehouseId: number, quantity: number }[]) {
        const { $api } = useNuxtApp();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${$api.validateStockBatch()}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ items }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Gagal memvalidasi stok dengan status: ' + response.status }));
                throw new Error(errorData.message || 'Gagal memvalidasi stok');
            }

            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error in validateStockBatch:', error);
            throw error;
        }
    },

    async fetchStocksPaginated(filters: { productId?: number; warehouseId?: number } = {}) {
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

        if (filters.productId) {
          params.append('productId', filters.productId.toString())
        }
        if (filters.warehouseId) {
          params.append('warehouseId', filters.warehouseId.toString())
        }

        const response = await fetch(`${$api.stock()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data stock dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data stock');
        }

        const result = await response.json();
        this.stocks = result.data || []; 
        this.totalRecords = parseInt(result.meta.total) || 0;
        
        return result;
      } catch (error) {
          this.stocks = [];
          this.totalRecords = 0;
          throw error;
      } finally {
          this.loading = false;
      }
    },

    // Fungsi untuk mengambil data stock
    async fetchStocks() {
      try {
        this.loading = true;
        const { $api }     = useNuxtApp();
        const url          = `${$api.stock()}`;
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
          throw new Error(`Failed to fetch Stock details! status: ${response.status}. Response: ${errorBody}`);
        }

        const resData = await response.json();
        this.stocks = resData

        console.log('Pinia store stocks state after refresh load:', this.stocks);
      } catch (e) {
        console.error('Error fetching stock details:', e);
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    // Fungsi untuk menghapus stock
    async deleteStock(id: string) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')

        const url = `${$api.stock()}/${id}`

        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Gagal menghapus stock' }))
          throw new Error(errorData.message)
        }

        return true
      }
      catch (e: any) {
        console.error('Terjadi kesalahan saat menghapus stock:', e)
        throw e
      }
        finally {
          this.loading = false
      }
    },
    // Fungsi untuk mengambil data statistik stock
    async fetchStats() {
      const defaultStats = {
        total: undefined,
        perWarehouse: []
      };
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')
        const response = await fetch($api.getTotalStock(), {
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
                perWarehouse: result.perWarehouse
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
        this.fetchStocksPaginated();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchStocksPaginated();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchStocksPaginated();
    },

    handleRowsChange() {
        this.params.first = 0;
        this.fetchStocksPaginated();
    },
  }
})
