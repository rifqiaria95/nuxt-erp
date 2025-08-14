import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'
import type { Category } from './kategori'
import type { Customer } from './customer'
import type { Unit } from './unit'
import { useImageUrl } from '~/composables/useImageUrl'

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

          // Handle response parsing dengan error catching
          let result;
          try {
              result = await response.json();
          } catch (parseError) {
              console.error('Failed to parse response as JSON:', parseError);
              throw new Error('Server response tidak valid');
          }

          if (!response.ok) {
              if (response.status === 422 && result.errors) {
                  this.validationErrors = Object.values(result.errors).flat();
                  return; // Stop execution - jangan throw error agar validation error muncul di modal
              }
              throw new Error(result.message || 'Gagal menyimpan data produk');
          }
          
          this.closeModal();
          await this.fetchProducts();
          Swal.fire('Berhasil!', `Produk berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');

      } catch (error: any) {
          // Jangan tampilkan Swal jika ada validation errors (sudah ditampilkan di modal)
          if (this.validationErrors.length === 0) {
              Swal.fire('Error', error.message || 'Operasi gagal', 'error');
          }
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
            
            // Set image preview jika ada
            if (product.image) {
                const { getProductImage } = useImageUrl();
                this.form.imagePreview = getProductImage(product.image);
            } else {
                this.form.imagePreview = '';
            }
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
                imagePreview: '',
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
        this.form = {
            name: '',
            sku: '',
            unitId: undefined,
            stockMin: 0,
            priceBuy: 0,
            priceSell: 0,
            isService: false,
            image: '',
            imagePreview: '',
            categoryId: undefined,
            kondisi: 'baru',
            berat: 0,
        };
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
            // Validasi file tidak kosong
            if (!file.size || file.size === 0) {
                Swal.fire('Error', 'File gambar kosong atau tidak valid', 'error');
                return;
            }

            // Validasi file adalah image
            const fileType = file.type || '';
            const fileExtension = file.name?.split('.').pop()?.toLowerCase() || '';

            const allowedMimeTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/x-png',
                'image/gif',
                'image/webp',
                'image/svg+xml'
            ];

            const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

            const isValidMimeType = allowedMimeTypes.includes(fileType);
            const isValidExtension = allowedExtensions.includes(fileExtension);

            if (!isValidMimeType && !isValidExtension) {
                Swal.fire('Error', `File harus berupa gambar (JPEG, PNG, GIF, WebP). Detected: MIME=${fileType}, Ext=${fileExtension}`, 'error');
                return;
            }

            // Validasi file size
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                Swal.fire('Error', 'Ukuran file terlalu besar (maksimal 5MB)', 'error');
                return;
            }

            this.form.image = file;
            this.form.imagePreview = URL.createObjectURL(file);
        }
    }
  }
})
