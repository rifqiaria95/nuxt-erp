import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'
import type { Category } from './kategori'
import type { Customer } from './customer'
import type { Unit } from './unit'

export interface Stock {
  id: string
  productId: number
  warehouseId: number
  quantity: number
  createdAt: string
  updatedAt: string
}

export interface ProductCustomer {
  id: number
  productId: number
  customerId: number
  priceSell: number
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  sku: string
  name: string
  unitId: number
  stockMin: number
  priceBuy: number
  priceSell: number
  isService: boolean
  categoryId: number
  image: string | File
  kondisi: string
  berat: number
  createdAt: string
  updatedAt: string
  category?: Category
  unit?: Unit
  customer?: Customer
  productCustomer?: ProductCustomer
  stocks?: Stock[]
}

interface ProductState {
  products: Product[]
  loading: boolean
  error: any
  totalRecords: number
  params: {
    first: number
    rows: number
    sortField: string | null
    sortOrder: number | null
    search: string
    warehouseId?: number | null
  }
  form: Partial<Product>
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: [],
    loading: true,
    error: null,
    totalRecords: 0,
    params: {
      first: 0,
      rows: 10,
      sortField: 'id',
      sortOrder: 1,
      search: '',
      warehouseId: null,
    },
    form: {
      name: '',
      sku: '',
      unitId: undefined,
      stockMin: 0,
      priceBuy: 0,
      priceSell: 0,
      isService: false,
      image: '',
      categoryId: undefined,
      kondisi: 'baru',
      berat: 0,
    },
    isEditMode: false,
    showModal: false,
    validationErrors: [],
  }),
  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
      try {
        const token = localStorage.getItem('token')
        const params = new URLSearchParams({
            page: Math.floor((this.params.first / this.params.rows) + 1).toString(),
            rows: Math.floor(this.params.rows).toString(),
            sortField: this.params.sortField || 'id',
            sortOrder: this.params.sortOrder === -1 ? 'desc' : 'asc',
            search: this.params.search || '',
        });

        if (this.params.warehouseId) {
          params.append('warehouseId', this.params.warehouseId.toString());
          params.append('includeStocks', 'true');
        } else {
          // Include stocks without warehouse filter to show total stock across all warehouses
          params.append('includeStocks', 'true');
        }

        const response = await fetch(`${$api.product()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data produk dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data produk');
        }
        
                 const result = await response.json()
         
         
         
         this.products = result.data
         this.totalRecords = result.meta.total
      } catch (e: any) {
        this.error = e.message
        Swal.fire('Error', `Tidak dapat memuat data produk: ${e.message}`, 'error');
      } finally {
        this.loading = false
      }
    },
    
    async saveProduct() {
      this.loading = true;
      this.validationErrors = [];
      const { $api } = useNuxtApp();

      try {
          const token = localStorage.getItem('token');

          const formData = new FormData();
          Object.keys(this.form).forEach(key => {
            const value = this.form[key as keyof typeof this.form];
             if (key === 'isService') {
                formData.append(key, value ? 'true' : 'false');
            } else if (value !== null && value !== undefined) {
                if (key === 'image' && value instanceof File) {
                    formData.append(key, value);
                } else if (key !== 'image') {
                    formData.append(key, String(value));
                }
            }
          });
          
          let url = $api.product();
          let method = 'POST';

          if (this.isEditMode && this.form.id) {
              url = `${$api.product()}/${this.form.id}`;
              formData.append('_method', 'PUT');
          }

          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
              },
              body: formData,
              credentials: 'include'
          });

          const result = await response.json();

          if (!response.ok) {
              if (result.errors) {
                  this.validationErrors = Object.values(result.errors).flat();
              }
              throw new Error(result.message || 'Gagal menyimpan data produk');
          }
          
          this.closeModal();
          await this.fetchProducts();
          Swal.fire('Berhasil!', `Produk berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');

      } catch (error: any) {
          Swal.fire('Error', error.message || 'Operasi gagal', 'error');
      } finally {
          this.loading = false;
      }
    },

    async deleteProduct(id: number) {
      const { $api } = useNuxtApp();

      const result = await Swal.fire({
          title: 'Apakah Anda yakin?',
          text: "Data produk yang dihapus tidak dapat dikembalikan!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal'
      });

      if (!result.isConfirmed) {
          return;
      }
      
      this.loading = true;
      try {
          const token = localStorage.getItem('token');

          const response = await fetch($api.product() + `/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus produk');
          }

          await this.fetchProducts();
          Swal.fire('Berhasil!', 'Produk berhasil dihapus.', 'success');
      } catch (error: any) {
          console.error('Gagal menghapus produk:', error);
          Swal.fire('Error', error.message || 'Gagal menghapus produk', 'error');
      } finally {
          this.loading = false;
      }
    },

    openModal(product: Product | null = null) {
        this.isEditMode = !!product;
        this.validationErrors = [];
        if (product) {
            this.form = { 
              ...product,
              stockMin: product.stockMin ? Math.round(product.stockMin) : 0,
            };
        } else {
            this.form = {
                name: '',
                sku: '',
                unitId: undefined,
                stockMin: 0,
                priceBuy: 0,
                priceSell: 0,
                isService: false,
                image: '',
                categoryId: undefined,
                kondisi: 'baru',
                berat: 0,
            };
        }
        this.showModal = true;
    },

    closeModal() {
        this.showModal = false;
        this.isEditMode = false;
        this.form = {};
        this.validationErrors = [];
    },

    setPagination(event: any) {
        this.params.first = event.first;
        this.params.rows = event.rows;
        this.fetchProducts();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchProducts();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchProducts();
    },

    setWarehouseFilter(warehouseId: number | null) {
      this.params.warehouseId = warehouseId;
      this.params.first = 0;
      this.fetchProducts();
    },

    handleImageChange(file: File) {
        if (file) {
            this.form.image = file;
        }
    }
  }
})
