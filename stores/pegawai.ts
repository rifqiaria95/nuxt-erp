import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { useDepartemenStore } from '~/stores/departemen'
import { useImageUrl } from '~/composables/useImageUrl'

export interface Pegawai {
    id: number
    name: string
    description?: string
}

interface PegawaiState {
    pegawais: Pegawai[]
    stats: any
    loading: boolean
    totalRecords: number
    params: any
    form: any
    isEditMode: boolean
    showModal: boolean
    validationErrors: any[]
    initialHistory: any
}

export const usePegawaiStore = defineStore('pegawai', {
    state: (): PegawaiState => ({
        pegawais: [],
        stats: {
            total: undefined,
            pkwtt: undefined,
            pkwt: undefined,
            resign: undefined,
            outsource: undefined
        },
        loading: false,
        totalRecords: 0,
        params: {
            first: 0,
            rows: 10,
            sortField: 'id_pegawai' as string | null,
            sortOrder: 1 as number | null,
            draw: 1,
            search: '',
        },
        form: {},
        isEditMode: false,
        showModal: false,
        validationErrors: [],
        initialHistory: {
            cabangId: null,
            departemenId: null,
        },
    }),
    actions: {
        async fetchPegawais() {
            const toast = useToast();
            this.loading = true
            const { $api } = useNuxtApp()
            try {
                const token = localStorage.getItem('token');
                const params = new URLSearchParams({
                    start: this.params.first.toString(),
                    length: this.params.rows.toString(),
                    sortField: this.params.sortField || '',
                    sortOrder: this.params.sortOrder?.toString() || '',
                    draw: this.params.draw.toString(),
                    'search[value]': this.params.search || '',
                });

                const response = await fetch(`${$api.pegawai()}?${params.toString()}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data pegawai' }));
                    throw new Error(errorData.message);
                }

                const result = await response.json();
                this.pegawais = result.data || [];
                this.totalRecords = parseInt(result.recordsTotal) || 0;
                if (result.draw) {
                    this.params.draw = parseInt(result.draw);
                }

            } catch (error: any) {
                this.pegawais = [];
                this.totalRecords = 0;
                toast.error({
                    title: 'Error',
                    message: `Tidak dapat memuat data pegawai: ${error.message}`,
                    color: 'red'
                });
            } finally {
                this.loading = false
            }
        },

        async fetchStats() {
            const toast = useToast();
            const { $api } = useNuxtApp()
            const defaultStats = { total: undefined, pkwtt: undefined, pkwt: undefined, resign: undefined, outsource: undefined };
            try {
                const token = localStorage.getItem('token');
                const response = await fetch($api.pegawaiCountByStatus(), {
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
                console.error('Gagal mengambil data statistik:', error);
                this.stats = defaultStats;
            }
        },

        async savePegawai() {
            const toast = useToast();
            this.loading = true;
            this.validationErrors = [];
            const { $api } = useNuxtApp()

            const formData = new FormData();
            for (const key in this.form) {
                if (key === 'avatarPreview') continue;
                
                const value = this.form[key];
                if (value !== null && value !== undefined) {
                    if (key === 'avatar' && value instanceof File) {
                        formData.append(key, value);
                    } else if (key !== 'avatar') {
                        formData.append(key, value === null ? '' : value);
                    }
                }
            }
            
            try {
                const token = localStorage.getItem('token');

                let response;
                let url;

                if (this.isEditMode) {
                    const pegawaiId = this.form.id_pegawai;
                    url = $api.pegawaiUpdate(pegawaiId);
                    formData.append('_method', 'PUT');
                    response = await fetch(url, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        credentials: 'include'
                    });
                } else {
                    url = $api.pegawai();
                    response = await fetch(url, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        credentials: 'include'
                    });
                }
                
                if (response.ok) {
                    this.closeModal();
                    await this.fetchPegawais();
                    await this.fetchStats();
                    toast.success({
                        title: 'Success',
                        message: `Pegawai berhasil ${this.isEditMode ? 'diperbarui' : 'dibuat'}.`,
                        color: 'green'
                    });
                } else {
                    const errorData = await response.json();
                    if (response.status === 422) {
                        if (errorData.errors && typeof errorData.errors === 'object') {
                            this.validationErrors = Object.values(errorData.errors).flat();
                        } else {
                            this.validationErrors = [];
                        }
                        toast.error({
                            title: 'Error',
                            message: 'Gagal Validasi',
                            color: 'red'
                        });
                    } else {
                        throw new Error(errorData.message || 'Gagal menyimpan data pegawai');
                    }
                }
            } catch (error: any) {
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

        async deletePegawai(id: number) {
            const toast = useToast();
            const { $api } = useNuxtApp()
            
            const { default: Swal } = await import('sweetalert2');
            const result = await Swal.fire({
                title: 'Anda yakin?',
                text: "Data yang dihapus tidak dapat dikembalikan!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#666CFF',
                cancelButtonColor: '#A7A9B3',
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            });

            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');

                    const response = await fetch($api.pegawaiDelete(id), {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Gagal menghapus pegawai');
                    }

                    await this.fetchPegawais();
                    await this.fetchStats();
                    toast.success({
                        title: 'Success',
                        message: 'Pegawai berhasil dihapus.',
                        color: 'green'
                    });
                } catch (error: any) {
                    toast.error({
                        title: 'Error',
                        message: error.message || 'Gagal menghapus pegawai',
                        color: 'red'
                    });
                }
            }
        },

        async openModal(pegawaiData: any | null = null) {
            this.isEditMode = !!pegawaiData;
            this.validationErrors = [];
            
            if (pegawaiData) {
                this.form = JSON.parse(JSON.stringify(pegawaiData));
                
                this.form.tgl_lahir_pegawai = pegawaiData.tgl_lahir_pegawai ? pegawaiData.tgl_lahir_pegawai.substring(0, 10) : '';
                this.form.tgl_masuk_pegawai = pegawaiData.tgl_masuk_pegawai ? pegawaiData.tgl_masuk_pegawai.substring(0, 10) : '';
                this.form.tgl_keluar_pegawai = pegawaiData.tgl_keluar_pegawai ? pegawaiData.tgl_keluar_pegawai.substring(0, 10) : null;
                this.form.full_name = pegawaiData.nm_pegawai;
                
                if (pegawaiData.history) {
                    this.form.jabatan_id = pegawaiData.history.jabatan?.id_jabatan ?? pegawaiData.history.jabatan?.id ?? null;
                    this.form.perusahaan_id = pegawaiData.history.perusahaan?.id ?? null;
                    this.form.divisi_id = pegawaiData.history.divisi?.id ?? null;
                    this.form.gaji_pegawai = pegawaiData.history.gaji_pegawai ? parseFloat(pegawaiData.history.gaji_pegawai) : 0;
                    this.form.tunjangan_pegawai = pegawaiData.history.tunjangan_pegawai ? parseFloat(pegawaiData.history.tunjangan_pegawai) : 0;
                    
                    this.initialHistory.cabangId = pegawaiData.history.cabang?.id ?? null;
                    this.initialHistory.departemenId = pegawaiData.history.departemen?.id ?? null;

                    this.form.cabang_id = this.initialHistory.cabangId;
                    this.form.departemen_id = this.initialHistory.departemenId;

                    if (this.form.divisi_id) {
                        const departemenStore = useDepartemenStore()
                        await departemenStore.fetchDepartemensByDivisi(this.form.divisi_id)
                        this.form.departemen_id = this.initialHistory.departemenId
                    }
                } else {
                     this.form.jabatan_id = null;
                     this.form.perusahaan_id = null;
                     this.form.divisi_id = null;
                     this.form.cabang_id = null;
                     this.form.departemen_id = null;
                     this.form.gaji_pegawai = 0;
                     this.form.tunjangan_pegawai = 0;
                }

                if (pegawaiData.avatar) {
                    const { getUserAvatar } = useImageUrl();
                    this.form.avatarPreview = getUserAvatar(pegawaiData.avatar);
                } else {
                    this.form.avatarPreview = '';
                }
                 this.form.avatar = null;

            } else {
                this.form = {
                    nm_pegawai: '', email: '', full_name: '', tgl_lahir_pegawai: '', tmp_lahir_pegawai: '',
                    no_tlp_pegawai: '', alamat_pegawai: '', pendidikan_pegawai: null, status_pegawai: 1,
                    no_ktp_pegawai: '', nik_pegawai: '', npwp_pegawai: '', jenis_kelamin_pegawai: null,
                    tgl_masuk_pegawai: '', tgl_keluar_pegawai: null, istri_suami_pegawai: '', anak_1: '', anak_2: '',
                    user_id: '', jabatan_id: null, perusahaan_id: null, cabang_id: null, divisi_id: null,
                    departemen_id: null, gaji_pegawai: 0, tunjangan_pegawai: 0, avatar: null, avatarPreview: '',
                };
            }
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.isEditMode = false;
            this.form = {
                nm_pegawai: '', email: '', full_name: '', tgl_lahir_pegawai: '', tmp_lahir_pegawai: '',
                no_tlp_pegawai: '', alamat_pegawai: '', pendidikan_pegawai: null, status_pegawai: 1,
                no_ktp_pegawai: '', nik_pegawai: '', npwp_pegawai: '', jenis_kelamin_pegawai: null,
                tgl_masuk_pegawai: '', tgl_keluar_pegawai: null, istri_suami_pegawai: '', anak_1: '', anak_2: '',
                user_id: '', jabatan_id: null, perusahaan_id: null, cabang_id: null, divisi_id: null,
                departemen_id: null, gaji_pegawai: 0, tunjangan_pegawai: 0, avatar: null, avatarPreview: '',
            };
            this.validationErrors = [];
            this.initialHistory = { cabangId: null, departemenId: null };
        },

        setPagination(event: any) {
            this.params.first = event.first;
            this.params.rows = event.rows;
            this.fetchPegawais();
        },

        setSort(event: any) {
            this.params.sortField = event.sortField;
            this.params.sortOrder = event.sortOrder;
            this.fetchPegawais();
        },
        
        setSearch(value: string) {
            this.params.search = value;
            this.params.first = 0;
            this.fetchPegawais();
        },

        handleAvatarChange(file: File) {
            const toast = useToast();
            if (file) {
                if (!file.size || file.size === 0) {
                    toast.error({
                        title: 'Error',
                        message: 'File avatar kosong atau tidak valid',
                        color: 'red'
                    });
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
                    toast.error({
                        title: 'Error',
                        message: `File harus berupa gambar (JPEG, PNG, GIF, WebP). Detected: MIME=${fileType}, Ext=${fileExtension}`,
                        color: 'red'
                    });
                    return;
                }

                // Validasi file size
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    toast.error({
                        title: 'Error',
                        message: 'Ukuran file terlalu besar (maksimal 5MB)',
                        color: 'red'
                    });
                    return;
                }

                this.form.avatar = file;
                this.form.avatarPreview = URL.createObjectURL(file);
            }
        }
    },
})