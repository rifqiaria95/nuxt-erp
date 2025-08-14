import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'
import { useImageUrl } from '~/composables/useImageUrl'

export interface Vendor {
  id     : number
  name   : string
  address: string
  email  : string
  phone  : string
  npwp   : string
  logo   : string
  logo_url?: string
}

interface VendorState {
  vendors: Vendor[]
  loading: boolean
  error: any
  totalRecords: number
  params: {
    first: number
    rows: number
    sortField: string | null
    sortOrder: number | null
    search: string
  }
  form: any,
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useVendorStore = defineStore('vendor', {
    state: (): VendorState => ({
    vendors: [],
    loading: false,
    error: null,
    totalRecords: 0,
    params: {
        first: 0,
        rows: 10,
        sortField: 'id',
        sortOrder: 1,
        search: '',
    },
    form: {},
    isEditMode: false,
    showModal: false,
    validationErrors: [],
  }),
  actions: {
    async fetchVendors() {
      const toast = useToast();
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
      try {
        const token = localStorage.getItem('token');

        const params = new URLSearchParams({
            page     : Math.floor((this.params.first / this.params.rows) + 1).toString(),
            rows     : Math.floor(this.params.rows).toString(),
            sortField: this.params.sortField || '',
            sortOrder: (this.params.sortOrder || 1) > 0 ? 'asc' : 'desc',
            search   : this.params.search || '',
        });

        const url = new URL($api.vendor())
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
        
        if (!response.ok) throw new Error('Gagal mengambil data vendor')

        const result = await response.json()
        this.vendors = result.data
        this.totalRecords = result.meta.total
        console.log('Vendors loaded:', this.vendors.length, this.vendors);
      } catch (e: any) {
        this.error = e.message
        console.error('Error fetching vendors:', e);
        toast.error({
          title: 'Error',
          message: `Tidak dapat memuat data vendor: ${e.message}`,
          color: 'red'
        });
      } finally {
        this.loading = false
      }
    },

    async saveVendor() {
      const toast = useToast();
        this.loading = true;
        this.validationErrors = [];
        const { $api } = useNuxtApp();

        try {
            const token        = localStorage.getItem('token');

            // Siapkan FormData untuk pengiriman data, termasuk file logo jika ada
            const formData = new FormData();
            Object.keys(this.form).forEach(key => {
                if (key !== 'logo' && this.form[key] !== null && this.form[key] !== undefined) {
                    formData.append(key, this.form[key]);
                }
            });

            if (this.form.logo instanceof File) {
                formData.append('logo', this.form.logo);
            }

            // Tentukan method dan url berdasarkan mode edit/tambah
            let method = 'POST';
            let url = $api.vendor();
            if (this.isEditMode) {
                url = `${$api.vendor()}/${this.form.id}`;
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
                // Jika validasi gagal (422), ambil error detail
                if (response.status === 422) {
                    const errorData = await response.json();
                    this.validationErrors = Object.values(errorData.errors).flat();
                    return;
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal menyimpan data vendor');
                }
            }

            this.closeModal();
            await this.fetchVendors();
            toast.success({
              title: 'Success',
              message: `Vendor berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`,
              color: 'green'
            });

        } catch (error: any) {
            toast.error({
              title: 'Error',
              message: error.message || 'Operasi gagal',
              color: 'red'
            });
        } finally {
            this.loading = false;
        }
    },

    async deleteVendor(id: number) {
      const toast = useToast();
      this.loading = true;
      const { $api } = useNuxtApp();

      // Tampilkan konfirmasi sebelum menghapus
      const result = await Swal.fire({
          title: 'Apakah Anda yakin?',
          text: "Data vendor yang dihapus tidak dapat dikembalikan!",
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

      try {
          const token = localStorage.getItem('token');

          const response = await fetch($api.vendor() + `/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus vendor');
          }

          await this.fetchVendors();
          toast.success({
            title: 'Success',
            message: 'Vendor berhasil dihapus.',
            color: 'green'
          });
      } catch (error: any) {
          console.error('Gagal menghapus vendor:', error);
          toast.error({
            title: 'Error',
            message: error.message || 'Gagal menghapus vendor',
            color: 'red'
          });
      } finally {
          this.loading = false;
      }
    },

    openModal(vendor: Vendor | null = null) {
        this.isEditMode = !!vendor;
        this.validationErrors = [];
        if (vendor) {
            this.form = { ...vendor, logo: null };
            
            // Set logo preview jika ada
            if (vendor.logo) {
                const { getVendorLogo } = useImageUrl();
                this.form.logoPreview = getVendorLogo(vendor.logo);
            } else {
                this.form.logoPreview = '';
            }
        } else {
            this.form = {
                name: '', 
                address: '', 
                email: '', 
                phone: '', 
                npwp: '', 
                logo: null,
                logoPreview: '',
            };
        }
        this.showModal = true;
    },

    closeModal() {
        this.showModal = false;
        this.isEditMode = false;
        this.form = {
            name: '', 
            address: '', 
            email: '', 
            phone: '', 
            npwp: '', 
            logo: null,
            logoPreview: '',
        };
        this.validationErrors = [];
    },

    setPagination(event: any) {
        this.params.first = Number(event.first) || 0;
        this.params.rows = Number(event.rows) || 10;
        this.fetchVendors();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchVendors();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchVendors();
    },

    handleLogoChange(file: File) {
        if (file) {
            // Validasi file tidak kosong
            if (!file.size || file.size === 0) {
                Swal.fire('Error', 'File logo kosong atau tidak valid', 'error');
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

            this.form.logo = file;
            this.form.logoPreview = URL.createObjectURL(file);
        }
    },
  }
})
