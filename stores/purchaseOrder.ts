import { defineStore } from 'pinia'
import { apiFetch } from '~/utils/apiFetch'
import Swal from 'sweetalert2'
import { useNuxtApp } from '#app'
import { useUserStore } from '~/stores/user'
import type { Vendor } from './vendor'
import type { User } from './userManagement'
import type { Perusahaan } from './perusahaan'
import type { Cabang } from './cabang'
import type { Product } from './product'

export interface PurchaseOrderItem {
  id             : string
  purchaseOrderId: string
  productId      : number
  quantity       : number
  price          : number
  description    : string
  subtotal       : number
  statusPartial : boolean
  receivedQty   : string
  createdAt      : string
  updatedAt      : string
  product?       : Product
}

export interface PurchaseOrder {
  id                 : string
  name?              : string
  noPo               : string
  up                 : string
  extNamaPerusahaan  : string
  vendorId           : number
  perusahaanId       : number
  cabangId           : number
  date               : string
  dueDate            : string
  status             : string
  poType             : string
  total              : string
  discountPercent    : string
  taxPercent         : string
  description        : string
  attachment?        : string
  createdAt          : string
  updatedAt          : string
  createdBy          : number
  approvedBy         : number | null
  receivedBy         : number | null
  rejectedBy         : number | null
  approvedAt         : string | null
  receivedAt         : string | null
  rejectedAt         : string | null
  vendor?            : Vendor
  perusahaan?        : Perusahaan
  cabang?            : Cabang
  createdByUser?     : User
  approvedByUser?    : User
  receivedByUser?    : User
  purchaseOrderItems?: PurchaseOrderItem[]
}

interface PurchaseOrderState {
  purchaseOrders: PurchaseOrder[]
  purchaseOrder: PurchaseOrder | null
  loading: boolean
  error: any
  totalRecords: number
  params: {
    first: number
    rows: number
    sortField: string | null
    sortOrder: number | null
    draw: number
    search: string
  }
  form: any,
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const usePurchaseOrderStore = defineStore('purchaseOrder', {
  state: (): PurchaseOrderState => ({
    purchaseOrders: [],
    purchaseOrder : null,
    loading       : true,
    error         : null,
    totalRecords: 0,
    params: {
        first: 0,
        rows: 10,
        sortField: 'id',
        sortOrder: 1,
        draw: 1,
        search: '',
    },
    form: {
        purchaseOrderItems: []
    },
    isEditMode: false,
    showModal: false,
    validationErrors: [],
  }),
  actions: {
    async fetchPurchaseOrders() {
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
      try {
        const token = localStorage.getItem('token');
        const url = new URL($api.purchaseOrder())
        const params = new URLSearchParams({
            page     : ((this.params.first / this.params.rows) + 1).toString(),
            rows     : this.params.rows.toString(),
            sortField: this.params.sortField || '',
            sortOrder: this.params.sortOrder?.toString() || '',
            draw     : this.params.draw.toString(),
            search   : this.params.search || '',
        });
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

        if (!response.ok) throw new Error('Gagal mengambil data purchaseOrder')

        const result = await response.json()
        this.purchaseOrders = result.data
        this.totalRecords = result.meta.total
      } catch (e: any) {
        console.error('Gagal mengambil data purchaseOrder:', e)
        this.error = e
        Swal.fire('Error', `Tidak dapat memuat data Purchase Order: ${e.message}`, 'error');
      } finally {
        this.loading = false
      }
    },

    async savePurchaseOrder() {
        this.loading = true;
        this.validationErrors = [];
        const { $api } = useNuxtApp();
        const userStore = useUserStore();

        try {
            const token        = localStorage.getItem('token');

            const formData = new FormData()

            const dataToAppend = { ...this.form };
            delete dataToAppend.purchaseOrderItems;
            delete dataToAppend.attachment;
            delete dataToAppend.vendor;
            delete dataToAppend.perusahaan;
            delete dataToAppend.cabang;
            delete dataToAppend.createdByUser;
            delete dataToAppend.approvedByUser;
            delete dataToAppend.receivedByUser;
            delete dataToAppend.rejectedByUser;
            
            // Untuk create, hapus noPo karena di-generate di backend
            if (!this.isEditMode) {
                delete dataToAppend.noPo;
            }

            // Conditional logic berdasarkan poType
            if (dataToAppend.poType === 'internal') {
                // Untuk PO Internal: hapus extNamaPerusahaan, pastikan ada perusahaanId dan cabangId
                delete dataToAppend.extNamaPerusahaan;
                if (!dataToAppend.perusahaanId) {
                    throw new Error('Perusahaan harus dipilih untuk PO Internal');
                }
                if (!dataToAppend.cabangId) {
                    throw new Error('Cabang harus dipilih untuk PO Internal');
                }
            } else if (dataToAppend.poType === 'external') {
                // Untuk PO External: hapus perusahaanId dan cabangId, pastikan ada extNamaPerusahaan
                delete dataToAppend.perusahaanId;
                delete dataToAppend.cabangId;
                if (!dataToAppend.extNamaPerusahaan || dataToAppend.extNamaPerusahaan.trim() === '') {
                    throw new Error('Nama Perusahaan External harus diisi untuk PO External');
                }
            }

            // Validasi frontend sebelum kirim
            if (!dataToAppend.vendorId) {
                throw new Error('Vendor harus dipilih');
            }
            if (!dataToAppend.up || dataToAppend.up.trim() === '') {
                throw new Error('Untuk Perhatian harus diisi');
            }
            if (!dataToAppend.date) {
                throw new Error('Tanggal PO harus diisi');
            }
            if (!dataToAppend.dueDate) {
                throw new Error('Jatuh Tempo harus diisi');
            }
            if (!dataToAppend.poType) {
                throw new Error('Tipe PO harus dipilih');
            }

            console.log('Data being sent:', dataToAppend);

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

            if (this.form.attachment instanceof File) {
                formData.append('attachment', this.form.attachment);
            }

            // Validasi items
            if (!this.form.purchaseOrderItems || this.form.purchaseOrderItems.length === 0) {
                throw new Error('Minimal harus ada 1 item produk');
            }

            // Validasi setiap item
            const validItems = this.form.purchaseOrderItems.filter((item: any) => 
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
                       formData.append(`purchaseOrderItems[${i}][${itemKey}]`, value);
                    }
                });
            });

            const method = this.isEditMode ? 'POST' : 'POST';
            const url = this.isEditMode ? `${$api.purchaseOrder()}/${this.form.id}` : $api.purchaseOrder();
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
                console.error('Server Error Response:', errorData);
                if (response.status === 422) {
                    this.validationErrors = errorData.errors;
                     Swal.fire('Gagal Validasi', errorData.errors.map((e: any) => e.message).join('<br>'), 'error');
                } else {
                    // Tampilkan detail error jika ada
                    let errorMessage = errorData.message || 'Gagal menyimpan data purchaseOrder';
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
                await this.fetchPurchaseOrders();
                Swal.fire('Berhasil!', `Purchase Order berhasil ${this.isEditMode ? 'diperbarui' : 'dibuat'}.`, 'success');
            }


        } catch (error: any) {
            // Clear validation errors on new general error
            this.validationErrors = [];
            console.error('Save Purchase Order Error:', error);
            Swal.fire('Gagal', error.message || 'Operasi gagal', 'error');
        } finally {
            this.loading = false;
        }
    },

    async deletePurchaseOrder(id: string) {
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
  
            const response = await fetch(`${$api.purchaseOrder()}/${id}`, {
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
  
            await this.fetchPurchaseOrders();
            Swal.fire('Berhasil!', 'Purchase Order berhasil dihapus.', 'success');
        } catch (error: any) {
            Swal.fire('Error', error.message || 'Gagal menghapus Purchase Order', 'error');
        } finally {
            this.loading = false;
        }
      },
    
    async approvePurchaseOrder(purchaseOrderId: string) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
          const token = localStorage.getItem('token');

          const response = await fetch($api.approvePurchaseOrder(purchaseOrderId), {
              method: 'PATCH',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type' : 'application/json',
                  'Accept'       : 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Gagal mengapprove purchase order' }));
              throw new Error(errorData.message || 'Gagal mengapprove purchase order');
          }

          await this.fetchPurchaseOrders();
          await Swal.fire('Berhasil!', 'Purchase Order berhasil diapprove.', 'success');

          return true;
      } catch (error: any) {
          console.error('Error approving purchase order:', error);
          await Swal.fire('Error', error.message || 'Gagal mengapprove purchase order.', 'error');
          return false;
      } finally {
          this.loading = false;
      }
    },

    async rejectPurchaseOrder(purchaseOrderId: string) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
          const token = localStorage.getItem('token');

          const response = await fetch($api.rejectPurchaseOrder(purchaseOrderId), {
              method: 'PATCH',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type' : 'application/json',
                  'Accept'       : 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Gagal mereject purchase order' }));
              throw new Error(errorData.message || 'Gagal mereject purchase order');
          }

          await this.fetchPurchaseOrders();
          await Swal.fire('Berhasil!', 'Purchase Order berhasil direject.', 'success');

          return true;
      } catch (error: any) {
          console.error('Error rejecting purchase order:', error);
          await Swal.fire('Error', error.message || 'Gagal mereject purchase order.', 'error');
          return false;
      } finally {
          this.loading = false;
      }
    },    

    async updateStatusPartial(itemId: string, status: boolean, receivedQty: number) {
        this.loading = true;
        this.error = null;
        const { $api } = useNuxtApp();
        try {
            const token        = localStorage.getItem('token');

            const resData = await apiFetch($api.purchaseOrderItemUpdateStatusPartial(itemId), {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: { 
                    statusPartial: status, 
                    receivedQty: receivedQty 
                },
                credentials: 'include',
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
            
        } catch (error: any) {
            console.error('Gagal memperbarui status item PO atau PO:', error);
            this.error = error;
            Swal.fire('Error', error.data?.message || error.message || 'Operasi gagal', 'error');
            throw error;
        } finally {
            this.loading = false;
        }
    },

    openModal(purchaseOrderData: PurchaseOrder | null = null) {
        this.isEditMode = !!purchaseOrderData;
        this.validationErrors = [];

        if (purchaseOrderData) {
            const formatDate = (dateStr: string | null) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : null;
            
            // Salin data dan format tanggal dengan benar
            const formData: { [key: string]: any } = {
                ...JSON.parse(JSON.stringify(purchaseOrderData)),
                attachment: null, // Reset attachment, akan ditangani secara terpisah
            };

            const dateFields = ['date', 'dueDate', 'approvedAt', 'receivedAt'];
            dateFields.forEach(field => {
                if (formData[field]) {
                    formData[field] = formatDate(formData[field]);
                }
            });

            this.form = formData;

            // Pastikan purchaseOrderItems ada
            if (!this.form.purchaseOrderItems || this.form.purchaseOrderItems.length === 0) {
                this.form.purchaseOrderItems = [];
                this.addItem();
            }
        } else {
            this.form = {
                noPo: '',
                up: '',
                vendorId: null,
                perusahaanId: null,
                cabangId: null,
                extNamaPerusahaan: '',
                date: new Date().toISOString().split('T')[0], 
                dueDate: new Date().toISOString().split('T')[0], 
                discountPercent: 0, 
                taxPercent: 0, 
                description: '',
                attachment: null, 
                status: 'draft',
                poType: 'internal', // Default ke internal
                purchaseOrderItems: [],
            };
            this.addItem(); // Tambahkan satu item default untuk PO baru
        }
        this.showModal = true;
    },

    closeModal() {
        this.showModal = false;
        this.isEditMode = false;
        this.form = { 
            poType: 'internal',
            extNamaPerusahaan: '',
            perusahaanId: null,
            cabangId: null,
            purchaseOrderItems: [] 
        };
        this.validationErrors = [];
    },

    addItem() {
        this.form.purchaseOrderItems.push({
            productId: null, warehouseId: null, quantity: 1, price: 0,
            description: '', subtotal: 0,
        });
    },

    removeItem(index: number) {
        this.form.purchaseOrderItems.splice(index, 1);
    },

    setPagination(event: any) {
        this.params.first = event.first;
        this.params.rows = event.rows;
        this.fetchPurchaseOrders();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchPurchaseOrders();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchPurchaseOrders();
    },

    async getPurchaseOrderDetails(poId: string) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
        const token        = localStorage.getItem('token');

        const resData = await apiFetch($api.getPurchaseOrderDetails(poId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
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
  }
})
