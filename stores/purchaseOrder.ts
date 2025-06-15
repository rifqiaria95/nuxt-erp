import { defineStore } from 'pinia'

export interface Vendor {
  id       : number
  name     : string
  createdAt: string
  updatedAt: string
}

export interface User {
  id       : number
  name     : string
  createdAt: string
  updatedAt: string
}

export interface Perusahaan {
  id           : number
  nmPerusahaan: string
  createdAt    : string
  updatedAt    : string
}

export interface Cabang {
  id          : number
  nmCabang    : string
  alamatCabang: string
  kodeCabang  : string
  perusahaanId: number
  createdAt   : string
  updatedAt   : string
}

export interface Product {
  id       : number
  name     : string
  sku      : string
  unitId   : number
  categoryId: number
  stockMin : string
  priceBuy : string
  priceSell: string
  isService: boolean
  image    : string
  createdAt: string
  updatedAt: string
}

export interface PurchaseOrderItem {
  id             : string
  purchaseOrderId: string
  productId      : number
  quantity       : string
  price          : string
  description    : string
  subtotal       : string
  createdAt      : string
  updatedAt      : string
  product?       : Product
}

export interface PurchaseOrder {
  id             : string
  name?          : string
  noPo           : string
  up             : string
  vendorId       : number
  perusahaanId   : number
  cabangId       : number
  date           : string
  dueDate        : string
  status         : string
  total          : string
  discountPercent: string
  taxPercent     : string
  description    : string
  attachment?    : string
  createdAt      : string
  updatedAt      : string
  createdBy      : number
  approvedBy     : number | null
  receivedBy     : number | null
  vendor?        : Vendor
  perusahaan?    : Perusahaan
  cabang?        : Cabang
  purchaseOrderItems? : PurchaseOrderItem[]
}

interface PurchaseOrderState {
  purchaseOrders: PurchaseOrder[]
  purchaseOrder: PurchaseOrder | null
  loading: boolean
}

export const usePurchaseOrderStore = defineStore('purchaseOrder', {
  state: (): PurchaseOrderState => ({
    purchaseOrders: [],
    purchaseOrder: null,
    loading: false
  }),
  actions: {
    async fetchPurchaseOrders() {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const response = await fetch($api.purchaseOrder())
        const data = await response.json()

        this.purchaseOrders = (data.data.data || data.data || data).map((item: any) => ({
          id             : item.id,
          name           : item.name,
          noPo           : item.noPo,
          up             : item.up,
          vendorId       : item.vendorId,
          perusahaanId   : item.perusahaanId,
          cabangId       : item.cabangId,
          dueDate        : item.dueDate,
          createdAt      : item.createdAt,
          updatedAt      : item.updatedAt,
          createdBy      : item.createdBy,
          approvedBy     : item.approvedBy,
          receivedBy     : item.receivedBy,
          vendor         : item.vendor,
          perusahaan     : item.perusahaan,
          cabang         : item.cabang,
        }))
      } catch (error) {
        console.error('Gagal mengambil data purchaseOrder:', error)
      } finally {
        this.loading = false
      }
    },

    addPurchaseOrder(purchaseOrder: PurchaseOrder) {
        this.purchaseOrders.push(purchaseOrder) 
    },
    removePurchaseOrder(purchaseOrderId: string) {
        this.purchaseOrders = this.purchaseOrders.filter(purchaseOrder => purchaseOrder.id !== purchaseOrderId)
    },
    updatePurchaseOrder(updatedPurchaseOrder: PurchaseOrder) {
        const index = this.purchaseOrders.findIndex(purchaseOrder => purchaseOrder.id === updatedPurchaseOrder.id)
        if (index !== -1) {
            this.purchaseOrders[index] = updatedPurchaseOrder
        }
    },
    getPurchaseOrderById(id: string): PurchaseOrder | undefined {
      return this.purchaseOrders.find(purchaseOrder => purchaseOrder.id === id)
    },
    async getPurchaseOrderDetails(id: string) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in localStorage')
        }

        // The show method for a resource is typically /resource/{id}
        const response = await fetch(`${$api.purchaseOrder()}/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const responseData = await response.json()
        
        if(responseData.data) {
          this.purchaseOrder = responseData.data
        } else {
          console.error('Data purchase order tidak ditemukan dalam respons:', responseData)
          this.purchaseOrder = null
        }
      } catch (error) {
        console.error('Gagal mengambil detail purchase order:', error)
        this.purchaseOrder = null
      } finally {
        this.loading = false
      }
    },
  }
})
