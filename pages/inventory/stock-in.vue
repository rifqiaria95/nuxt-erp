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
                                <Dropdown v-model="params.rows" :options="rowsPerPageOptionsArray" @change="stockInStore.handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
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
                            :data="stockIns" 
                            :rows="params.rows" 
                            :loading="loading"
                            :totalRecords="totalRecords"
                            :lazy="true"
                            @page="stockInStore.setPagination($event)"
                            @sort="stockInStore.setSort($event)"
                            responsiveLayout="scroll" 
                            paginatorPosition="bottom"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} data"
                            >
                                <Column header="#" :sortable="false">
                                    <template #body="slotProps">
                                        {{
                                            Number.isFinite(params.page) && Number.isFinite(params.rows)
                                            ? ((params.page - 1) * params.rows + slotProps.index + 1)
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
                                <Column field="purchaseOrder.noPo" header="No. PO" :sortable="true" class="text-nowrap">
                                    <template #body="slotProps">
                                        <a 
                                            :href="`/purchasing/purchase-order-detail?id=${slotProps.data.purchaseOrder?.id}`" 
                                            class="text-primary text-decoration-underline"
                                            title="Lihat Detail PO"
                                            v-if="slotProps.data.purchaseOrder && slotProps.data.purchaseOrder.noPo"
                                        >
                                            {{ slotProps.data.purchaseOrder.noPo }}
                                        </a>
                                        <span v-else>-</span>
                                    </template>
                                </Column>
                                <Column field="status" header="Status" :sortable="true">
                                    <template #body="slotProps">
                                        <span :class="getStatusBadge(slotProps.data.status).class">
                                            {{ getStatusBadge(slotProps.data.status).text }}
                                        </span>
                                    </template>
                                </Column>
                                <Column field="warehouse.name" header="Gudang" :sortable="true"></Column>
                                <Column field="purchaseOrder.receivedByUser.fullName" header="Penerima" :sortable="true"></Column>
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
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="stockInStore.openModal(slotProps.data)">
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
                                        v-model="form.noSi" 
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
                                        v-model="form.date" 
                                        placeholder="Masukkan tanggal"
                                        required
                                    >
                                    <label for="name">Tanggal</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="form.warehouseId"
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
                                        v-model="form.status"
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
                                <button type="button" class="btn btn-secondary" @click="stockInStore.closeModal()">
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
import { useRouter } from 'vue-router'

const { $api } = useNuxtApp()

const myDataTableRef            = ref(null)
const userStore                 = useUserStore()
const stockInStore              = useStockStore()
const warehouseStore            = useWarehouseStore()
const { stockIns, totalRecords, stats, params, form, isEditMode, showModal, validationErrors } = storeToRefs(stockInStore)
const { warehouse: warehouses } = storeToRefs(warehouseStore)
const selectedStockIn           = ref(null);
const loading                   = ref(false);
const globalFilterValue         = ref('');
const router                    = useRouter()

const userisSuperAdmin = computed(() => {
    return userStore.user?.roles?.some(role => role.name === 'superadmin') ?? false;
});

const userisAdmin = computed(() => {
    return userStore.user?.roles?.some(role => role.name === 'admin') ?? false;
});

const status       = ref([
    { label: 'Draft', value: 'draft' },
    { label: 'Posted', value: 'posted' },
]);

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Stock In' : 'Tambah Stock In');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data stock in di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan stock in baru.');

// Fungsi untuk menangani event close dari modal
watch(showModal, (newValue) => {
    const modalEl = document.getElementById('Modal');
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        if (newValue) {
            modalInstance.show();
        } else {
            modalInstance.hide();
        }
    }
});

let searchDebounceTimer = null;
watch(globalFilterValue, (newValue) => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(() => {
        stockInStore.setSearch(newValue);
    }, 500);
});

onBeforeUnmount(() => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }
});

const handleSaveStockIn = async () => {
    if (!form.value.noSi) {
        toast('warning', 'No SI wajib diisi.');
        return;
    }

    try {
        await stockInStore.saveStockIn();
        await stockInStore.fetchStockInsPaginated();
        stockInStore.closeModal();
        toast('success', `Stock In berhasil ${isEditMode.value ? 'diperbarui' : 'dibuat'}.`);
    } catch (error) {
        const errorData = error;
        if (errorData.errors) {
            stockInStore.validationErrors = Array.isArray(errorData.errors)
                ? errorData.errors
                : Object.values(errorData.errors).flat();
            toast('error', 'Terdapat kesalahan validasi data.');
        } else {
            toast('error', errorData.message || `Gagal ${isEditMode.value ? 'memperbarui' : 'membuat'} stock in`);
        }
    }
};

const postStockIn = async (id) => {
    try {
        await stockInStore.postStockIn(id);
        await stockInStore.fetchStockInsPaginated();
        toast('success', `Stock In berhasil diposting.`);
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
                 stockInStore.validationErrors = Array.isArray(parsedError.errors)
                    ? parsedError.errors
                    : Object.values(parsedError.errors).flat();
                return toast('error', 'Terdapat kesalahan validasi data.');
            }
             errorMessage = parsedError.message || errorMessage;
        } catch (e) {
            // Biarkan errorMessage seperti apa adanya jika bukan JSON
        }
        
        toast('error', errorMessage);
    }
};

// Fungsi untuk menangani event load lazy data dari jabatan
const loadLazyData = async () => {
    try {
        await stockInStore.fetchStockInsPaginated();
    } catch (error) {
        const error_message = error.message;
        toast('error', `Tidak dapat memuat data stock in: ${error_message}`);
    }
};

onMounted(() => {
    loadLazyData();
    stockInStore.fetchStats();
    warehouseStore.fetchWarehouses();
});

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    } else if (format === 'pdf') {
        myDataTableRef.value.exportPDF();
    }
};

// View Stock In Details
const viewStockInDetails = (stockInId) => {
    router.push({ path: `/inventory/stock-in-detail`, query: { id: stockInId } });
};

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
            toast('success', 'Stock In berhasil dihapus.');

        } catch (error) {
            toast('error', error.message);
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
</script>

<style scoped>
    :deep(.status-select .vs__dropdown-toggle) ,
    :deep(.warehouse-select .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>