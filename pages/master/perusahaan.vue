<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Perusahaan</h4>
            <p class="mb-6">
            List perusahaan yang terdaftar di sistem
            </p>
            <!-- perusahaan cards -->
            <div class="row g-6">
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                        <p class="mb-0">Total 3 users</p>
                        <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Kim Karlos"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/3.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Katy Turner"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/9.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Peter Adward"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/15.png" alt="Avatar" />
                            </li>
                            <li class="avatar">
                            <span
                                class="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                data-bs-toggle="tooltip"
                                data-bs-placement="bottom"
                                title="3 more"
                                >+3</span
                            >
                            </li>
                        </ul>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                        <div class="pegawai-heading">
                            <h5 class="mb-1">Support</h5>
                            <a
                            href="javascript:;"
                            data-bs-toggle="modal"
                            data-bs-target="#PegawaiModal"
                            class="pegawai-edit-modal">
                            </a>
                        </div>
                        <a href="javascript:void(0);" class="text-secondary"
                            ><i class="ri-file-copy-line ri-22px"></i
                        ></a>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                        <p class="mb-0">Total 2 users</p>
                        <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Kim Merchent"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/10.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Sam D'souza"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/13.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Nurvi Karlos"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/15.png" alt="Avatar" />
                            </li>
                            <li class="avatar">
                            <span
                                class="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                data-bs-toggle="tooltip"
                                data-bs-placement="bottom"
                                title="3 more"
                                >+3</span
                            >
                            </li>
                        </ul>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                        <div class="pegawai-heading">
                            <h5 class="mb-1">Restricted User</h5>
                            <a
                            href="javascript:;"
                            data-bs-toggle="modal"
                            data-bs-target="#PegawaiModal"
                            class="pegawai-edit-modal">
                            </a>
                        </div>
                        <a href="javascript:void(0);" class="text-secondary"
                            ><i class="ri-file-copy-line ri-22px"></i
                        ></a>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card h-100">
                    <div class="row h-100">
                        <div class="col-5">
                        <div class="d-flex align-items-end h-100 justify-content-center">
                            <img
                            src="/img/illustrations/add-new-role-illustration.png"
                            class="img-fluid"
                            alt="Image"
                            width="68" />
                        </div>
                        </div>
                        <div class="col-7">
                        <div class="card-body text-sm-end text-center ps-sm-0">
                            <button
                            data-bs-target="#Modal"
                            data-bs-toggle="modal"
                            class="btn btn-sm btn-primary mb-4 ml-5 textwrap add-new-pegawai"
                            @click="openAddPerusahaanModal"
                            >
                            Tambah Perusahaan
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Perusahaan</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Perusahaan.</p>
                </div>
                <div class="col-12">
                    <!-- perusahaan Table -->
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
                                <div class="input-group">
                                    <span class="p-input-icon-left">
                                        <InputText
                                            v-model="globalFilterValue"
                                            placeholder="Cari perusahaan..."
                                            class="w-full md:w-20rem"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="perusahaan" 
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
                                <Column field="nmPerusahaan" header="Nama Perusahaan" :sortable="true"></Column>
                                <Column field="alamatPerusahaan" header="Alamat Perusahaan" :sortable="true"></Column>
                                <Column field="npwpPerusahaan" header="NPWP Perusahaan" :sortable="true"></Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <button @click="openEditPerusahaanModal(slotProps.data)" class="btn btn-sm btn-icon      btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line"></i></button>
                                        <button @click="deletePerusahaan(slotProps.data.id)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line"></i></button>
                                    </template>
                                </Column>
                        </MyDataTable>
                        </div>
                    </div>
                    <!--/ perusahaan Table -->
                </div>
            </div>
            <!--/ perusahaan cards -->

            <!-- Placeholder untuk MenuModal component -->
            <Modal 
                :isEditMode="isEditMode"
                :validationErrorsFromParent="validationErrors"
                :title="modalTitle" 
                :description="modalDescription"
                :selectedPerusahaan="selectedPerusahaan"
            >
                <template #default>
                    <form @submit.prevent="handleSubmit">
                        <div class="row g-6">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="kodePerusahaan" 
                                        v-model="formPerusahaan.kode_perusahaan" 
                                        placeholder="Masukkan kode perusahaan"
                                        required
                                    >
                                    <label for="kodePerusahaan">Kode Perusahaan</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="nmPerusahaan" 
                                        v-model="formPerusahaan.nm_perusahaan" 
                                        placeholder="Masukkan nama perusahaan"
                                        required
                                    >
                                    <label for="nmPerusahaan">Nama Perusahaan</label>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    id="npwpPerusahaan" 
                                    v-model="formPerusahaan.npwp_perusahaan" 
                                    placeholder="Masukkan npwp perusahaan"
                                    @input="formPerusahaan.npwp_perusahaan = $event.target.value.replace(/[^0-9]/g, '')"
                                    inputmode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    >
                                    <label for="npwpPerusahaan">NPWP Perusahaan</label>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <textarea
                                        class="form-control h-px-100"
                                        id="alamat_perusahaan"
                                        placeholder="Alamat Perusahaan"
                                        v-model="formPerusahaan.alamat_perusahaan">
                                    </textarea>
                                    <label for="alamat_perusahaan">Alamat Perusahaan</label>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    class="btn btn-primary me-2"
                                    @click="handleSavePerusahaan"
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
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Swal from 'sweetalert2'
import { usePerusahaanStore } from '~/stores/perusahaan'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'

const { $api } = useNuxtApp()

const myDataTableRef = ref(null)
const perusahaanStore    = usePerusahaanStore()
const selectedPerusahaan = ref(null);
const perusahaan         = ref([])
const loading           = ref(false);
const isEditMode        = ref(false);
const totalRecords      = ref(0);
const globalFilterValue = ref('');
const lazyParams        = ref({
    first: 0,
    rows: 10,
    sortField: null,
    sortOrder: null,
    draw: 1,
    search: '',
});

const formPerusahaan = ref({
  kode_perusahaan: '',
  nm_perusahaan: '',
  npwp_perusahaan: '',
  alamat_perusahaan: ''
});

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Perusahaan' : 'Tambah Perusahaan');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data perusahaan di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan perusahaan baru.');

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

let searchDebounceTimer = null;
watch(globalFilterValue, (newValue) => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(() => {
        lazyParams.value.search = newValue;
        lazyParams.value.first = 0;
        loadLazyData();
    }, 500);
});

onBeforeUnmount(() => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }
});

// Tambahkan state untuk error validasi agar bisa digunakan di modal
const validationErrors = ref([]);

const handleSavePerusahaan = async () => {
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
        if (!formPerusahaan.value.nm_perusahaan || !formPerusahaan.value.npwp_perusahaan) {
            Swal.fire('Validasi', 'Nama dan NPWP perusahaan wajib diisi.', 'warning');
            loading.value = false;
            return;
        }

        if (isEditMode.value) {
            // Cari ID perusahaan dari form atau selectedPerusahaan
            let perusahaanIdToUpdate = formPerusahaan.value?.id || formPerusahaan.value?.idPerusahaan;
            if (!perusahaanIdToUpdate && selectedPerusahaan.value) {
                perusahaanIdToUpdate = selectedPerusahaan.value.id || selectedPerusahaan.value.idPerusahaan;
            }
            if (!perusahaanIdToUpdate) {
                Swal.fire('Error', 'ID Perusahaan tidak ditemukan untuk update.', 'error');
                loading.value = false;
                return;
            }
            url = `${$api.perusahaan()}/${perusahaanIdToUpdate}`;
            console.log('Updating perusahaan with ID:', perusahaanIdToUpdate, 'URL:', url);
            // Update data
            response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify({
                    kode_perusahaan    : formPerusahaan.value.kode_perusahaan,
                    nm_perusahaan      : formPerusahaan.value.nm_perusahaan,
                    npwp_perusahaan    : formPerusahaan.value.npwp_perusahaan,
                    alamat_perusahaan  : formPerusahaan.value.alamat_perusahaan,
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
            url = $api.perusahaan();
            response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    kode_perusahaan    : formPerusahaan.value.kode_perusahaan,
                    nm_perusahaan      : formPerusahaan.value.nm_perusahaan,
                    npwp_perusahaan    : formPerusahaan.value.npwp_perusahaan,
                    alamat_perusahaan  : formPerusahaan.value.alamat_perusahaan,
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
                `Perusahaan berhasil ${isEditMode.value ? 'diperbarui' : 'dibuat'}.`,
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
                Swal.fire('Gagal', errorData.message || `Gagal ${isEditMode.value ? 'memperbarui' : 'membuat'} perusahaan`, 'error');
            }
        }
    } catch (error) {
        Swal.fire('Error', error.message || 'Terjadi kesalahan saat menyimpan data perusahaan.', 'error');
    } finally {
        loading.value = false;
    }
};

// Fungsi untuk menangani event load lazy data dari perusahaan
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

        const response = await fetch(`${$api.perusahaan()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data perusahaan dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data perusahaan');
        }

        const result = await response.json();
        perusahaan.value = result.data || []; 
        totalRecords.value = parseInt(result.meta.total) || 0;
        if (result.draw) {
             lazyParams.value.draw = parseInt(result.draw);
        }

    } catch (error) {
        console.error('Error loading lazy data for perusahaan:', error);
        perusahaan.value = [];
        totalRecords.value = 0;
        Swal.fire('Error', `Tidak dapat memuat data perusahaan: ${error.message}`, 'error');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadLazyData();
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

const openAddPerusahaanModal = () => {
    isEditMode.value = false;
    modalTitle.value = 'Tambah Perusahaan';
    modalDescription.value = 'Silakan isi form di bawah ini untuk menambahkan perusahaan baru.';
    resetParentFormState();
};

async function openEditPerusahaanModal(perusahaanData) {
    isEditMode.value = true;
    // Mapping manual dari response API ke field form
    selectedPerusahaan.value = { ...perusahaanData };
    formPerusahaan.value = {
        kode_perusahaan: perusahaanData.kode_perusahaan ?? perusahaanData.kodePerusahaan ?? '',
        nm_perusahaan: perusahaanData.nm_perusahaan ?? perusahaanData.nmPerusahaan ?? '',
        npwp_perusahaan: perusahaanData.npwp_perusahaan ?? perusahaanData.npwpPerusahaan ?? '',
        alamat_perusahaan: perusahaanData.alamat_perusahaan ?? perusahaanData.alamatPerusahaan ?? ''
    };
    validationErrors.value = [];

    // Tunggu DOM update agar binding form sudah siap sebelum show modal
    await nextTick();

    const modalEl = document.getElementById('Modal');
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
    } else {
        console.error('PerusahaanModal element tidak ditemukan atau Bootstrap belum dimuat.');
    }
}

const deletePerusahaan = async (perusahaanId) => {
    if (!perusahaanId) return;

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

            url = `${$api.perusahaan()}/${perusahaanId}`;

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
                throw new Error(errorData.message || 'Gagal menghapus perusahaan');
            }

            loadLazyData();

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Perusahaan berhasil dihapus.',
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
    formPerusahaan.value = {
        kode_perusahaan: '',
        nm_perusahaan: '',
        npwp_perusahaan: '',
        alamat_perusahaan: ''
    };
};
</script>