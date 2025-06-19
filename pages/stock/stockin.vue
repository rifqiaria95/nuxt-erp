<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Stock In</h4>
            <p class="mb-6">
            List stock in yang terdaftar di sistem
            </p>
            <!-- stock in cards -->
            <div class="row g-6 mb-6">
                <CardBox
                    v-if="stats.total !== undefined"
                    title="Total Stock In"
                    :total="stats.total + ' Stock In'"
                />
                <CardBox
                    v-if="stats.draft !== undefined"
                    title="Total Stock In Draft"
                    :total="stats.draft + ' Stock In'"
                />
                <CardBox
                    v-if="stats.posted !== undefined"
                    title="Total Stock In Posted"
                    :total="stats.posted + ' Stock In'"
                />
            </div>
            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Stock In</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Stock In.</p>
                </div>
                <div class="col-12">
                    <!-- stock in Table -->
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
                                            placeholder="Cari Stock In..."
                                            class="w-full md:w-20rem"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="stockIn" 
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
                                <Column header="#" :sortable="false">
                                    <template #body="slotProps">
                                        {{
                                            Number.isFinite(lazyParams.page) && Number.isFinite(lazyParams.rows)
                                            ? ((lazyParams.page - 1) * lazyParams.rows + slotProps.index + 1)
                                            : (slotProps.index + 1)
                                        }}
                                    </template>
                                </Column>
                                <Column field="noSi" header="No. Stock In" :sortable="true">
                                    <template #body="slotProps">
                                        <span class="badge bg-primary">
                                            {{ slotProps.data.noSi }}
                                        </span>
                                    </template>
                                </Column>
                                <Column field="date" header="Tanggal" :sortable="true" style="width:10%">
                                    <template #body="slotProps">
                                        {{ slotProps.data.date ? new Date(slotProps.data.date).toLocaleDateString() : '-' }}
                                    </template>
                                </Column>
                                <Column field="purchaseOrder.noPo" header="No. PO" :sortable="true" class="text-nowrap"></Column>
                                <Column field="status" header="Status" :sortable="true">
                                    <template #body="slotProps">
                                        <span :class="getStatusBadge(slotProps.data.status).class">
                                            {{ getStatusBadge(slotProps.data.status).text }}
                                        </span>
                                    </template>
                                </Column>
                                <Column field="warehouse.name" header="Gudang" :sortable="true"></Column>
                                <Column header="Produk Diterima" style="min-width:10rem">
                                    <template #body="slotProps">
                                        <div v-if="slotProps.data.purchaseOrder && slotProps.data.purchaseOrder.purchaseOrderItems && slotProps.data.purchaseOrder.purchaseOrderItems.length">
                                            <ul class="list-unstyled mb-0">
                                                <li v-for="item in slotProps.data.purchaseOrder.purchaseOrderItems" :key="item.id">
                                                    <span class="fw-bold">{{ item.product?.name || 'N/A' }}:</span>
                                                    {{
                                                        (item.receivedQty !== undefined && item.receivedQty !== null)
                                                        ? String(item.receivedQty).replace(/\.00$/, '')
                                                        : 0
                                                    }} / {{
                                                        (item.quantity !== undefined && item.quantity !== null)
                                                        ? String(item.quantity).replace(/\.00$/, '')
                                                        : 0
                                                    }}
                                                </li>
                                            </ul>
                                        </div>
                                        <span v-else>-</span>
                                    </template>
                                </Column>
                                <Column field="user.fullName" header="Penerima" :sortable="true"></Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <div class="d-inline-block">
                                            <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li v-if="userisAdmin || userisSuperAdmin && slotProps.data.status == 'draft'">
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="postStockIn(slotProps.data.id)">
                                                        <i class="ri-upload-2-line me-2"></i> Post
                                                    </a>
                                                </li>
                                                <li v-if="slotProps.data.status == 'posted'">
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="viewStockInDetails(slotProps.data.id)">
                                                        <i class="ri-eye-line me-2"></i> Lihat Detail
                                                    </a>
                                                </li>
                                                <li v-if="userisSuperAdmin || (!userisSuperAdmin && slotProps.data.status == 'draft')">
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="openEditStockInModal(slotProps.data)">
                                                        <i class="ri-edit-box-line me-2"></i> Edit
                                                    </a>
                                                </li>
                                                <li v-if="userisSuperAdmin || (!userisSuperAdmin && slotProps.data.status == 'Received')">
                                                    <a class="dropdown-item text-danger" href="javascript:void(0)" @click="deleteStockIn(slotProps.data.id)">
                                                        <i class="ri-delete-bin-7-line me-2"></i> Hapus
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </template>
                                </Column>
                        </MyDataTable>
                        </div>
                    </div>
                    <!--/ stock in Table -->
                </div>
            </div>
            <!--/ stock in cards -->

            <!-- Placeholder untuk Stock InModal component -->
            <Modal 
                :isEditMode="isEditMode"
                :validationErrorsFromParent="validationErrors"
                :title="modalTitle" 
                :description="modalDescription"
                :selectedStockIn="selectedStockIn"
            >
                <template #default>
                    <form @submit.prevent="handleSaveStockIn">
                        <div class="row g-6">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="name" 
                                        v-model="formStockIn.noSi" 
                                        placeholder="Masukkan no SI"
                                        required
                                    >
                                    <label for="name">No SI</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="date" 
                                        class="form-control" 
                                        id="date" 
                                        v-model="formStockIn.date" 
                                        placeholder="Masukkan tanggal"
                                        required
                                    >
                                    <label for="name">Tanggal</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="formStockIn.warehouseId"
                                        :options="warehouses"
                                        label="name"
                                        :reduce="warehouse => warehouse.id"
                                        placeholder="-- Pilih Gudang --"
                                        class="warehouse-select"
                                    />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="formStockIn.status"
                                        :options="status"
                                        label="label"
                                        :reduce="status => status.value"
                                        placeholder="-- Pilih Status --"
                                        class="status-select"
                                    />
                                </div>
                            </div>
                            <div class="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    class="btn btn-primary me-2"
                                    @click="handleSaveStockIn"
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
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
import { useStockStore } from '~/stores/stockin'
import { useWarehouseStore } from '~/stores/warehouse'
import Modal from '~/components/modal/Modal.vue'
import CardBox from '~/components/cards/Cards.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Swal from 'sweetalert2'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const { $api } = useNuxtApp()

const myDataTableRef            = ref(null)
const userStore                 = useUserStore()
const stockInStore              = useStockStore()
const warehouseStore            = useWarehouseStore()
const { stats }                 = storeToRefs(stockInStore)
const { warehouse: warehouses } = storeToRefs(warehouseStore)
const selectedStockIn           = ref(null);
const stockIn                   = ref([])
const loading                   = ref(false);
const isEditMode                = ref(false);
const totalRecords              = ref(0);
const globalFilterValue         = ref('');
const lazyParams                = ref({
    first: 0,
    rows: 10,
    sortField: null,
    sortOrder: null,
    draw: 1,
    search: '',
});

const userisSuperAdmin = computed(() => {
    return userStore.user?.roles?.some(role => role.name === 'superadmin') ?? false;
});

const userisAdmin = computed(() => {
    return userStore.user?.roles?.some(role => role.name === 'admin') ?? false;
});

const formStockIn = ref({
  noSi: '',
  date: '',
  warehouseId: null,
  status: '',
});

const status       = ref([
    { label: 'Draft', value: 'draft' },
    { label: 'Posted', value: 'posted' },
]);

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Stock In' : 'Tambah Stock In');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data stock in di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan stock in baru.');

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

const handleSaveStockIn = async () => {
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
        if (!formStockIn.value.noSi) {
            Swal.fire('Validasi', 'No SI wajib diisi.', 'warning');
            loading.value = false;
            return;
        }

        if (isEditMode.value) {
            // Cari ID jabatan dari form atau selectedMenuGroup
            let stockInIdToUpdate = formStockIn.value?.id || selectedStockIn.value?.id;
            if (!stockInIdToUpdate) {
                Swal.fire('Error', 'ID Stock In tidak ditemukan untuk update.', 'error');
                loading.value = false;
                return;
            }
            url = `${$api.stockIn()}/${stockInIdToUpdate}`;
            console.log('Updating stock in with ID:', stockInIdToUpdate, 'URL:', url);
            // Update data
            response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify({
                    noSi       : formStockIn.value.noSi,
                    date       : formStockIn.value.date,
                    warehouseId: formStockIn.value.warehouseId,
                    status     : formStockIn.value.status,
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
            url = $api.stockIn();
            response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    noSi       : formStockIn.value.noSi,
                    date       : formStockIn.value.date,
                    warehouseId: formStockIn.value.warehouseId,
                    status     : 'draft',
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
                `Stock In berhasil ${isEditMode.value ? 'diperbarui' : 'dibuat'}.`,
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
                Swal.fire('Gagal', errorData.message || `Gagal ${isEditMode.value ? 'memperbarui' : 'membuat'} stock in`, 'error');
            }
        }
    } catch (error) {
        Swal.fire('Error', error.message || 'Terjadi kesalahan saat menyimpan data stock in.', 'error');
    } finally {
        loading.value = false;
    }
};

const postStockIn = async (id) => {
    try {
        await stockInStore.postStockIn(id);
        await loadLazyData();
        await Swal.fire(
            'Berhasil!',
            `Stock In berhasil diposting.`,
            'success'
        );
    } catch (error) {
        let errorMessage = 'Gagal memposting stock in';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        
        // Coba parsing error jika itu adalah string JSON
        try {
            const parsedError = JSON.parse(errorMessage);
            if (parsedError.errors) {
                 validationErrors.value = Array.isArray(parsedError.errors)
                    ? parsedError.errors
                    : Object.values(parsedError.errors).flat();
                return Swal.fire('Gagal', 'Terdapat kesalahan validasi data.', 'error');
            }
             errorMessage = parsedError.message || errorMessage;
        } catch (e) {
            // Biarkan errorMessage seperti apa adanya jika bukan JSON
        }
        
        await Swal.fire('Error', errorMessage, 'error');
    }
};

// Fungsi untuk menangani event load lazy data dari jabatan
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

        const response = await fetch(`${$api.stockIn()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data stock in dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data stock in');
        }

        const result = await response.json();
        stockIn.value = result.data || []; 
        totalRecords.value = parseInt(result.meta.total) || 0;
        if (result.draw) {
             lazyParams.value.draw = parseInt(result.draw);
        }

    } catch (error) {
        console.error('Error loading lazy data for stock in:', error);
        stockIn.value = [];
        totalRecords.value = 0;
        Swal.fire('Error', `Tidak dapat memuat data stock in: ${error.message}`, 'error');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadLazyData();
    stockInStore.fetchStats();
    warehouseStore.fetchWarehouse();
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

// View Stock In Details
const viewStockInDetails = (stockInId) => {
    const url = `${$api.getStockInDetails(stockInId)}`;
    window.open(url, '__blank');
};

async function openEditStockInModal(stockInData) {
    isEditMode.value = true;
    // Ambil data stock in saat modal terbuka
    selectedStockIn.value = JSON.parse(JSON.stringify(stockInData));
    formStockIn.value = {
        id         : stockInData.id,
        noSi       : stockInData.noSi || '',
        date       : stockInData.date ? new Date(stockInData.date).toISOString().slice(0, 10) : '',
        warehouseId: stockInData.warehouse ? stockInData.warehouse.id : null,
        status     : stockInData.status || 'draft',
    };
    validationErrors.value = [];

    const modalEl = document.getElementById('Modal');
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
    } else {
        console.error('Stock InModal element tidak ditemukan atau Bootstrap belum dimuat.');
    }
}

const deleteStockIn = async (id) => {
    if (!id) return;

    const result = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Tindakan ini tidak bisa dibatalkan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#666CFF',
        cancelButtonColor: '#A7A9B3',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        try {
            await stockInStore.deleteStockIn(id);
            loadLazyData(); // Muat ulang data
            await Swal.fire({
                title: 'Berhasil!',
                text: 'Stock In berhasil dihapus.',
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

const getStatusBadge = (status) => {
    switch (status) {
        case 'draft':
            return { text: 'Draft', class: 'badge rounded-pill bg-label-secondary' };
        case 'posted':
            return { text: 'Posted', class: 'badge rounded-pill bg-label-success' };
    }
};

const resetParentFormState = () => {
    formStockIn.value = {
        noSi: '',
        date: '',
        warehouseId: null,
        status: '',
    };
};
</script>

<style scoped>
    :deep(.status-select .vs__dropdown-toggle) ,
    :deep(.warehouse-select .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>