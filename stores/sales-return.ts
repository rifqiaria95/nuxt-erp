import { defineStore, storeToRefs } from 'pinia'
import { apiFetch } from '~/utils/apiFetch'
import Swal from 'sweetalert2'
import { useNuxtApp } from '#app'
import { useUserStore } from '~/stores/user'
import { useSalesOrderStore } from '~/stores/sales-order'
import type { Customer } from './customer'
import type { User } from './userManagement'
import type { Perusahaan } from './perusahaan'
import type { Cabang } from './cabang'
import type { Product } from './product'
import type { SalesOrder } from './sales-order'

export interface SalesReturnItem {
  id               : string
  salesReturnId    : string
  salesOrderItemId? : string
  productId        : number
  quantity         : number
  price            : number
  description      : string
  totalReturnAmount: number
  createdAt        : string
  updatedAt        : string
  product?         : Product
}

export interface SalesReturn {
  id               : string
  name?            : string
  noSo             : string
  noSr             : string
  up               : string
  reason           : string
  customerId       : number
  perusahaanId     : number
  cabangId         : number
  returnDate       : string
  status           : string
  totalReturnAmount: string
  discountPercent  : string
  taxPercent       : string
  description      : string
  attachment?      : string
  createdAt        : string
  updatedAt        : string
  createdBy        : number
  approvedBy       : number | null
  deliveredBy      : number | null
  rejectedBy       : number | null
  approvedAt       : string | null
  deliveredAt      : string | null
  rejectedAt       : string | null
  customer?        : Customer
  perusahaan?      : Perusahaan
  cabang?          : Cabang
  createdByUser?   : User
  approvedByUser?  : User
  deliveredByUser? : User
  salesReturnItems?: SalesReturnItem[]
  salesOrder?      : SalesOrder
}

interface SalesReturnState {
  salesReturns       : SalesReturn[]
  salesReturn        : SalesReturn | null
  originalSalesReturn: SalesReturn | null
  salesOrders        : SalesOrder[]
  loading           : boolean
  error             : any
  totalRecords      : number
  params: {
    first        : number
    rows         : number
    sortField    : string | null
    sortOrder    : number | null
    draw         : number
    search       : string
    customerId?  : number | null
    perusahaanId?: number | null
    status?      : string | null
  }
  form            : any,
  isEditMode      : boolean
  showModal       : boolean
  validationErrors: any[]
}

export const useSalesReturnStore = defineStore('salesReturn', {
  state: (): SalesReturnState => ({
    salesReturns       : [],
    salesReturn        : null,
    originalSalesReturn: null,
    salesOrders        : [],
    loading           : true,
    error             : null,
    totalRecords      : 0,
    params: {
        first     : 0,
        rows      : 10,
        sortField : 'createdAt',
        sortOrder : -1,
        draw      : 1,
        search    : '',
        customerId: null,
        perusahaanId: null,
        status    : null,
    },
    form: {
        noSo           : '',
        noSr           : '',
        up             : '',
        customerId     : null,
        perusahaanId   : null,
        cabangId       : null,
        salesOrderId   : null,
        reason         : '',
        returnDate     : new Date().toISOString().split('T')[0],
        description    : '',
        attachment     : null,
        status         : 'draft',
        totalReturnAmount          : 0,
        salesReturnItems: []
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
      const customerSpecificProducts = state.salesOrders || []
      
      // Combine and deduplicate products based on ID
      const allProductsMap = new Map()
      generalProducts.forEach(p => allProductsMap.set(p.id, p))
      customerSpecificProducts.forEach(p => allProductsMap.set(p.id, p))
      
      return Array.from(allProductsMap.values())
    }
  },
  actions: {
    async fetchSalesReturns() {
      const toast     = useToast();
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
      try {
        const token        = localStorage.getItem('token');


        const url = new URL($api.salesReturn())
        const params = new URLSearchParams({
            page     : Math.floor((this.params.first / this.params.rows) + 1).toString(),
            rows     : Math.floor(this.params.rows).toString(),
            sortField: this.params.sortField || '',
            sortOrder: this.params.sortOrder?.toString() || '',
            draw     : this.params.draw.toString(),
            search   : this.params.search || '',
        });

        if (this.params.customerId) {
          params.append('customerId', this.params.customerId.toString());
        }
        if (this.params.status) {
          params.append('status', this.params.status);
        }
        if (this.params.perusahaanId) {
          params.append('perusahaanId', this.params.perusahaanId.toString());
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

        if (!response.ok) throw new Error('Gagal mengambil data salesReturn')

        const result = await response.json()
        this.salesReturns = result.data
        this.totalRecords = result.meta.total
      } catch (e: any) {
        console.error('Gagal mengambil data salesReturn:', e)
        this.error = e
        toast.error({
          title: 'Error',
          message: `Tidak dapat memuat data Sales Return: ${e.message}`,
          color: 'red'
        });
      } finally {
        this.loading = false
      }
    },

    async fetchSalesOrdersByCustomer(customerId: number) {
      const toast     = useToast();
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
      if (!customerId) {
        this.salesOrders = []
        return
      }
      try {
        const token = localStorage.getItem('token');

        const response = await fetch($api.getSalesOrderForSalesReturn(customerId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        })
        if (!response.ok) throw new Error('Gagal mengambil data sales order untuk customer')
        const result = await response.json()
        this.salesOrders = result.data || []
      } catch (error) {
        console.error('Error fetching sales order for customer:', error)
        this.salesOrders = [] 
        toast.error({
          title: 'Error',
          message: 'Gagal memuat sales order untuk customer yang dipilih.',
          color: 'red'
        });
      } finally {
        this.loading = false
      }
    },

    populateFormFromSalesOrder(salesOrderId: string) {
      const selectedSO = this.salesOrders.find(so => so.id === salesOrderId);
      if (selectedSO) {
        this.form.salesOrderId      = selectedSO.id;
        this.form.noSo              = selectedSO.noSo;
        this.form.customerId        = selectedSO.customerId;
        this.form.perusahaanId      = selectedSO.perusahaanId;
        this.form.cabangId          = selectedSO.cabangId;
        this.form.up                = selectedSO.up;
        this.form.totalReturnAmount = selectedSO.total;
        this.form.status            = 'draft';

        // Populate items - HANYA YANG STATUS_PARTIAL = TRUE
        this.form.salesReturnItems = selectedSO.salesOrderItems
          ?.filter(item => item.statusPartial === true)
          ?.map(item => ({
          salesOrderItemId: item.id,
          productId  : item.productId,
          warehouseId: item.warehouseId,
          quantity   : item.quantity,
          price      : item.price,
          description: item.description,
          subtotal   : item.subtotal,
          stock      : { quantity: 0 },
        })) || [];
      }
    },

    async saveSalesReturn() {
        const toast     = useToast();
        this.loading = true;
        this.validationErrors = [];
        const { $api } = useNuxtApp();
        const userStore = useUserStore();

        try {
            const token        = localStorage.getItem('token');

            const formData = new FormData()

            // Append main form data
            const dataToAppend = { ...this.form };
            // Hapus data relasi dan data yang tidak perlu dikirim
            delete dataToAppend.salesReturnItems;
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
            this.form.salesReturnItems.forEach((item: any, i: number) => {
                if (item.productId && item.quantity > 0) {
                    Object.keys(item).forEach(itemKey => {
                        const value = item[itemKey];
                        if (value !== null && value !== undefined) {
                           formData.append(`salesReturnItems[${i}][${itemKey}]`, value);
                        }
                    });
                }
            });

            const method = this.isEditMode ? 'POST' : 'POST';
            const url = this.isEditMode ? `${$api.salesReturn()}/${this.form.id}` : $api.salesReturn();
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
                      message: errorData.message || 'Terdapat kesalahan validasi data',
                      color: 'red'
                    });
                } else {
                    throw new Error(errorData.message || 'Gagal menyimpan data salesReturn');
                }
            } else {
                this.closeModal();
                await this.fetchSalesReturns();
                toast.success({
                  title: 'Success',
                  message: `Sales Return berhasil ${this.isEditMode ? 'diperbarui' : 'dibuat'}.`,
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

    async deleteSalesReturn(id: string) {
      const toast     = useToast();
      this.loading = true;
      const { $api } = useNuxtApp();

      const result = await Swal.fire({
          title             : 'Apakah Anda yakin?',
          text              : "Data yang dihapus tidak dapat dikembalikan!",
          icon              : 'warning',
          showCancelButton  : true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor : '#d33',
          confirmButtonText : 'Ya, hapus!',
          cancelButtonText  : 'Batal'
      });

      if (!result.isConfirmed) {
          this.loading = false;
          return;
      }

      try {
          const token = localStorage.getItem('token');

          const response = await fetch(`${$api.salesReturn()}/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus Sales Return');
          }

          await this.fetchSalesReturns();
          toast.success({
            title: 'Success',
            message: 'Sales Return berhasil dihapus.',
            color: 'green'
          });
      } catch (error: any) {
          toast.error({
            title: 'Error',
            message: error.message || 'Gagal menghapus Sales Return',
            color: 'red'
          });
      } finally {
          this.loading = false;
      }
    },
    
    async approveSalesReturn(salesReturnId: string) {
      const toast     = useToast();
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
          const token = localStorage.getItem('token');

          const response = await fetch($api.approveSalesReturn(salesReturnId), {
              method: 'PATCH',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type' : 'application/json',
                  'Accept'       : 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Gagal mengapprove sales return' }));
              throw new Error(errorData.message || 'Gagal mengapprove sales return');
          }

          await this.fetchSalesReturns();
          toast.success({
            title: 'Success',
            message: 'Sales Return berhasil diapprove.',
            color: 'green'
          });

          return true;
      } catch (error: any) {
          console.error('Error approving sales return:', error);
          toast.error({
            title: 'Error',
            message: error.message || 'Gagal mengapprove sales return.',
            color: 'red'
          });
          return false;
      } finally {
          this.loading = false;
      }
    },

    async rejectSalesReturn(salesReturnId: string) {
      const toast     = useToast();
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
          const token = localStorage.getItem('token');

          const response = await fetch($api.rejectSalesReturn(salesReturnId), {
              method: 'PATCH',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type' : 'application/json',
                  'Accept'       : 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Gagal mereject sales return' }));
              throw new Error(errorData.message || 'Gagal mereject sales return');
          }

          await this.fetchSalesReturns();
          toast.success({
            title: 'Success',
            message: 'Sales Return berhasil direject.',
            color: 'green'
          });

          return true;
      } catch (error: any) {
          console.error('Error rejecting sales return:', error);
          toast.error({
            title: 'Error',
            message: error.message || 'Gagal mereject sales return.',
            color: 'red'
          });
          return false;
      } finally {
          this.loading = false;
      }
    },

    async openModal(salesReturnData: SalesReturn | null = null) {
      const toast     = useToast();
      this.isEditMode = !!salesReturnData;
      this.validationErrors = [];

      if (salesReturnData) {
          await this.getSalesReturnDetails(salesReturnData.id);
          const fullData = this.salesReturn;

          if (!fullData) {
              toast.error({
                title: 'Error',
                message: 'Tidak dapat memuat data Sales Return.',
                color: 'red'
              });
              return;
          }
          this.originalSalesReturn = JSON.parse(JSON.stringify(fullData));
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

          // Wait for products to be fetched before showing modal
          if (this.form.customerId) {
              await this.fetchSalesOrdersByCustomer(this.form.customerId);
          }

          // Pastikan salesReturnItems ada dan tambahkan stock jika belum ada
          if (this.form.salesReturnItems && this.form.salesReturnItems.length > 0) {
            this.form.salesReturnItems.forEach((item: any) => {
              if (!item.stock) {
                item.stock = { quantity: 0 };
              }
            });
          } else {
            this.form.salesReturnItems = [];
            this.addItem();
          }
      } else {  
          this.resetForm()
          this.addItem(); // Tambahkan satu item default untuk SO baru
      }
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.isEditMode = false;
      this.originalSalesReturn = null;
      this.resetForm();
      this.validationErrors = [];
    },
    
    resetForm() {
      this.form = {
        noSr             : '',
        noSo             : '',
        up               : '',
        customerId       : null,
        salesOrderId     : null,
        perusahaanId     : null,
        cabangId         : null,
        reason           : '',
        returnDate       : new Date().toISOString().split('T')[0],
        description      : '',
        attachment       : null,
        status           : 'draft',
        totalReturnAmount: 0,
        salesReturnItems : [],
      };
    },

    addItem() {
        if (!this.form.salesReturnItems) {
            this.form.salesReturnItems = [];
        }
        this.form.salesReturnItems.push({
            productId: null,
            warehouseId: null,
            quantity: 1,
            price: 0,
            description: '',
            stock: { quantity: 0 },
        });
    },

    removeItem(index: number) {
        this.form.salesReturnItems.splice(index, 1);
    },

    setPagination(event: any) {
        this.params.first = Number(event.first) || 0;
        this.params.rows = Number(event.rows) || 10;
        this.fetchSalesReturns();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchSalesReturns();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchSalesReturns();
    },

    setFilters(filters: { customerId?: number | null, perusahaanId?: number | null, status?: string | null, search?: string }) {
        this.params.customerId = filters.customerId;
        this.params.perusahaanId = filters.perusahaanId;
        this.params.status = filters.status;
        this.params.search = filters.search || '';
        this.params.first = 0; // reset pagination
        this.fetchSalesReturns();
    },

    async getSalesReturnDetails(srId: string) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
        const token        = localStorage.getItem('token');

        const resData = await apiFetch($api.getSalesReturnDetails(srId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        if (resData && resData.data) {
          this.salesReturn = resData.data;
        } else {
          throw new Error('Struktur data tidak valid diterima dari API getSalesReturnDetails.');
        }
      } catch (e) {
        console.error('Gagal mengambil detail sales return:', e);
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
  }
})
