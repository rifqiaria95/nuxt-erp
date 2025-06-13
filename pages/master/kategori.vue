<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Kategori</h4>
            <p class="mb-6">
            List category yang terdaftar di sistem
            </p>
            <!-- category cards -->
            <div class="row g-6 mb-6">
                <!-- Card untuk Tambah Pegawai -->
                    <!-- Cards untuk Statistik Pegawai -->
                <CardBox
                    v-if="stats.total !== undefined"
                    title="Total Kategori"
                    :total="stats.total + ' Kategori'"
                />
                <CardBox
                    v-if="stats.sparepart !== undefined"
                    title="Sparepart"
                    :total="stats.sparepart + ' Produk'"
                />
                <CardBox
                    v-if="stats.oli !== undefined"
                    title="Oli"
                    :total="stats.oli + ' Produk'"
                />
                <CardBox
                    v-if="stats.alat_berat !== undefined"
                    title="Alat Berat"
                    :total="stats.alat_berat + ' Produk'"
                />
                <CardBox
                    v-if="stats.tooling !== undefined"
                    title="Tooling"
                    :total="stats.tooling + ' Produk'"
                />
                <CardBox
                    :isAddButtonCard="true"
                    image-src="/img/illustrations/add-new-role-illustration.png"
                    image-alt="Tambah Kategori"
                    button-text="Tambah Kategori"
                    modal-target="#Modal" 
                    @button-click="openAddCategoryModal"
                />
            </div>
            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Kategori</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Kategori.</p>
                </div>
                <div class="col-12">
                    <!-- category Table -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                            <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                <span class="me-2">Baris:</span>
                                <Dropdown v-model="lazyParams.rows" :options="rowsPerPageOptionsArray" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="btn-group me-2">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="ri-upload-2-line me-1"></i> Export
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="javascript:void(0)" @click="exportData('csv')">CSV</a></li>
                                        <li><a class="dropdown-item" href="javascript:void(0)" @click="exportData('pdf')">PDF</a></li>
                                    </ul>
                                </div>
                                <span class="p-input-icon-left">
                                    <InputText v-model="lazyParams.search" placeholder="Cari Category..." @keyup.enter="handleSearch" style="width: 20rem;" />
                                </span>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="category" 
                            :rows="lazyParams.rows" 
                            :loading="loading"
                            :totalRecords="totalRecords"
                            :lazy="true"
                            @page="onPage($event)"
                            @sort="onSort($event)"
                            responsiveLayout="scroll" 
                            paginatorPosition="bottom"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} data"
                            >
                            <Column field="id" header="#" :sortable="true"></Column> 
                                <Column field="name" header="Nama Category" :sortable="true"></Column>
                                <Column field="description" header="Deskripsi" :sortable="true"></Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <button @click="openEditCategoryModal(slotProps.data)" class="btn btn-sm btn-icon      btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line"></i></button>
                                        <button @click="deleteCategory(slotProps.data.id)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line"></i></button>
                                    </template>
                                </Column>
                        </MyDataTable>
                        </div>
                    </div>
                    <!--/ category Table -->
                </div>
            </div>
            <!--/ category cards -->

            <!-- Placeholder untuk CategoryModal component -->
            <Modal 
                :isEditMode="isEditMode"
                :validationErrorsFromParent="validationErrors"
                :title="modalTitle" 
                :description="modalDescription"
                :selectedCategory="selectedCategory"
            >
                <template #default>
                    <form @submit.prevent="handleSubmit">
                        <div class="row g-6">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="name" 
                                        v-model="formCategory.name" 
                                        placeholder="Masukkan nama category"
                                        required
                                    >
                                    <label for="name">Nama Category</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="description" 
                                        v-model="formCategory.description" 
                                        placeholder="Masukkan deskripsi category"
                                        required
                                    >
                                    <label for="description">Deskripsi Category</label>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    class="btn btn-primary me-2"
                                    @click="handleSaveCategory"
                                >
                                    {{ isEditMode ? 'Update' : 'Simpan' }}
                                </button>
                                <button type="button" class="btn btn-secondary" @click="handleCloseModal">
                                    Batal
                                </button>
                            </div>
                        </div>
                    </form>
                </template>
            </Modal>
        </div>
         <!-- / Content -->
 
         <div class="content-backdrop fade"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Modal from '~/components/modal/Modal.vue'
import CardBox from '~/components/cards/Cards.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Swal from 'sweetalert2'
import { useKategoriStore } from '~/stores/kategori'

const { $api } = useNuxtApp()

const myDataTableRef    = ref(null)
const kategoriStore      = useKategoriStore()
const selectedCategory  = ref(null);
const category          = ref([])
const loading          = ref(false);
const isEditMode       = ref(false);
const totalRecords     = ref(0);
const lazyParams        = ref({
    first: 0,
    rows: 10,
    sortField: null,
    sortOrder: null,
    draw: 1,
    search: '',
});

const formCategory = ref({
    name: '',
    description: '',
});

const stats = ref({
  sparepart: undefined,
  oli: undefined,
  alat_berat: undefined,
  tooling: undefined,
  total: undefined
})

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Kategori' : 'Tambah Kategori');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data kategori di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan kategori baru.');

// Fungsi untuk menangani event close dari modal
const handleCloseModal = () => {
    const modalEl = document.getElementById('Modal'); 
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
    resetParentFormState(); 
};

// Tambahkan state untuk error validasi agar bisa digunakan di modal
const validationErrors = ref([]);

const handleSaveCategory = async () => {
    loading.value = true;
    validationErrors.value = []; // reset error sebelum submit
    try {
        // Ambil CSRF token
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token || document.querySelector('meta[name="csrf-token"]')?.content;
        const token = localStorage.getItem('token');
        let response;
        let url;

        // Validasi form sederhana
        if (!formCategory.value.name) {
            Swal.fire('Validasi', 'Nama kategori wajib diisi.', 'warning');
            loading.value = false;
            return;
        }

        if (isEditMode.value) {
            // Cari ID category dari form atau selectedMenuGroup
            let categoryIdToUpdate = formCategory.value?.id || selectedCategory.value?.id;
            if (!categoryIdToUpdate) {
                Swal.fire('Error', 'ID Kategori tidak ditemukan untuk update.', 'error');
                loading.value = false;
                return;
            }
            url = `${$api.categories()}/${categoryIdToUpdate}`;
            console.log('Updating category with ID:', categoryIdToUpdate, 'URL:', url);
            // Update data
            response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify({
                    name : formCategory.value.name,
                    description : formCategory.value.description,
                }),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
        } else {
            // Create baru
            url = $api.categories();
            response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    name : formCategory.value.name,
                    description : formCategory.value.description,
                }),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
        }

        if (response.ok) {
            await loadLazyData();
            handleCloseModal();
            await Swal.fire(
                'Berhasil!',
                `Kategori berhasil ${isEditMode.value ? 'diperbarui' : 'dibuat'}.`,
                'success'
            );
        } else {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: 'Gagal memproses respons server.' };
            }
            if (errorData.errors) {
                validationErrors.value = Array.isArray(errorData.errors)
                    ? errorData.errors
                    : Object.values(errorData.errors).flat();
                Swal.fire('Gagal', 'Terdapat kesalahan validasi data.', 'error');
            } else {
                Swal.fire('Gagal', errorData.message || `Gagal ${isEditMode.value ? 'memperbarui' : 'membuat'} kategori`, 'error');
            }
        }
    } catch (error) {
        Swal.fire('Error', error.message || 'Terjadi kesalahan saat menyimpan data kategori.', 'error');
    } finally {
        loading.value = false;
    }
};

const fetchStats = async () => {
  const defaultStats = {
    total: undefined,
    sparepart: undefined,
    oli: undefined,
    alat_berat: undefined,
    tooling: undefined,
  };
  try {
    const token = localStorage.getItem('token');
    const response = await fetch($api.countProductByCategory(), {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
      const result = await response.json();
      if (result && typeof result === 'object' && result !== null) {
        stats.value = {
            total: result.total,
            sparepart: result.sparepart,
            oli: result.oli,
            alat_berat: result.alat_berat,
            tooling: result.tooling,
        };
      } else {
        stats.value = defaultStats;
        console.warn('Data statistik dari API tidak dalam format objek yang diharapkan atau null:', result);
      }
    } else {
        stats.value = defaultStats;
        console.error('Gagal mengambil data statistik, status respons:', response.status);
    }
  } catch (error) {
    console.error('Gagal mengambil data statistik (exception):', error);
    stats.value = defaultStats;
  }
};

// Fungsi untuk menangani event load lazy data dari category
const loadLazyData = async () => {
    loading.value = true;
    try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
            page     : (lazyParams.value.first / lazyParams.value.rows) + 1,
            rows     : lazyParams.value.rows,
            sortField: lazyParams.value.sortField || '',
            sortOrder: lazyParams.value.sortOrder || '',
            draw     : lazyParams.value.draw || 1,
            search   : lazyParams.value.search || '',
        });

        const response = await fetch(`${$api.categories()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data category dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data category');
        }

        const result = await response.json();
        category.value = result.data || []; 
        totalRecords.value = parseInt(result.meta.total) || 0;
        if (result.draw) {
             lazyParams.value.draw = parseInt(result.draw);
        }

    } catch (error) {
        console.error('Error loading lazy data for category:', error);
        category.value = [];
        totalRecords.value = 0;
        Swal.fire('Error', `Tidak dapat memuat data category: ${error.message}`, 'error');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadLazyData();
    fetchStats();
});

const onPage = (event) => {
    lazyParams.value.first = event.first;
    lazyParams.value.rows = event.rows;
    loadLazyData();
};

const handleRowsChange = () => {
    lazyParams.value.first = 0;
    loadLazyData();
};

const handleSearch = () => {
    lazyParams.value.first = 0;
    loadLazyData();
};

const onSort = (event) => {
    lazyParams.value.sortField = event.sortField;
    lazyParams.value.sortOrder = event.sortOrder;
    loadLazyData();
};

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    } else if (format === 'pdf') {
        myDataTableRef.value.exportPDF();
    }
};

const openAddCategoryModal = () => {
    isEditMode.value = false;
    modalTitle.value = 'Tambah Category';
    modalDescription.value = 'Silakan isi form di bawah ini untuk menambahkan category baru.';
    resetParentFormState();
};

async function openEditCategoryModal(categoryData) {
    isEditMode.value = true;
    // Ambil data category saat modal terbuka
    selectedCategory.value = JSON.parse(JSON.stringify(categoryData));
    formCategory.value = {
        id: categoryData.id,
        name: categoryData.name || '',
        description: categoryData.description || ''
    };
    validationErrors.value = [];

    const modalEl = document.getElementById('Modal');
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
    } else {
        console.error('CategoryModal element tidak ditemukan atau Bootstrap belum dimuat.');
    }
}

const deleteCategory = async (idCategory) => {
    if (!idCategory) return;

    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#666CFF',
        cancelButtonColor: '#A7A9B3',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            let url;

            const token = localStorage.getItem('token');
            // Ambil CSRF token
            const csrfResponse = await fetch($api.csrfToken(), {
                credentials: 'include'
            });
            const csrfData  = await csrfResponse.json();
            const csrfToken = csrfData.token;

            url = `${$api.categories()}/${idCategory}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type' : 'application/json',
                    'X-CSRF-TOKEN' : csrfToken
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus category');
            }

            loadLazyData();

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Category berhasil dihapus.',
                icon: 'success'
            });

        } catch (error) {
            await Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        }
    }
};

const resetParentFormState = () => {
    formCategory.value = {
        name: '',
        description: '',
    };
};
</script>