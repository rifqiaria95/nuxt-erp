import { defineStore, storeToRefs } from 'pinia'
import { apiFetch } from '~/utils/apiFetch'
import Swal from 'sweetalert2'
import { useNuxtApp } from '#app'
import { useUserStore } from '~/stores/user'
import type { Customer } from './customer'



export interface SalesInvoiceItem {
  id              : string
  salesInvoiceId  : string
  salesOrderItemId: string
  productId       : number
  warehouseId     : number | null
  quantity        : number
  price           : number
  subtotal        : number
  description     : string | null
  deliveredQty    : number
  isReturned      : boolean
  createdAt       : string
  updatedAt       : string
  product?        : {
    id      : number
    name    : string
    sku     : string
    priceSell: number
    unitId? : number
    unit?   : {
      id  : number
      name: string
    }
  }
  warehouse?      : {
    id  : number
    name: string
  }
  salesOrderItem? : {
    id          : string
    quantity    : number
    price       : number
    subtotal    : number
    statusPartial: boolean
    deliveredQty: number
  }
}

export interface SalesInvoice {
  id              : string
  name?           : string
  noInvoice       : string
  date            : string
  dueDate         : string
  status          : string
  paidAmount      : number
  remainingAmount : number
  source?         : string
  total           : number
  discountPercent : number
  taxPercent      : number
  description     : string
  attachment?     : string
  customerId      : number
  salesOrderId?   : string
  createdAt       : string
  updatedAt       : string
  customer?       : Customer
  salesOrder?     : {
    id          : string
    noSo        : string
    status      : string
    date        : string
    dueDate     : string
    up          : string
    description : string
    discountPercent: number
    taxPercent  : number
    total       : number
    customerId  : number
    perusahaanId: number
    cabangId    : number
    customer?   : Customer
    perusahaan? : {
      id             : number
      nmPerusahaan   : string
      alamatPerusahaan: string
      kodePerusahaan : string
      npwpPerusahaan : string
      tlpPerusahaan  : string
      emailPerusahaan: string
      logoPerusahaan : string
    }
    cabang?     : {
      id           : number
      nmCabang     : string
      alamatCabang : string
      perusahaanId : number
    }
    salesOrderItems?: Array<{
      id          : string
      quantity    : number
      price       : number
      subtotal    : number
      statusPartial: boolean
      deliveredQty: number
      product?    : {
        id  : number
        name: string
        sku : string
        priceSell: number
      }
    }>
  }
  salesInvoiceItems?: SalesInvoiceItem[]
}

interface SalesInvoiceState {
  salesInvoices         : SalesInvoice[]
  salesInvoice          : SalesInvoice | null
  selectedSalesInvoice  : SalesInvoice | null
  originalSalesInvoice  : SalesInvoice | null
  loading             : boolean
  error               : any
  totalRecords        : number
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

export const useSalesInvoiceStore = defineStore('salesInvoice', {
  state: (): SalesInvoiceState => ({
    salesInvoices         : [],
    salesInvoice          : null,
    selectedSalesInvoice  : null,
    originalSalesInvoice  : null,
    loading             : true,
    error               : null,
    totalRecords        : 0,
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
        noInvoice       : '',
        date            : '',
        dueDate         : '',
        status          : '',
        paidAmount      : 0,
        remainingAmount : 0,
        source          : '',
        total           : 0,
        dpp             : 0,
        discountPercent : 0,
        taxPercent      : 0,
        description     : '',
        attachment      : null,
        customerId     : null,
        salesOrderId   : null,
        salesInvoiceItems: [],
    },
    isEditMode      : false,
    showModal       : false,
    validationErrors: [],
  }),
  getters: {
  },
  actions: {
    async fetchSalesInvoices() {
      const toast     = useToast();
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
        try {
        const token        = localStorage.getItem('token');

        const url = new URL($api.salesInvoice())
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

        if (!response.ok) throw new Error('Gagal mengambil data salesInvoice')

        const result = await response.json()
        this.salesInvoices = result.data
        this.totalRecords = result.meta.total
      } catch (e: any) {
        console.error('Gagal mengambil data salesInvoice:', e)
        this.error = e
        toast.error({
          title: 'Error',
          message: `Tidak dapat memuat data Sales Invoice: ${e.message}`,
          color: 'red'
        });
      } finally {
        this.loading = false
      }
    },

    async fetchSalesInvoiceDetails(invoiceId: string) {
      const toast     = useToast();
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
      try {
        const token = localStorage.getItem('token');

        const resData = await apiFetch($api.salesInvoiceShow(invoiceId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        })
        
        if (resData && resData.data) {
          this.salesInvoice = resData.data
        } else {
          throw new Error('Struktur data tidak valid diterima dari API.')
        }
      } catch (error) {
        console.error('Error fetching sales invoice:', error)
        toast.error({
          title: 'Error',
          message: 'Gagal memuat data sales invoice.',
          color: 'red'
        });
      } finally {
        this.loading = false
      }
    },

    async saveSalesInvoice() {
      const toast     = useToast();
        this.loading = true;
        this.validationErrors = [];
        const { $api } = useNuxtApp();
        const userStore = useUserStore();

        try {
            const token = localStorage.getItem('token');

            // Prepare FormData for file upload
            const formData = new FormData();
            
            // Add basic fields
            formData.append('customerId', this.form.customerId?.toString() || '');
            formData.append('salesOrderId', this.form.salesOrderId?.toString() || '');
            formData.append('date', this.form.date || '');
            formData.append('dueDate', this.form.dueDate || '');
            formData.append('status', this.form.status || 'unpaid');
            formData.append('paidAmount', this.form.paidAmount?.toString() || '0');
            formData.append('discountPercent', this.form.discountPercent?.toString() || '0');
            formData.append('taxPercent', this.form.taxPercent?.toString() || '0');
            formData.append('dpp', this.form.dpp?.toString() || '0');
            formData.append('description', this.form.description || '');
            formData.append('total', this.form.total?.toString() || '0');
            
            // Calculate grand total (total - discount + tax)
            const total = Number(this.form.total) || 0;
            const discountPercent = Number(this.form.discountPercent) || 0;
            const taxPercent = Number(this.form.taxPercent) || 0;
            
            const discountAmount = total * (discountPercent / 100);
            const totalAfterDiscount = total - discountAmount;
            const taxAmount = totalAfterDiscount * (taxPercent / 100);
            const grandTotal = totalAfterDiscount + taxAmount;
            
            // Calculate remaining amount based on grand total
            const paidAmount = Number(this.form.paidAmount) || 0;
            const remainingAmount = grandTotal - paidAmount;
            
            // Send grand total as the final total
            formData.set('total', grandTotal.toString());
            formData.append('remainingAmount', remainingAmount.toString());

            // ✅ ADD: Append sales invoice items to FormData
            if (this.form.salesInvoiceItems && Array.isArray(this.form.salesInvoiceItems)) {
                this.form.salesInvoiceItems.forEach((item: any, i: number) => {
                    if (item.productId && item.quantity > 0) {
                        Object.keys(item).forEach(itemKey => {
                            const value = item[itemKey];
                            if (value !== null && value !== undefined) {
                                formData.append(`salesInvoiceItems[${i}][${itemKey}]`, value);
                            }
                        });
                    }
                });
            }

            const method = this.isEditMode ? 'PUT' : 'POST';
            const url = this.isEditMode ? `${$api.salesInvoice()}/${this.form.id}` : $api.salesInvoice();
            
            // Send data to API
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
                      message: errorData.errors.map((e: any) => e.message).join('<br>'),
                      color: 'red'
                    });
                } else {
                    throw new Error(errorData.message || 'Gagal menyimpan data salesInvoice');
                }
            } else {
                this.closeModal();
                await this.fetchSalesInvoices();
                toast.success({
                  title: 'Success',
                  message: `Sales Invoice berhasil ${this.isEditMode ? 'diperbarui' : 'dibuat'}.`,
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

    async deleteSalesInvoice(id: string) {
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

          const response = await fetch(`${$api.salesInvoice()}/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus Sales Invoice');
          }

          await this.fetchSalesInvoices();
          toast.success({
            title: 'Success',
            message: 'Sales Invoice berhasil dihapus.',
            color: 'green'
          });
      } catch (error: any) {
          toast.error({
            title: 'Error',
            message: error.message || 'Gagal menghapus Sales Invoice',
            color: 'red'
          });
      } finally {
          this.loading = false;
      }
    },

    async openModal(salesInvoiceData: SalesInvoice | null = null) {
      const toast     = useToast();
      this.isEditMode = !!salesInvoiceData;
      this.validationErrors = [];

      if (salesInvoiceData) {
          await this.fetchSalesInvoiceDetails(salesInvoiceData.id);
          const fullData = this.salesInvoice;

          if (!fullData) {
              toast.error({
                title: 'Error',
                message: 'Tidak dapat memuat data Sales Invoice.',
                color: 'red'
              });
              return;
          }
          this.originalSalesInvoice = JSON.parse(JSON.stringify(fullData));
          const formatDate = (dateStr: string | null) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : null;
          
          // Salin data ke form state dan format tanggal dengan benar
          this.form = {
              ...JSON.parse(JSON.stringify(fullData)),
              attachment: null, // Reset attachment, akan ditangani secara terpisah
          };

          const dateFields = ['date', 'dueDate'];
          dateFields.forEach(field => {
              if (this.form[field]) {
                  this.form[field] = formatDate(this.form[field]);
              }
          });
      } else {
          this.resetForm();
      }
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.isEditMode = false;
      this.originalSalesInvoice = null;
      this.resetForm();
      this.validationErrors = [];
    },
    
    resetForm() {
      this.form = {
        noInvoice: '',
        customerId: null,
        salesOrderId: null,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        discountPercent: 0,
        taxPercent: 0,
        total: 0,
        dpp: 0,
        description: '',
        attachment: null,
        status: 'unpaid',
        paidAmount: 0,
        remainingAmount: 0,
        salesInvoiceItems: [],
      };
    },

    setPagination(event: any) {
        this.params.first = event.first;
        this.params.rows = event.rows;
        this.fetchSalesInvoices();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchSalesInvoices();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchSalesInvoices();
    },

    setFilters(filters: { customerId?: number | null, source?: string | null, status?: string | null, search?: string }) {
        this.params.customerId = filters.customerId;
        this.params.source = filters.source;
        this.params.status = filters.status;
        this.params.search = filters.search || '';
        this.params.first = 0; // reset pagination
        this.fetchSalesInvoices();
    },

    async fetchSalesInvoiceById(invoiceId: string) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      
      try {
        const token = localStorage.getItem('token');

        const resData = await apiFetch($api.salesInvoiceShow(invoiceId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        
        
        if (resData && resData.data) {
          this.selectedSalesInvoice = resData.data;
        } else {
          console.error('❌ Store Debug - Invalid response structure:', resData);
          throw new Error('Struktur data tidak valid diterima dari API.');
        }
      } catch (e: any) {
        console.error('❌ Store Debug - fetchSalesInvoiceById Error details:', {
          message: e.message,
          status: e.status,
          statusText: e.statusText,
          data: e.data,
          response: e.response
        });
        
        this.error = e;
        
        // Create more specific error messages
        let errorMessage = 'Gagal mengambil detail sales invoice';
        
        if (e.status === 404) {
          errorMessage = `Sales Invoice dengan ID ${invoiceId} tidak ditemukan`;
        } else if (e.status === 401) {
          errorMessage = 'Tidak memiliki akses untuk melihat Sales Invoice ini';
        } else if (e.status === 403) {
          errorMessage = 'Tidak memiliki izin untuk melihat Sales Invoice ini';
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

    // ✅ NEW: Fetch invoice detail dengan salesInvoiceItems untuk detail page
    async fetchInvoiceDetailWithItems(invoiceId: string) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      
      try {
        const token = localStorage.getItem('token');

        const resData = await apiFetch($api.salesInvoiceShow(invoiceId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        
        
        if (resData && resData.data) {
          // Set salesInvoice dengan data lengkap termasuk salesInvoiceItems
          this.salesInvoice = resData.data;
          return resData.data;
        } else {
          console.error('❌ Store Debug - Invalid response structure:', resData);
          throw new Error('Struktur data tidak valid diterima dari API.');
        }
      } catch (e: any) {
        console.error('❌ Store Debug - fetchInvoiceDetailWithItems Error details:', {
          message: e.message,
          status: e.status,
          statusText: e.statusText,
          data: e.data,
          response: e.response
        });
        
        this.error = e;
        
        // Create more specific error messages
        let errorMessage = 'Gagal mengambil detail sales invoice';
        
        if (e.status === 404) {
          errorMessage = `Sales Invoice dengan ID ${invoiceId} tidak ditemukan`;
        } else if (e.status === 401) {
          errorMessage = 'Tidak memiliki akses untuk melihat Sales Invoice ini';
        } else if (e.status === 403) {
          errorMessage = 'Tidak memiliki izin untuk melihat Sales Invoice ini';
        } else if (e.status === 500) {
          errorMessage = 'Terjadi kesalahan server, silakan coba lagi';
        } else if (e.message) {
          errorMessage = e.message;
        }
        
        // Throw error dengan specific message
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
  }
})
