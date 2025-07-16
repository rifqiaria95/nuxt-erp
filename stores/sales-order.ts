import { defineStore, storeToRefs } from 'pinia'
import { apiFetch } from '~/utils/apiFetch'
import Swal from 'sweetalert2'
import { useNuxtApp } from '#app'
import { useUserStore } from '~/stores/user'
import { useStocksStore } from '~/stores/stocks'
import { useProductStore } from '~/stores/product'
import type { Customer } from './customer'
import type { User } from './userManagement'
import type { Perusahaan } from './perusahaan'
import type { Cabang } from './cabang'
import type { Product } from './product'


interface SalesReturnInfo {
  id: string;
  status: string;
}

interface SalesReturnItemInfo {
  id: string;
  salesReturn: SalesReturnInfo;
}

interface Stats {
  total: number | undefined
  approved: number | undefined
  rejected: number | undefined
  partial: number | undefined
  delivered: number | undefined
  deliveredLast4Months: number | undefined
}

export interface SalesOrderItem {
  id           : string
  salesOrderId : string
  productId    : number
  warehouseId  : number
  quantity     : number
  price        : number
  description  : string
  subtotal     : number
  statusPartial: boolean
  deliveredQty : number
  createdAt    : string
  updatedAt    : string
  product?     : Product
  salesReturnItems?: SalesReturnItemInfo[]
}

export interface SalesOrder {
  id              : string
  name?           : string
  noSo            : string
  noPo            : string
  up              : string
  customerId      : number
  perusahaanId    : number
  cabangId        : number
  date            : string
  dueDate         : string
  status          : string
  paymentMethod   : string
  source          : string
  total           : string
  discountPercent : string
  taxPercent      : string
  description     : string
  attachment?     : string
  createdAt       : string
  updatedAt       : string
  createdBy       : number
  approvedBy      : number | null
  deliveredBy     : number | null
  rejectedBy      : number | null
  approvedAt      : string | null
  deliveredAt     : string | null
  rejectedAt      : string | null
  customer?       : Customer
  perusahaan?     : Perusahaan
  cabang?         : Cabang
  createdByUser?  : User
  approvedByUser? : User
  deliveredByUser?: User
  salesOrderItems?: SalesOrderItem[]
}

export interface CustomerProduct extends Product {
  priceSell: number;
}

interface SalesOrderState {
  salesOrders       : SalesOrder[]
  salesOrder        : SalesOrder | null
  originalSalesOrder: SalesOrder | null
  customerProducts  : CustomerProduct[]
  loading           : boolean
  error             : any
  stats             : Stats
  totalRecords      : number
  params: {
    first      : number
    rows       : number
    sortField  : string | null
    sortOrder  : number | null
    draw       : number
    search     : string
    customerId?: number | null
    source?    : string | null
    status?    : string | null
  }
  form            : any,
  isEditMode      : boolean
  showModal       : boolean
  validationErrors: any[]
}

export const useSalesOrderStore = defineStore('salesOrder', {
  state: (): SalesOrderState => ({
    salesOrders       : [],
    salesOrder        : null,
    originalSalesOrder: null,
    customerProducts  : [],
    loading           : true,
    error             : null,
    totalRecords      : 0,
    stats             : {
      total: 0,
      approved: 0,
      rejected: 0,
      partial: 0,
      delivered: 0,
      deliveredLast4Months: 0,
    },
    params: {
        first     : 0,
        rows      : 10,
        sortField : 'createdAt',
        sortOrder : -1,
        draw      : 1,
        search    : '',
        customerId: null,
        source    : null,
        status    : null,
    },
    form: {
        noSo           : '',
        noPo           : '',
        up             : '',
        customerId     : null,
        perusahaanId   : null,
        cabangId       : null,
        date           : new Date().toISOString().split('T')[0],
        dueDate        : new Date().toISOString().split('T')[0],
        discountPercent: 0,
        taxPercent     : 0,
        description    : '',
        attachment     : null,
        status         : 'draft',
        paymentMethod  : null,
        source         : null,
        salesOrderItems: []
    },
    isEditMode      : false,
    showModal       : false,
    validationErrors: [],
  }),
  getters: {
    // Getter to combine products from different sources
    allAvailableProducts(state) {
      const productStore = useProductStore()
      // Safely access products from the product store
      const generalProducts = productStore.products || []
      const customerSpecificProducts = state.customerProducts || []
      
      // Combine and deduplicate products based on ID
      const allProductsMap = new Map()
      generalProducts.forEach(p => allProductsMap.set(p.id, p))
      customerSpecificProducts.forEach(p => allProductsMap.set(p.id, p))
      
      return Array.from(allProductsMap.values())
    }
  },
  actions: {
    async fetchSalesOrders() {
      const toast     = useToast();
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
        try {
        const token        = localStorage.getItem('token');

        const url = new URL($api.salesOrder())
        const params = new URLSearchParams({
            page     : ((this.params.first / this.params.rows) + 1).toString(),
            rows     : this.params.rows.toString(),
            sortField: this.params.sortField || '',
            sortOrder: this.params.sortOrder?.toString() || '',
            draw     : this.params.draw.toString(),
            search   : this.params.search || '',
        });

        if (this.params.customerId) {
          params.append('customerId', this.params.customerId.toString());
        }
        if (this.params.source) {
          params.append('source', this.params.source);
        }
        if (this.params.status) {
          params.append('status', this.params.status);
        }
          
        url.search = params.toString();

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept'       : 'application/json',
            'Content-Type' : 'application/json'
          },
          credentials: 'include'
        })

        if (!response.ok) throw new Error('Gagal mengambil data salesOrder')

        const result = await response.json()
        this.salesOrders = result.data
        this.totalRecords = result.meta.total
      } catch (e: any) {
        console.error('Gagal mengambil data salesOrder:', e)
        this.error = e
        toast.error({
          title: 'Error',
          message: `Tidak dapat memuat data Sales Order: ${e?.message || e}`,
          color: 'red'
        });
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
        const toast     = useToast();
        const { $api } = useNuxtApp();
        const defaultStats = {
          total: undefined,
          approved: undefined,
          rejected: undefined,
          partial: undefined,
          delivered: undefined,
          deliveredLast4Months: undefined,
        };
        try {
          const token = localStorage.getItem('token');
          const response = await fetch($api.countSalesOrderByStatus(), {
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

    async fetchProductsForCustomer(customerId: number) {
      const toast     = useToast();
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      if (!customerId) {
        this.customerProducts = []
        return
      }
      try {
        const token = localStorage.getItem('token');

        const response = await fetch($api.customer() + '/' + customerId, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        })
        if (!response.ok) throw new Error('Gagal mengambil data produk untuk customer')
        const result = await response.json()
        this.customerProducts = result.data.customerProducts || []
      } catch (error) {
        console.error('Error fetching products for customer:', error)
        // Jangan hapus produk yang ada jika fetch gagal
        // this.customerProducts = [] 
        toast.error({
          title: 'Error',
          message: 'Gagal memuat produk untuk customer yang dipilih.',
          color: 'red'
        });
      } finally {
        this.loading = false
      }
    },

    async saveSalesOrder() {
        const toast     = useToast();
        this.loading = true;
        this.validationErrors = [];
        const { $api } = useNuxtApp();
        const userStore = useUserStore();
        const stockStore = useStocksStore();
        const productStore = useProductStore();

        // Kumpulkan semua item yang perlu divalidasi
        const itemsToValidate = this.form.salesOrderItems
            .filter((item: any) => item.productId && item.warehouseId && item.quantity > 0)
            .map((item: any) => ({
                productId: item.productId,
                warehouseId: item.warehouseId,
                quantity: item.quantity,
            }));

        if (itemsToValidate.length > 0) {
            try {
                const validationResults = await stockStore.validateStockBatch(itemsToValidate);

                const invalidItem = validationResults.find((result: any) => !result.hasEnoughStock);

                if (invalidItem) {
                    // Buat daftar produk gabungan yang aman secara lokal
                    const generalProducts = productStore.products || [];
                    const customerSpecificProducts = this.customerProducts || [];
                    const allProducts = [...generalProducts, ...customerSpecificProducts];

                    const product = allProducts.find(p => p && p.id === invalidItem.productId);
                    const productName = product ? product.name : `ID ${invalidItem.productId}`;
                    const errorMessage = `Stok untuk produk "${productName}" tidak mencukupi. Stok tersedia: ${Math.floor(Number(invalidItem.availableStock))}, kuantitas diminta: ${invalidItem.requestedQuantity}.`;
                    
                    this.validationErrors = [{ message: errorMessage, field: 'quantity' }];
                    toast.error({
                      title: 'Error',
                      message: errorMessage,
                      color: 'red'
                    });
                    this.loading = false;
                    return; // Hentikan proses
                }
            } catch (error) {
                console.error('Gagal memvalidasi stok:', error);
                toast.error({
                  title: 'Error',
                  message: 'Tidak dapat memvalidasi stok untuk produk.',
                  color: 'red'
                });
                this.loading = false;
                return;
            }
        }

        try {
            const token        = localStorage.getItem('token');

            const formData = new FormData()

            // Append main form data
            const dataToAppend = { ...this.form };
            // Hapus data relasi dan data yang tidak perlu dikirim
            delete dataToAppend.salesOrderItems;
            delete dataToAppend.attachment;
            delete dataToAppend.customer;
            delete dataToAppend.perusahaan;
            delete dataToAppend.cabang;
            delete dataToAppend.createdByUser;
            delete dataToAppend.approvedByUser;
            delete dataToAppend.deliveredByUser;
            delete dataToAppend.rejectedByUser;
            Object.keys(dataToAppend).forEach(key => {
                const value = dataToAppend[key];
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            // Append createdBy hanya untuk PO baru
            if (!this.isEditMode && userStore.user && userStore.user.id) {
                formData.append('createdBy', userStore.user.id.toString())
                if(this.form.status === 'approved') {
                    formData.append('approvedBy', userStore.user.id.toString())
                }
                if(this.form.status === 'rejected') {
                    formData.append('rejectedBy', userStore.user.id.toString())
                }
                if(this.form.status === 'delivered') {
                    formData.append('deliveredBy', userStore.user.id.toString())
                }
            }

            // Append attachment if it's a file
            if (this.form.attachment instanceof File) {
                formData.append('attachment', this.form.attachment);
            }

            // Append sales order items using camelCase keys
            this.form.salesOrderItems.forEach((item: any, i: number) => {
                if (item.productId && item.quantity > 0) {
                    Object.keys(item).forEach(itemKey => {
                        const value = item[itemKey];
                        if (value !== null && value !== undefined) {
                           formData.append(`salesOrderItems[${i}][${itemKey}]`, value);
                        }
                    });
                }
            });

            const method = this.isEditMode ? 'POST' : 'POST';
            const url = this.isEditMode ? `${$api.salesOrder()}/${this.form.id}` : $api.salesOrder();
            if (this.isEditMode) {
                formData.append('_method', 'PUT');
            }
            
            // Kirim data ke API
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 422) {
                    this.validationErrors = errorData.errors;
                    toast.error({
                      title: 'Error',
                      message: 'Gagal Validasi',
                      color: 'red'
                    });
                } else {
                    throw new Error(errorData.message || 'Gagal menyimpan data salesOrder');
                }
            } else {
                this.closeModal();
                await this.fetchSalesOrders();
                toast.success({
                  title: 'Success',
                  message: `Sales Order berhasil ${this.isEditMode ? 'diperbarui' : 'dibuat'}.`,
                  color: 'green'
                });
            }


        } catch (error: any) {
            // Clear validation errors on new general error
            this.validationErrors = [];
            toast.error({
              title: 'Error',
              message: error.message || 'Operasi gagal',
              color: 'red'
            });
        } finally {
            this.loading = false;
        }
    },

    async deleteSalesOrder(id: string) {
      const toast     = useToast();
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
          const token = localStorage.getItem('token');

          const response = await fetch(`${$api.salesOrder()}/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus Sales Order');
          }

          await this.fetchSalesOrders();
          toast.success({
            title: 'Success',
            message: 'Sales Order berhasil dihapus.',
            color: 'green'
          });
      } catch (error: any) {
          toast.error({
            title: 'Error',
            message: error.message || 'Gagal menghapus Sales Order',
            color: 'red'
          });
      } finally {
          this.loading = false;
      }
    },
    
    async approveSalesOrder(salesOrderId: string) {
      const toast     = useToast();
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
          const token = localStorage.getItem('token');

          const response = await fetch($api.approveSalesOrder(salesOrderId), {
              method: 'PATCH',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type' : 'application/json',
                  'Accept'       : 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Gagal mengapprove sales order' }));
              throw new Error(errorData.message || 'Gagal mengapprove sales order');
          }

          await this.fetchSalesOrders();
            toast.success({
            title: 'Success',
            message: 'Sales Order berhasil diapprove.',
            color: 'green'
          });

          return true;
      } catch (error: any) {
          console.error('Error approving sales order:', error);
          toast.error({
            title: 'Error',
            message: error.message || 'Gagal mengapprove sales order.',
            color: 'red'
          });
          return false;
      } finally {
          this.loading = false;
      }
    },

    async rejectSalesOrder(salesOrderId: string) {
      const toast     = useToast();
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
          const token = localStorage.getItem('token');

          const response = await fetch($api.rejectSalesOrder(salesOrderId), {
              method: 'PATCH',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type' : 'application/json',
                  'Accept'       : 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Gagal mereject sales order' }));
              throw new Error(errorData.message || 'Gagal mereject sales order');
          }

          await this.fetchSalesOrders();
          toast.success({
            title: 'Success',
            message: 'Sales Order berhasil direject.',
            color: 'green'
          });

          return true;
      } catch (error: any) {
          console.error('Error rejecting sales order:', error);
          toast.error({
            title: 'Error',
            message: error.message || 'Gagal mereject sales order.',
            color: 'red'
          });
          return false;
      } finally {
          this.loading = false;
      }
    },    

    async updateStatusPartial(itemId: string, status: boolean, deliveredQty: number) {
        const toast     = useToast();
        this.loading = true;
        this.error = null;
        const { $api } = useNuxtApp();
        try {
            const token        = localStorage.getItem('token');

            const resData = await apiFetch($api.salesOrderItemUpdateStatusPartial(itemId), {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: { 
                    statusPartial: status, 
                    deliveredQty: deliveredQty 
                },
                credentials: 'include',
            });

            const updatedSalesOrderItem = resData.data.salesOrderItem;
            const updatedSalesOrder = resData.data.salesOrder;

            if (this.salesOrder && this.salesOrder.salesOrderItems) {
                const index = this.salesOrder.salesOrderItems.findIndex(item => item.id === itemId);
                if (index !== -1) {
                    this.salesOrder.salesOrderItems[index].statusPartial = updatedSalesOrderItem.statusPartial;
                    this.salesOrder.salesOrderItems[index].deliveredQty = updatedSalesOrderItem.deliveredQty;
                }
                if (this.salesOrder.status !== updatedSalesOrder.status) {
                    this.salesOrder.status = updatedSalesOrder.status;
                }
            }
            
        } catch (error: any) {
            console.error('Gagal memperbarui status item SO atau SO:', error);
            this.error = error;
            toast.error({
              title: 'Error',
              message: error.data?.message || error.message || 'Operasi gagal',
              color: 'red'
            });
            throw error;
        } finally {
            this.loading = false;
        }
    },

    async openModal(salesOrderData: SalesOrder | null = null, source: 'admin' | 'pos' | null = null) {
      const toast     = useToast();
      this.isEditMode = !!salesOrderData;
      this.validationErrors = [];

      if (salesOrderData) {
          await this.getSalesOrderDetails(salesOrderData.id);
          const fullData = this.salesOrder;

          if (!fullData) {
              toast.error({
                title: 'Error',
                message: 'Tidak dapat memuat data Sales Order.',
                color: 'red'
              });
              return;
          }
          this.originalSalesOrder = JSON.parse(JSON.stringify(fullData));
          const formatDate = (dateStr: string | null) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : null;
          
          // Salin data dan format tanggal dengan benar
          const formData: { [key: string]: any } = {
              ...JSON.parse(JSON.stringify(fullData)),
              attachment: null, // Reset attachment, akan ditangani secara terpisah
          };

          const dateFields = ['date', 'dueDate', 'approvedAt', 'deliveredAt'];
          dateFields.forEach(field => {
              if (formData[field]) {
                  formData[field] = formatDate(formData[field]);
              }
          });

          this.form = formData;
          if (source) {
            this.form.source = source;
          }

          // Wait for products to be fetched before showing modal
          if (this.form.customerId) {
              await this.fetchProductsForCustomer(this.form.customerId);
          }

          // Pastikan salesOrderItems ada dan tambahkan stock jika belum ada
          if (this.form.salesOrderItems && this.form.salesOrderItems.length > 0) {
            this.form.salesOrderItems = this.form.salesOrderItems.map((item: any) => {
                return {
                    ...item,
                    stock: item.stock || { quantity: 0 },
                }
            })
          } else {
            this.form.salesOrderItems = [];
            this.addItem();
          }
      } else {
          this.resetForm(source);
          this.addItem(); // Tambahkan satu item default untuk SO baru
      }
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.isEditMode = false;
      this.originalSalesOrder = null;
      this.resetForm();
      this.validationErrors = [];
    },
    
    resetForm(source: 'admin' | 'pos' | null = null) {
      this.form = {
        noSo: '',
        noPo: '',
        up: '',
        customerId: null,
        perusahaanId: null,
        cabangId: null,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        discountPercent: 0,
        taxPercent: 0,
        description: '',
        attachment: null,
        status: 'draft',
        paymentMethod: null,
        source: source,
        salesOrderItems: [],
      };
    },

    addItem() {
        if (!this.form.salesOrderItems) {
            this.form.salesOrderItems = [];
        }
        this.form.salesOrderItems.push({
            productId: null,
            warehouseId: null,
            quantity: 1,
            price: 0,
            description: '',
            subtotal: 0,
            stock: { quantity: 0 },
        });
    },

    removeItem(index: number) {
        this.form.salesOrderItems.splice(index, 1);
    },

    setPagination(event: any) {
        this.params.first = event.first;
        this.params.rows = event.rows;
        this.fetchSalesOrders();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchSalesOrders();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchSalesOrders();
    },

    setFilters(filters: { customerId?: number | null, source?: string | null, status?: string | null, search?: string }) {
        this.params.customerId = filters.customerId;
        this.params.source = filters.source;
        this.params.status = filters.status;
        this.params.search = filters.search || '';
        this.params.first = 0; // reset pagination
        this.fetchSalesOrders();
    },

    async getSalesOrderDetails(soId: string) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      
      try {
        const token = localStorage.getItem('token');
        console.log('🔍 Store Debug - Token exists:', !!token);

        const resData = await apiFetch($api.getSalesOrderDetails(soId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        
        console.log('🔍 Store Debug - API Response:', resData);
        
        if (resData && resData.data) {
          this.salesOrder = resData.data;
        } else {
          console.error('❌ Store Debug - Invalid response structure:', resData);
          throw new Error('Struktur data tidak valid diterima dari API getSalesOrderDetails.');
        }
      } catch (e: any) {
        console.error('❌ Store Debug - Error details:', {
          message: e.message,
          status: e.status,
          statusText: e.statusText,
          data: e.data,
          response: e.response
        });
        
        // Try fallback with standard show endpoint
        if (e.status === 404) {
          console.log('🔄 Store Debug - Trying fallback with standard show endpoint');
          try {
            const fallbackUrl = `${$api.salesOrder()}/${soId}`;
            console.log('🔍 Store Debug - Fallback URL:', fallbackUrl);
            
            const fallbackData = await apiFetch(fallbackUrl, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json',
              },
              credentials: 'include',
            });
            
            console.log('🔍 Store Debug - Fallback Response:', fallbackData);
            
            if (fallbackData && fallbackData.data) {
              console.log('✅ Store Debug - Fallback successful, setting salesOrder data:', fallbackData.data);
              this.salesOrder = fallbackData.data;
              return; // Exit successfully
            }
          } catch (fallbackError) {
            console.error('❌ Store Debug - Fallback also failed:', fallbackError);
          }
        }
        
        this.error = e;
        
        // Create more specific error messages
        let errorMessage = 'Gagal mengambil detail sales order';
        
        if (e.status === 404) {
          errorMessage = `Sales Order dengan ID ${soId} tidak ditemukan`;
        } else if (e.status === 401) {
          errorMessage = 'Tidak memiliki akses untuk melihat Sales Order ini';
        } else if (e.status === 403) {
          errorMessage = 'Tidak memiliki izin untuk melihat Sales Order ini';
        } else if (e.status === 500) {
          errorMessage = 'Terjadi kesalahan server, silakan coba lagi';
        } else if (e.message) {
          errorMessage = e.message;
        }
        
        // Throw error with more specific message
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
  }
})
