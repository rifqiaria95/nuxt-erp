import { defineStore, storeToRefs } from 'pinia'
import { apiFetch } from '~/utils/apiFetch'
import Swal from 'sweetalert2'
import { useNuxtApp } from '#app'
import { useUserStore } from '~/stores/user'
import type { Customer } from './customer'


export interface SuratJalanItem {
  id              : string
  suratJalanId    : string
  salesOrderItemId: string
  productId       : number
  warehouseId     : number | null
  description     : string | null
  createdAt       : string
  updatedAt       : string
  product?        : {
    id       : number
    name     : string
    sku      : string
    priceSell: number
    unitId?  : number
    unit?    : {
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

export interface SuratJalan {
  id           : string
  noSuratJalan : string
  picName      : string
  date         : string
  description  : string
  alamatPengiriman: string
  customerId   : number
  salesOrderId?: string
  createdAt    : string
  updatedAt    : string
  customer?    : Customer
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
  suratJalanItems?: SuratJalanItem[]
}

interface SuratJalanState {
  suratJalans         : SuratJalan[]
  suratJalan          : SuratJalan | null
  selectedSuratJalan  : SuratJalan | null
  originalSuratJalan  : SuratJalan | null
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
  }
  form            : any,
  isEditMode      : boolean
  showModal       : boolean
  validationErrors: any[]
}

export const useSuratJalanStore = defineStore('suratJalan', {
  state: (): SuratJalanState => ({
    suratJalans         : [],
    suratJalan          : null,
    selectedSuratJalan  : null,
    originalSuratJalan  : null,
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
    },
    form: {
        noSuratJalan    : '',
        picName         : '',
        date            : '',
        description     : '',
        alamatPengiriman: '',
        customerId      : null,
        salesOrderId    : null,
        suratJalanItems : [],
    },
    isEditMode      : false,
    showModal       : false,
    validationErrors: [],
  }),
  getters: {
  },
  actions: {
    async fetchSuratJalans() {
      const toast     = useToast();
      this.loading = true
      this.error   = null
      const { $api } = useNuxtApp()
        try {
        const token        = localStorage.getItem('token');

        const url = new URL($api.suratJalan())
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

        if (!response.ok) throw new Error('Gagal mengambil data suratJalan')

        const result = await response.json()
        this.suratJalans = result.data
        this.totalRecords = result.meta.total
      } catch (e: any) {
        console.error('Gagal mengambil data suratJalan:', e)
        this.error = e
        toast.error({
          title: 'Error',
          message: `Tidak dapat memuat data Surat Jalan: ${e.message}`,
          color: 'red'
        });
      } finally {
        this.loading = false
      }
    },

    async fetchSuratJalanDetails(suratJalanId: string) {
      const toast     = useToast();
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
      try {
        const token = localStorage.getItem('token');

        const resData = await apiFetch($api.suratJalanShow(suratJalanId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        })
        
        if (resData && resData.data) {
          this.suratJalan = resData.data
        } else {
          throw new Error('Struktur data tidak valid diterima dari API.')
        }
      } catch (error) {
        console.error('Error fetching suratJalan:', error)
        toast.error({
          title: 'Error',
          message: 'Gagal memuat data suratJalan.',
          color: 'red'
        });
      } finally {
        this.loading = false
      }
    },

    async saveSuratJalan() {
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
            formData.append('description', this.form.description || '');
            formData.append('alamatPengiriman', this.form.alamatPengiriman || '');
            formData.append('picName', this.form.picName || '');

            // ✅ ADD: Append sales invoice items to FormData
            if (this.form.suratJalanItems && Array.isArray(this.form.suratJalanItems)) {
                this.form.suratJalanItems.forEach((item: any, i: number) => {
                    if (item.productId && item.quantity > 0) {
                        Object.keys(item).forEach(itemKey => {
                            const value = item[itemKey];
                            if (value !== null && value !== undefined) {
                                formData.append(`suratJalanItems[${i}][${itemKey}]`, value);
                            }
                        });
                    }
                });
            }

            const method = this.isEditMode ? 'PUT' : 'POST';
            const url = this.isEditMode ? `${$api.suratJalan()}/${this.form.id}` : $api.suratJalan();
            
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
                    throw new Error(errorData.message || 'Gagal menyimpan data suratJalan');
                }
            } else {
                this.closeModal();
                await this.fetchSuratJalans();
                toast.success({
                  title: 'Success',
                  message: `Surat Jalan berhasil ${this.isEditMode ? 'diperbarui' : 'dibuat'}.`,
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

    async deleteSuratJalan(id: string) {
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

          const response = await fetch(`${$api.suratJalan()}/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus Surat Jalan');
          }

          await this.fetchSuratJalans();
          toast.success({
            title: 'Success',
            message: 'Surat Jalan berhasil dihapus.',
            color: 'green'
          });
      } catch (error: any) {
          toast.error({
            title: 'Error',
            message: error.message || 'Gagal menghapus Surat Jalan',
            color: 'red'
          });
      } finally {
          this.loading = false;
      }
    },

    async openModal(suratJalanData: SuratJalan | null = null) {
      const toast     = useToast();
      this.isEditMode = !!suratJalanData;
      this.validationErrors = [];

      if (suratJalanData) {
          await this.fetchSuratJalanDetails(suratJalanData.id);
          const fullData = this.suratJalan;

          if (!fullData) {
              toast.error({
                title: 'Error',
                message: 'Tidak dapat memuat data Surat Jalan.',
                color: 'red'
              });
              return;
          }
          this.originalSuratJalan = JSON.parse(JSON.stringify(fullData));
          const formatDate = (dateStr: string | null) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : null;
          
          // Salin data ke form state dan format tanggal dengan benar
          this.form = {
              ...JSON.parse(JSON.stringify(fullData)),
          };

          const dateFields = ['date'];
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
      this.originalSuratJalan = null;
      this.resetForm();
      this.validationErrors = [];
    },
    
    resetForm() {
      this.form = {
        noSuratJalan: '',
        customerId: null,
        picName: '',
        salesOrderId: null,
        date: new Date().toISOString().split('T')[0],
        description: '',
        alamatPengiriman: '',
        suratJalanItems: [],
      };
    },

    setPagination(event: any) {
        this.params.first = event.first;
        this.params.rows = event.rows;
        this.fetchSuratJalans();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchSuratJalans();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchSuratJalans();
    },

    setFilters(filters: { customerId?: number | null, search?: string }) {
        this.params.customerId = filters.customerId;
        this.params.search = filters.search || '';
        this.params.first = 0; // reset pagination
        this.fetchSuratJalans();
    },

    async fetchSuratJalanById(suratJalanId: string) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      
      try {
        const token = localStorage.getItem('token');
        console.log('🔍 Store Debug - fetchSalesInvoiceById - Token exists:', !!token);

        const resData = await apiFetch($api.suratJalanShow(suratJalanId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        
        console.log('🔍 Store Debug - fetchSuratJalanById - API Response:', resData);
        
        if (resData && resData.data) {
          this.selectedSuratJalan = resData.data;
        } else {
          console.error('❌ Store Debug - Invalid response structure:', resData);
          throw new Error('Struktur data tidak valid diterima dari API.');
        }
      } catch (e: any) {
        console.error('❌ Store Debug - fetchSuratJalanById Error details:', {
          message: e.message,
          status: e.status,
          statusText: e.statusText,
          data: e.data,
          response: e.response
        });
        
        this.error = e;
        
        // Create more specific error messages
        let errorMessage = 'Gagal mengambil detail surat jalan';
        
        if (e.status === 404) {
          errorMessage = `Surat Jalan dengan ID ${suratJalanId} tidak ditemukan`;
        } else if (e.status === 401) {
            errorMessage = 'Tidak memiliki akses untuk melihat Surat Jalan ini';
        } else if (e.status === 403) {
          errorMessage = 'Tidak memiliki izin untuk melihat Surat Jalan ini';
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
    async fetchSuratJalanDetailWithItems(suratJalanId: string) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      
      try {
        const token = localStorage.getItem('token');
        console.log('🔍 Store Debug - fetchSuratJalanDetailWithItems - Token exists:', !!token);

        const resData = await apiFetch($api.suratJalanShow(suratJalanId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        
        console.log('🔍 Store Debug - fetchSuratJalanDetailWithItems - API Response:', resData);
        
        if (resData && resData.data) {
          // Set salesInvoice dengan data lengkap termasuk salesInvoiceItems
          this.suratJalan = resData.data;
          return resData.data;
        } else {
          console.error('❌ Store Debug - Invalid response structure:', resData);
          throw new Error('Struktur data tidak valid diterima dari API.');
        }
      } catch (e: any) {
        console.error('❌ Store Debug - fetchSuratJalanDetailWithItems Error details:', {
          message: e.message,
          status: e.status,
          statusText: e.statusText,
          data: e.data,
          response: e.response
        });
        
        this.error = e;
        
        // Create more specific error messages
        let errorMessage = 'Gagal mengambil detail surat jalan';
        
        if (e.status === 404) {
          errorMessage = `Surat Jalan dengan ID ${suratJalanId} tidak ditemukan`;
        } else if (e.status === 401) {
          errorMessage = 'Tidak memiliki akses untuk melihat Surat Jalan ini';
        } else if (e.status === 403) {
          errorMessage = 'Tidak memiliki izin untuk melihat Surat Jalan ini';
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
