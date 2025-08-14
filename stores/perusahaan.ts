import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'
import { useImageUrl } from '~/composables/useImageUrl'

export interface Perusahaan {
  id: number
  kodePerusahaan: string
  nmPerusahaan: string
  npwpPerusahaan: string
  alamatPerusahaan: string
  tlpPerusahaan: string
  emailPerusahaan: string
  logoPerusahaan: string
  createdAt: string
  updatedAt: string
}

interface PerusahaanState {
  perusahaans: Perusahaan[]
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
  form: any
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
  selectedPerusahaan: Perusahaan | null
}

export const usePerusahaanStore = defineStore('perusahaan', {
  state: (): PerusahaanState => ({
    perusahaans: [],
    loading: true,
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
    selectedPerusahaan: null,
  }),
  actions: {
    async fetchPerusahaans() {
      const toast = useToast();
      this.loading = true
      const { $api } = useNuxtApp()
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
            page     : ((this.params.first / this.params.rows) + 1).toString(),
            rows     : this.params.rows.toString(),
            sortField: this.params.sortField || '',
            sortOrder: (this.params.sortOrder || 1) > 0 ? 'asc' : 'desc',
            search   : this.params.search || '',
        });

        const response = await fetch(`${$api.perusahaan()}?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include'
        })
        
        if (!response.ok) throw new Error('Gagal mengambil data perusahaan')
        
        const result = await response.json()
        this.perusahaans = result.data
        this.totalRecords = result.meta.total
        console.log('Perusahaans loaded:', this.perusahaans.length, this.perusahaans);
      } catch (error: any) {
        console.error('Gagal mengambil data perusahaan:', error)
        this.error = error.message;
        toast.error({
          title: 'Error',
          message: `Tidak dapat memuat data perusahaan: ${error.message}`,
          color: 'red'
        });
      } finally {
        this.loading = false
      }
    },
    async savePerusahaan() {
        this.loading = true;
        this.validationErrors = [];
        const { $api } = useNuxtApp();

        try {
            const token = localStorage.getItem('token');

            const formData = new FormData();
            Object.keys(this.form).forEach(key => {
                if (key === 'logoPerusahaan' && this.form[key] instanceof File) {
                    formData.append(key, this.form[key]);
                } else if (this.form[key] !== null && this.form[key] !== undefined) {
                    formData.append(key, this.form[key]);
                }
            });

            let url = $api.perusahaan();
            let method = 'POST';

            if (this.isEditMode && this.form.id) {
                url = `${$api.perusahaan()}/${this.form.id}`;
                formData.append('_method', 'PUT');
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData,
                credentials: 'include'
            });

            // Handle response parsing dengan error catching
            let errorData;
            if (!response.ok) {
                try {
                    errorData = await response.json();
                } catch (parseError) {
                    console.error('Failed to parse error response as JSON:', parseError);
                    throw new Error('Server response tidak valid');
                }
                
                if (response.status === 422 && errorData.errors) {
                   this.validationErrors = Object.values(errorData.errors).flat();
                   return; // Stop execution - jangan throw error agar validation error muncul di modal
                }
               throw new Error(errorData.message || 'Gagal menyimpan data perusahaan');
           }

            this.closeModal();
            await this.fetchPerusahaans();
            Swal.fire('Berhasil!', `Perusahaan berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');

        } catch (error: any) {
            // Jangan tampilkan Swal jika ada validation errors (sudah ditampilkan di modal)
            if (this.validationErrors.length === 0) {
                Swal.fire('Error', error.message || 'Operasi gagal', 'error');
            }
        } finally {
            this.loading = false;
        }
    },
    async deletePerusahaan(id: number) {
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

          const response = await fetch(`${$api.perusahaan()}/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus perusahaan');
          }

          await this.fetchPerusahaans();
          Swal.fire('Berhasil!', 'Perusahaan berhasil dihapus.', 'success');
      } catch (error: any) {
          Swal.fire('Error', error.message || 'Gagal menghapus perusahaan', 'error');
      } finally {
          this.loading = false;
      }
    },
    openModal(perusahaan: Perusahaan | null = null) {
        this.isEditMode = !!perusahaan;
        this.validationErrors = [];
        if (perusahaan) {
            this.form = { ...perusahaan };
            
            // Set logo preview jika ada
            if (perusahaan.logoPerusahaan) {
                const { getCompanyLogo } = useImageUrl();
                this.form.logoPreview = getCompanyLogo(perusahaan.logoPerusahaan);
            } else {
                this.form.logoPreview = '';
            }
            this.form.logoPerusahaan = null; // Reset file input
        } else {
            this.form = {
                kodePerusahaan: '',
                nmPerusahaan: '',
                npwpPerusahaan: '',
                alamatPerusahaan: '',
                tlpPerusahaan: '',
                emailPerusahaan: '',
                logoPerusahaan: null,
                logoPreview: '',
            };
        }
        this.showModal = true;
    },
    closeModal() {
        this.showModal = false;
        this.isEditMode = false;
        this.form = {
            kodePerusahaan: '',
            nmPerusahaan: '',
            npwpPerusahaan: '',
            alamatPerusahaan: '',
            tlpPerusahaan: '',
            emailPerusahaan: '',
            logoPerusahaan: null,
            logoPreview: '',
        };
        this.validationErrors = [];
        this.selectedPerusahaan = null;
    },
    setPagination(event: any) {
        this.params.first = event.first;
        this.params.rows = event.rows;
        this.fetchPerusahaans();
    },
    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchPerusahaans();
    },
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchPerusahaans();
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

            this.form.logoPerusahaan = file;
            this.form.logoPreview = URL.createObjectURL(file);
        }
    }
  },
})
