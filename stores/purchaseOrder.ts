import { defineStore } from 'pinia'
import { apiFetch } from '~/utils/apiFetch'

export interface Vendor {
  id       : number
  name     : string
  createdAt: string
  updatedAt: string
}

export interface User {
  id        : number
  fullName  : string
  createdAt : string
  updatedAt : string
  approvedAt: string | null
  receivedAt: string | null
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
  statusPartial : boolean
  receivedQty   : string
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
  approvedAt     : string | null
  receivedAt     : string | null
  vendor?        : Vendor
  perusahaan?    : Perusahaan
  cabang?        : Cabang
  createdByUser? : User
  approvedByUser?: User
  receivedByUser?: User
  purchaseOrderItems? : PurchaseOrderItem[]
}

interface PurchaseOrderState {
  purchaseOrders: PurchaseOrder[]
  purchaseOrder: PurchaseOrder | null
  loading: boolean
  error: any
}

export const usePurchaseOrderStore = defineStore('purchaseOrder', {
  state: (): PurchaseOrderState => ({
    purchaseOrders: [],
    purchaseOrder : null,
    loading       : false,
    error         : null
  }),
  actions: {
    async fetchPurchaseOrders() {
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
      try {
        const response = await apiFetch($api.purchaseOrder())
        // Assuming the response structure is { data: { data: [...] } } or similar
        this.purchaseOrders = response.data?.data || response.data || response || []
      } catch (e) {
        console.error('Gagal mengambil data purchaseOrder:', e)
        this.error = e
      } finally {
        this.loading = false
      }
    },

    async getPurchaseOrderDetails(poId: string) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
        const resData = await apiFetch($api.getPurchaseOrderDetails(poId));
        if (resData && resData.data) {
          this.purchaseOrder = resData.data;
        } else {
          throw new Error('Struktur data tidak valid diterima dari API getPurchaseOrderDetails.');
        }
      } catch (e) {
        console.error('Gagal mengambil detail purchase order:', e);
        this.error = e;
      } finally {
        this.loading = false;
      }
    },

    async updatePurchaseOrderItemStatus(itemId: string, status: boolean, receivedQty: number) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
        const resData = await apiFetch($api.purchaseOrderItemUpdateStatusPartial(itemId), {
          method: 'PATCH',
          body: { statusPartial: status, receivedQty: receivedQty },
        });

        const updatedPurchaseOrderItem = resData.data.purchaseOrderItem;
        const updatedPurchaseOrder = resData.data.purchaseOrder;

        if (this.purchaseOrder && this.purchaseOrder.purchaseOrderItems) {
          const index = this.purchaseOrder.purchaseOrderItems.findIndex(item => item.id === itemId);
          if (index !== -1) {
            this.purchaseOrder.purchaseOrderItems[index].statusPartial = updatedPurchaseOrderItem.statusPartial;
            this.purchaseOrder.purchaseOrderItems[index].receivedQty = updatedPurchaseOrderItem.receivedQty;
          }
          if (this.purchaseOrder.status !== updatedPurchaseOrder.status) {
              this.purchaseOrder.status = updatedPurchaseOrder.status;
          }
        }
        console.log('Status item PO dan Purchase Order berhasil diperbarui:', resData);
      } catch (error) {
        console.error('Gagal memperbarui status item PO atau PO:', error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Keeping these simple actions as they are, assuming they operate on local state only for now
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
  }
})
