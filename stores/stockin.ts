import { defineStore } from 'pinia'
import type { PurchaseOrder } from './purchaseOrder'
import type { Warehouse } from './warehouse'
import type { User } from './user'
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
  nmPerusahaan: string
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
  draft : number | undefined
  posted: number | undefined
}

interface StockState {
  stockIns       : StockIn[]
  stockOuts      : StockOut[]
  stockInDetails : StockInDetail[]
  stockOutDetails: StockOutDetail[]
  stockTransfers : StockTransfer[]
  stats          : Stats
  loading        : boolean
  error          : any
}

export const useStockStore = defineStore('stock', {
  state: (): StockState => ({
    stockIns: [],
    stockOuts: [],
    stockInDetails: [],
    stockOutDetails: [],
    stockTransfers: [],
    stats: {
      total: undefined,
      draft: undefined,
      posted: undefined
    },
    loading       : false,
    error         : null
  }),
  actions: {
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

        console.log('Pinia store stockIn state after refresh load:', this.stockIns);
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

        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' })
        if (!csrfResponse.ok)
          throw new Error('Gagal mengambil token CSRF')

        const csrfData = await csrfResponse.json()
        const csrfToken = csrfData.token

        const url = `${$api.stockIn()}/${id}`

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

        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' })
        if (!csrfResponse.ok)
          throw new Error('Gagal mengambil token CSRF')

        const csrfData = await csrfResponse.json()
        const csrfToken = csrfData.token

        const url = `${$api.postStockIn(id)}`

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
    }
  }
})
