import { defineStore } from 'pinia'

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
          createdByUser  : item.createdByUser,
          approvedByUser : item.approvedByUser,
          receivedByUser : item.receivedByUser,
          approvedAt     : item.approvedAt,
          receivedAt     : item.receivedAt,
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

    async getPurchaseOrderDetails(poId: string) {
      try {
        this.loading = true;
        const { $api } = useNuxtApp();
        const url = `${$api.getPurchaseOrderDetails(poId)}`;
        const token = localStorage.getItem('token');

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Failed to fetch PO details! status: ${response.status}. Response: ${errorBody}`);
        }

        const resData = await response.json();

        if (resData && resData.data) {
          const poData = resData.data;

          if (poData.purchaseOrderItems) {
            poData.purchaseOrderItems = poData.purchaseOrderItems.map((item: any) => ({
              ...item,
              statusPartial: item.statusPartial ?? item.statusPartial,
              receivedQty: item.receivedQty ?? item.receivedQty
            }));
          }

          this.purchaseOrder = poData;
        } else {
          throw new Error('Invalid data structure received from getPurchaseOrderDetails API.');
        }

        console.log('Pinia store purchaseOrder state after refresh load:', this.purchaseOrder);
      } catch (e) {
        console.error('Error fetching purchase order details:', e);
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async updatePurchaseOrderItemStatus(itemId: string, status: boolean, receivedQty: number) {
      try {
        this.loading = true;

        const { $api } = useNuxtApp();
        const url = `${$api.purchaseOrderItemUpdateStatusPartial(itemId)}`;

        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;
        const token = localStorage.getItem('token');


        if (!csrfToken) {
          throw new Error('CSRF token not found. Cannot proceed with request.');
        }

        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ statusPartial: status, receivedQty: receivedQty }),
          credentials: 'include'
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`HTTP error! status: ${response.status}. Response: ${errorBody}`);
        }

        const resData = await response.json();
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

  }
})
