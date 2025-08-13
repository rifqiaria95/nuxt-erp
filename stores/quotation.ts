import { defineStore } from 'pinia'
import { apiFetch } from '~/utils/apiFetch'
import Swal from 'sweetalert2'
import { useNuxtApp } from '#app'
import { useUserStore } from '~/stores/user'
import type { User } from './userManagement'
import type { Perusahaan } from './perusahaan'
import type { Cabang } from './cabang'
import type { Product } from './product'
import type { Customer } from './customer'

export interface QuotationItem {
  id             : string
  quotationId    : string
  productId      : number
  quantity       : number
  price          : number
  description    : string
  subtotal       : number
  createdAt      : string
  updatedAt      : string
  product?       : Product
}

export interface Quotation {
  id                 : string
  name?              : string
  noQuotation        : string
  up                 : string
  customerId         : number
  perusahaanId       : number
  cabangId           : number
  date               : string
  validUntil         : string
  shipDate           : string
  fobPoint           : string
  termsOfPayment     : string
  prNumber           : string
  status             : string
  total              : string
  discountPercent    : string
  taxPercent         : string
  description        : string
  createdAt          : string
  updatedAt          : string
  createdBy          : number
  approvedBy         : number | null
  rejectedBy         : number | null
  approvedAt         : string | null
  rejectedAt         : string | null
  customer?            : Customer
  perusahaan?        : Perusahaan
  cabang?            : Cabang
  createdByUser?     : User
  approvedByUser?    : User
  quotationItems?: QuotationItem[]
}

interface QuotationState {
  quotations  : Quotation[]
  quotation   : Quotation | null
  loading     : boolean
  error       : any
  totalRecords: number
  params      : {
    first      : number
    rows       : number
    sortField  : string | null
    sortOrder  : number | null
    draw       : number
    search     : string
    customerId?: number | null
    status?    : string | null
  }
  form            : any,
  isEditMode      : boolean
  showModal       : boolean
  validationErrors: any[]
}

export const useQuotationStore = defineStore('quotation', {
  state: (): QuotationState => ({
    quotations: [],
    quotation : null,
    loading       : true,
    error         : null,
    totalRecords  : 0,
    params        : {
        first    : 0,
        rows     : 10,
        sortField: 'id',
        sortOrder: 1,
        draw     : 1,
        search   : '',
        customerId : null,
        status   : null,
    },
    form: {
        noQuotation: '',
        up: '',
        customerId: null,
        perusahaanId: null,
        cabangId: null,
        date: new Date().toISOString().split('T')[0], 
        validUntil: new Date().toISOString().split('T')[0], 
        shipDate: new Date().toISOString().split('T')[0], 
        fobPoint: '',
        termsOfPayment: '',
        prNumber: '',
        discountPercent: 0, 
        taxPercent: 0, 
        description: '',
        status: 'draft',
        quotationItems: []
    },
    isEditMode      : false,
    showModal       : false,
    validationErrors: [],
  }),
  actions: {
    async fetchQuotations() {
      const toast     = useToast();
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
      try {
        const token = localStorage.getItem('token');
        const url = new URL($api.quotation())
        const params = new URLSearchParams({
            page     : Math.floor((this.params.first / this.params.rows) + 1).toString(),
            rows     : Math.floor(this.params.rows).toString(),
            sortField: this.params.sortField || '',
            sortOrder: this.params.sortOrder?.toString() || '',
            draw     : this.params.draw.toString(),
            search   : this.params.search || '',
            includeItems: 'true', // Include quotationItems with product relation
        });

        if (this.params.customerId) {
            params.append('customerId', this.params.customerId.toString());
          }
          if (this.params.status) {
            params.append('status', this.params.status);
          }

        url.search = params.toString();

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        if (!response.ok) throw new Error('Gagal mengambil data quotation')

        const result = await response.json()
        
        console.log('📊 Quotation API Response:', result);
        this.quotations = result.data
        this.totalRecords = result.meta.total
        console.log('📋 Quotations in store:', this.quotations);
      } catch (e: any) {
        console.error('Gagal mengambil data quotation:', e)
        this.error = e
        toast.error({
          title: 'Error',
          message: `Tidak dapat memuat data Quotation: ${e.message}`,
          color: 'red',
          position: 'topRight',
          layout: 2,
        });
      } finally {
        this.loading = false
      }
    },

    async saveQuotation() {
      const toast     = useToast();
        this.loading = true;
        this.validationErrors = [];
        const { $api } = useNuxtApp();
        const userStore = useUserStore();

        try {
            const token        = localStorage.getItem('token');

            const formData = new FormData()

            const dataToAppend = { ...this.form };
            delete dataToAppend.quotationItems;
            delete dataToAppend.customer;
            delete dataToAppend.perusahaan;
            delete dataToAppend.cabang;
            delete dataToAppend.createdByUser;
            delete dataToAppend.approvedByUser;
            delete dataToAppend.receivedByUser;
            delete dataToAppend.rejectedByUser;
            
            // Untuk create, hapus noQuotation karena di-generate di backend
            if (!this.isEditMode) {
                delete dataToAppend.noQuotation;
            }

            // Validasi frontend sebelum kirim
            if (!dataToAppend.customerId) {
                throw new Error('Customer harus dipilih');
            }
            if (!dataToAppend.up || dataToAppend.up.trim() === '') {
                throw new Error('Untuk Perhatian harus diisi');
            }
            if (!dataToAppend.date) {
                throw new Error('Tanggal Quotation harus diisi');
            }
            if (!dataToAppend.status) {
                throw new Error('Status harus dipilih');
            }

            Object.keys(dataToAppend).forEach(key => {
                const value = dataToAppend[key];
                if (value !== null && value !== undefined && value !== '') {
                    formData.append(key, value);
                }
            });

            if (!this.isEditMode && userStore.user && userStore.user.id) {
                formData.append('createdBy', userStore.user.id.toString())
                if(this.form.status === 'approved') {
                    formData.append('approvedBy', userStore.user.id.toString())
                }
                if(this.form.status === 'rejected') {
                    formData.append('rejectedBy', userStore.user.id.toString())
                }
            }
            // Validasi items
            if (!this.form.quotationItems || this.form.quotationItems.length === 0) {
                throw new Error('Minimal harus ada 1 item produk');
            }

            // Validasi setiap item
            const validItems = this.form.quotationItems.filter((item: any) => 
                item.productId && item.quantity && item.quantity > 0 && item.price && item.price > 0
            );
            
            if (validItems.length === 0) {
                throw new Error('Minimal harus ada 1 item produk yang valid (produk, quantity > 0, harga > 0)');
            }

            // Append hanya items yang valid
            validItems.forEach((item: any, i: number) => {
                Object.keys(item).forEach(itemKey => {
                    const value = item[itemKey];
                    if (value !== null && value !== undefined) {
                       formData.append(`quotationItems[${i}][${itemKey}]`, value);
                    }
                });
            });

            const method = 'POST';
            const url = this.isEditMode ? `${$api.quotation()}/${this.form.id}` : $api.quotation();
            
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
                console.error('Server Error Response:', errorData);
                if (response.status === 422) {
                    this.validationErrors = errorData.errors;
                     toast.error({
                      title: 'Error',
                      message: errorData.errors.map((e: any) => e.message).join('<br>'),
                      color: 'red',
                      position: 'topRight',
                      layout: 2,
                    });
                } else {
                    // Tampilkan detail error jika ada
                    let errorMessage = errorData.message || 'Gagal menyimpan data quotation';
                    if (errorData.error) {
                        errorMessage += `\nDetail: ${errorData.error.message}`;
                        if (errorData.error.constraint) {
                            errorMessage += `\nConstraint: ${errorData.error.constraint}`;
                        }
                    }
                    throw new Error(errorMessage);
                }
            } else {
                this.closeModal();
                await this.fetchQuotations();
                toast.success({
                  title: 'Success',
                  message: `Quotation berhasil ${this.isEditMode ? 'diperbarui' : 'dibuat'}.`,
                  color: 'green',
                  position: 'topRight',
                  layout: 2,
                });
            }


        } catch (error: any) {
            // Clear validation errors on new general error
            this.validationErrors = [];
            console.error('Save Quotation Error:', error);
            toast.error({
              title: 'Error',
              message: error.message || 'Operasi gagal',
              color: 'red',
              position: 'topRight',
              layout: 2,
            });
        } finally {
            this.loading = false;
        }
    },

    async deleteQuotation(id: string) {
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
  
            const response = await fetch(`${$api.quotation()}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
  
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus Quotation');
            }
  
            await this.fetchQuotations();
            toast.success({
              title   : 'Success',
              message : 'Quotation berhasil dihapus.',
              color   : 'green',
              position: 'topRight',
              layout  : 2,
            });
        } catch (error: any) {
            toast.error({
              title   : 'Error',
              message : error.message || 'Gagal menghapus Quotation',
              color   : 'red',
              position: 'topRight',
              layout  : 2,
            });
        } finally {
            this.loading = false;
        }
      },
    
    async approveQuotation(quotationId: string) {
      const toast     = useToast();
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
          const token = localStorage.getItem('token');

          const response = await fetch($api.approveQuotation(quotationId), {
              method: 'PATCH',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type' : 'application/json',
                  'Accept'       : 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Gagal mengapprove quotation' }));
              throw new Error(errorData.message || 'Gagal mengapprove quotation');
          }

          await this.fetchQuotations();
          toast.success({
            title: 'Success',
            message: 'Quotation berhasil diapprove.',
            color: 'green',
            position: 'topRight',
            layout: 2,
          });
          return true;
      } catch (error: any) {
          console.error('Error approving quotation:', error);
          toast.error({
            title: 'Error',
            message: error.message || 'Gagal mengapprove quotation.',
            color: 'red',
            position: 'topRight',
            layout: 2,
          });
          return false;
      } finally {
          this.loading = false;
      }
    },

    async rejectQuotation(quotationId: string) {
      const toast     = useToast();
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
          const token = localStorage.getItem('token');

          const response = await fetch($api.rejectQuotation(quotationId), {
              method: 'PATCH',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type' : 'application/json',
                  'Accept'       : 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Gagal mereject quotation' }));
              throw new Error(errorData.message || 'Gagal mereject quotation');
          }

          await this.fetchQuotations();
          toast.success({
            title: 'Success',
            message: 'Quotation berhasil direject.',
            color: 'green',
            position: 'topRight',
            layout: 2,
          });

          return true;
      } catch (error: any) {
          console.error('Error rejecting quotation:', error);
          toast.error({
            title: 'Error',
            message: error.message || 'Gagal mereject quotation.',
            color: 'red',
            position: 'topRight',
            layout: 2,
          });
          return false;
      } finally {
          this.loading = false;
      }
    },

    openModal(quotationData: Quotation | null = null) {
        this.isEditMode = !!quotationData;
        this.validationErrors = [];

        if (quotationData) {
            const formatDate = (dateStr: string | null) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : null;
            
            // Salin data dan format tanggal dengan benar
            const formData: { [key: string]: any } = {
                ...JSON.parse(JSON.stringify(quotationData)),
            };

            const dateFields = ['date', 'validUntil', 'approvedAt', 'rejectedAt', 'shipDate'];
            dateFields.forEach(field => {
                if (formData[field]) {
                    formData[field] = formatDate(formData[field]);
                }
            });

            this.form = formData;

            // Pastikan quotationItems ada
            if (!this.form.quotationItems || this.form.quotationItems.length === 0) {
                this.form.quotationItems = [];
                this.addItem();
            }
        } else {
            this.form = {
                noQuotation: '',
                up: '',
                customerId: null,
                perusahaanId: null,
                cabangId: null,
                date: new Date().toISOString().split('T')[0], 
                validUntil: new Date().toISOString().split('T')[0], 
                shipDate: new Date().toISOString().split('T')[0], 
                fobPoint: '',
                termsOfPayment: '',
                prNumber: '',
                discountPercent: 0, 
                taxPercent: 0, 
                description: '',
                status: 'draft',
                quotationItems: [],
            };
            this.addItem(); // Tambahkan satu item default untuk PO baru
        }
        this.showModal = true;
    },

    closeModal() {
        this.showModal = false;
        this.isEditMode = false;
        this.form = {
            noQuotation: '',
            up: '',
            customerId: null,
            perusahaanId: null,
            cabangId: null,
            date: new Date().toISOString().split('T')[0], 
            validUntil: new Date().toISOString().split('T')[0], 
            shipDate: new Date().toISOString().split('T')[0], 
            fobPoint: '',
            termsOfPayment: '',
            prNumber: '',
            discountPercent: 0, 
            taxPercent: 0, 
            description: '',
            status: 'draft',
            quotationItems: [],
        };
        this.validationErrors = [];
    },

    addItem() {
        this.form.quotationItems.push({
            productId: null, quantity: 1, price: 0,
            description: '', subtotal: 0,
        });
    },

    removeItem(index: number) {
        this.form.quotationItems.splice(index, 1);
    },

    setPagination(event: any) {
        this.params.first = Number(event.first) || 0;
        this.params.rows = Number(event.rows) || 10;
        this.fetchQuotations();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchQuotations();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchQuotations();
    },

    setFilters(filters: { customerId?: number | null, status?: string | null, search?: string }) {
        this.params.customerId = filters.customerId;
        this.params.status = filters.status;
        this.params.search = filters.search || '';
        this.params.first = 0; // reset pagination
        this.fetchQuotations();
    },

    async getQuotationDetails(quotationId: string) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      
      try {
        const token        = localStorage.getItem('token');

        const resData = await apiFetch($api.getQuotationDetails(quotationId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        
        if (resData && resData.data) {
          this.quotation = resData.data;
        } else {
          console.error('Invalid data structure received:', resData);
          throw new Error('Struktur data tidak valid diterima dari API getQuotationDetails.');
        }
      } catch (e: any) {
        console.error('Error in getQuotationDetails:', e);
        console.error('Error details:', {
          message: e.message,
          status: e.status,
          statusText: e.statusText,
          data: e.data
        });
        this.error = e;
      } finally {
        this.loading = false;
      }
    },

    async fetchQuotationForEdit(quotationId: string) {
      const toast     = useToast();
        this.loading = true;
        this.error = null;
        const { $api } = useNuxtApp();
        
        try {
            const token = localStorage.getItem('token');

            const resData = await apiFetch($api.getQuotationDetails(quotationId), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
            
            if (resData && resData.data) {
                
                // Panggil openModal dengan data lengkap
                this.openModal(resData.data);
            } else {
                console.error('Invalid data structure received:', resData);
                throw new Error('Data tidak valid diterima dari API.');
            }
        } catch (e: any) {
            console.error('Error in fetchQuotationForEdit:', e);
            this.error = e;
            toast.error({
              title: 'Error',
              message: 'Gagal mengambil data quotation untuk edit',
              color: 'red',
              position: 'topRight',
              layout: 2,
            });
        } finally {
            this.loading = false;
        }
    },
  }
})
