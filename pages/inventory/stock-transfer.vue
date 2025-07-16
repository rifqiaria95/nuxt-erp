<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Stock Transfer</h4>
            <p class="mb-6">
            List stock transfer yang terdaftar di sistem
            </p>
            <!-- Stock Transfer cards -->
            <div class="row g-6 mb-6">
                <CardBox
                    v-if="stats.total !== undefined"
                    title="Total Stock Transfer"
                    :total="stats.total + ' Stock Transfer'"
                />
                <CardBox
                    v-if="stats.draft !== undefined"
                    title="Total Stock Transfer Draft"
                    :total="stats.draft + ' Stock Transfer'"
                />
                <CardBox
                    v-if="stats.approved !== undefined"
                    title="Total Stock Transfer Approved"
                    :total="stats.approved + ' Stock Transfer'"
                />
                <CardBox
                    v-if="stats.rejected !== undefined"
                    title="Total Stock Transfer Rejected"
                    :total="stats.rejected + ' Stock Transfer'"
                />
                <CardBox
                    v-if="userHasRole('superadmin') || userHasPermission('create_stock_transfer')"
                    :isAddButtonCard="true"
                    image-src="/img/illustrations/add-new-role-illustration.png"
                    image-alt="Tambah Stock Transfer"
                    button-text="Tambah Stock Transfer"
                    modal-target="#Modal" 
                    @button-click="stockTransferStore.openModal()"
                />
            </div>
            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Stock Transfer</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Stock Transfer.</p>
                </div>
                <div class="col-12">
                    <!-- stock transfer Table -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                            <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                <span class="me-2">Baris:</span>
                                <Dropdown v-model="params.rows" :options="rowsPerPageOptionsArray" @change="stockTransferStore.handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
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
                                            placeholder="Cari Stock Transfer..."
                                            class="w-full md:w-20rem"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="stockTransfers" 
                            :rows="params.rows" 
                            :loading="loading"
                            :totalRecords="totalRecords"
                            :lazy="true"
                            @page="stockTransferStore.setPagination"
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
                                <Column field="noTransfer" header="No. Stock Transfer" :sortable="true">
                                    <template #body="slotProps">
                                        <span class="badge bg-primary">
                                            {{ slotProps.data.noTransfer }}
                                        </span>
                                    </template>
                                </Column>
                                <Column field="date" header="Tanggal" :sortable="true" style="width:10%">
                                    <template #body="slotProps">
                                        {{ slotProps.data.date ? new Date(slotProps.data.date).toLocaleDateString() : '-' }}
                                    </template>
                                </Column>
                                <Column field="perusahaan.nmPerusahaan" header="Perusahaan" :sortable="true" class="text-nowrap">
                                    <template #body="slotProps">
                                        {{ slotProps.data.perusahaan?.nmPerusahaan || '-' }}
                                    </template>
                                </Column>
                                <Column field="cabang.nmCabang" header="Cabang" :sortable="true" class="text-nowrap">
                                    <template #body="slotProps">
                                        {{ slotProps.data.cabang?.nmCabang || '-' }}
                                    </template>
                                </Column>
                                <Column field="fromWarehouse.name" header="Gudang Asal" :sortable="true" class="text-nowrap">
                                    <template #body="slotProps">
                                        {{ slotProps.data.fromWarehouse?.name || '-' }}
                                    </template>
                                </Column>
                                <Column field="toWarehouse.name" header="Gudang Tujuan" :sortable="true" class="text-nowrap">
                                    <template #body="slotProps">
                                        {{ slotProps.data.toWarehouse?.name || '-' }}
                                    </template>
                                </Column>
                                <Column field="status" header="Status" :sortable="true">
                                    <template #body="slotProps">
                                        <span :class="getStatusBadge(slotProps.data.status).class">
                                            {{ getStatusBadge(slotProps.data.status).text }}
                                        </span>
                                    </template>
                                </Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <div class="d-inline-block">
                                            <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li v-if="userHasPermission('approve_stock_transfer') && slotProps.data.status == 'draft'">
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="approveStockTransfer(slotProps.data.id)">
                                                        <i class="ri-check-line me-2"></i> Approve
                                                    </a>
                                                </li>
                                                <li v-if="userHasPermission('show_stock_transfer') && slotProps.data.status == 'approved'">
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="viewStockTransferDetails(slotProps.data.id)">
                                                        <i class="ri-eye-line me-2"></i> Lihat Detail
                                                    </a>
                                                </li>
                                                <li v-if="userHasPermission('edit_stock_transfer') && slotProps.data.status == 'draft'">
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="stockTransferStore.openModal(slotProps.data)">
                                                        <i class="ri-edit-box-line me-2"></i> Edit
                                                    </a>
                                                </li>
                                                <li v-if="userHasRole('superadmin') || userHasPermission('delete_stock_transfer') && slotProps.data.status == 'draft'">
                                                    <a class="dropdown-item text-danger" href="javascript:void(0)" @click="deleteStockTransfer(slotProps.data.id)">
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
                    <!--/ Stock Transfer Table -->
                </div>
            </div>
            <!--/ Stock Transfer cards -->

            <!-- Placeholder untuk Stock TransferModal component -->
            <Modal 
                id="Modal"
                :isEditMode="isEditMode"
                :validationErrorsFromParent="validationErrors"
                :title="modalTitle" 
                :description="modalDescription"
                :selectedStockTransfer="selectedStockTransfer"
            >
                <template #default>
                    <form @submit.prevent="handleSaveStockTransfer">
                        <div class="row g-6">
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="hidden" 
                                        class="form-control" 
                                        id="name" 
                                        v-model="form.noTransfer" 
                                        placeholder="Masukkan No. Stock Transfer"
                                    >
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="form.perusahaanId"
                                        :options="perusahaans"
                                        label="nmPerusahaan"
                                        :reduce="p => p.id"
                                        placeholder="-- Pilih Perusahaan --"
                                        class="perusahaan-select"
                                    />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="form.cabangId"
                                        :options="filteredCabangs"
                                        label="nmCabang"
                                        :reduce="c => c.id" 
                                        placeholder="-- Pilih Cabang --"
                                        class="cabang-select"
                                    />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="form.fromWarehouseId"
                                        :options="warehouses"
                                        label="name"
                                        :reduce="warehouse => warehouse.id" 
                                        placeholder="-- Pilih Gudang Asal --"
                                        class="warehouse-select"
                                    />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="form.toWarehouseId"
                                        :options="warehouses"
                                        label="name"
                                        :reduce="warehouse => warehouse.id" 
                                        placeholder="-- Pilih Gudang Tujuan --"
                                        class="warehouse-select"
                                    />
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
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="description" 
                                        v-model="form.description" 
                                        placeholder="Masukkan deskripsi"
                                        required
                                    >
                                    <label for="description">Deskripsi</label>
                                </div>
                            </div>
                            <hr class="mt-7 w-70 justify-content-center" />
                            <div v-for="(item, index) in form.stockTransferItems" :key="index" class="repeater-item">
                                <div class="row">
                                    <div class="mb-4 col-lg-4 col-xl-4 col-12 mb-0">
                                        <div class="form-floating form-floating-outline stock-transfer-item-select">
                                            <v-select
                                                v-model="item.stock"
                                                :options="productsInWarehouse"
                                                :get-option-label="option => `${option.product.name} (${option.product.unit?.name})`"
                                                placeholder="-- Pilih Produk --"
                                              
                                            />
                                        </div>
                                    </div>
                                    <div class="mb-4 col-lg-2 col-xl-2 col-2 mb-0">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" :value="item.stock ? Math.floor(item.stock.quantity) : ''" class="form-control" placeholder="Stock" readonly>
                                            <label>Stock</label>
                                        </div>
                                    </div>
                                    <div class="mb-3 col-lg-4 col-xl-3 col-12 mb-0">
                                        <div class="form-floating form-floating-outline">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="Jumlah"
                                                :value="item.quantity"
                                                @input="e => {
                                                    const angka = e.target.value.replace(/[^0-9]/g, '');
                                                    item.quantity = angka;
                                                }"
                                            />
                                            <label>Jumlah</label>
                                        </div>
                                    </div>
                                    <div class="col-lg-2 col-xl-3 col-12 mt-1">
                                        <button @click.prevent="stockTransferStore.removeItem(index)" class="btn btn-outline-danger w-100">Hapus</button>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-0">
                                <button class="btn btn-sm btn-primary" @click.prevent="stockTransferStore.addItem()">
                                    <i class="ri-add-line me-1"></i>
                                    <span class="align-middle">Tambah Item</span>
                                </button>
                            </div> 
                            <div class="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    class="btn btn-primary me-2"
                                >
                                    {{ isEditMode ? 'Update' : 'Simpan' }}
                                </button>
                                <button type="button" class="btn btn-secondary" @click="stockTransferStore.closeModal()">
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
import { useStockTransferStore } from '~/stores/stock-transfer'
import { useWarehouseStore } from '~/stores/warehouse'
import { usePerusahaanStore } from '~/stores/perusahaan'
import { useCabangStore } from '~/stores/cabang'
import Modal from '~/components/modal/Modal.vue'
import CardBox from '~/components/cards/Cards.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Swal from 'sweetalert2'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { useRouter } from 'vue-router'
import { usePermissionsStore } from '~/stores/permissions'
import { usePermissions } from '~/composables/usePermissions'

const { $api } = useNuxtApp()

const myDataTableRef        = ref(null)
const userStore             = useUserStore()
const stockTransferStore    = useStockTransferStore()
const warehouseStore        = useWarehouseStore()
const permissionStore       = usePermissionsStore()
const perusahaanStore       = usePerusahaanStore()
const cabangStore           = useCabangStore()
const { userHasPermission, userHasRole } = usePermissions();
const { stockTransfers, totalRecords, stats, params, form, isEditMode, showModal, validationErrors, productsInWarehouse } = storeToRefs(stockTransferStore)
const { warehouseList: warehouses } = storeToRefs(warehouseStore)
const { perusahaans }       = storeToRefs(perusahaanStore)
const { cabangs }           = storeToRefs(cabangStore)
const selectedStockTransfer = ref(null);
const loading               = ref(false);
const globalFilterValue     = ref('');
const router                = useRouter()

const status       = ref([
    { label: 'Draft', value: 'draft' },
    { label: 'Approved', value: 'approved' },
]);

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Stock Transfer' : 'Tambah Stock Transfer');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data Stock Transfer di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan Stock Transfer baru.');

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
        stockTransferStore.setSearch(newValue);
    }, 500);
});

onBeforeUnmount(() => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }
});

watch(() => form.value.perusahaanId, (newPerusahaanId) => {
    if (newPerusahaanId) {
        if(!isEditMode.value) {
            form.value.cabangId = null;
        }
    }
});

const filteredCabangs = computed(() => {
    if (!form.value.perusahaanId || !cabangs.value) return [];
    return cabangs.value.filter(c => c.perusahaanId === form.value.perusahaanId);
});

watch(() => form.value.fromWarehouseId, (newWarehouseId, oldWarehouseId) => {
    if (newWarehouseId) {
        stockTransferStore.fetchProductsByWarehouse(newWarehouseId);
        if (oldWarehouseId && newWarehouseId !== oldWarehouseId) {
            form.value.stockTransferItems = [];
            stockTransferStore.addItem();
        }
    } else {
        stockTransferStore.productsInWarehouse = [];
        if (form.value.stockTransferItems) {
            form.value.stockTransferItems = [];
            stockTransferStore.addItem();
        }
    }
}, { immediate: false });

const handleSaveStockTransfer = async () => {
    if (!form.value.date) {
        return toast.fire('Validasi', 'Tanggal wajib diisi.', 'warning');
    }

    try {
        await stockTransferStore.saveStockTransfer();
        await stockTransferStore.fetchStockTransfersPaginated();
        stockTransferStore.closeModal();
        toast.fire(
            'Berhasil!',
            `Stock Transfer berhasil ${isEditMode.value ? 'diperbarui' : 'dibuat'}.`,
            'success'
        );
    } catch (error) {
        const errorData = error;
        if (errorData.errors) {
            stockTransferStore.validationErrors = Array.isArray(errorData.errors)
                ? errorData.errors
                : Object.values(errorData.errors).flat();
            toast.fire('Gagal', 'Terdapat kesalahan validasi data.', 'error');
        } else if(errorData.status === 422) {
            stockTransferStore.validationErrors = errorData.errors;
        } else {
            errorData.errors
        }
    }
};

const approveStockTransfer = async (id) => {
    try {
        await stockTransferStore.approveStockTransfer(id);
        await stockTransferStore.fetchStockTransfersPaginated();
    } catch (error) {
        let errorMessage = 'Gagal menyetujui Stock Transfer';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        
        // Coba parsing error jika itu adalah string JSON
        try {
            const parsedError = JSON.parse(errorMessage);
            if (parsedError.errors) {
                 stockTransferStore.validationErrors = Array.isArray(parsedError.errors)
                    ? parsedError.errors
                    : Object.values(parsedError.errors).flat();
                return toast.fire('Gagal', 'Terdapat kesalahan validasi data.', 'error');
            }
             errorMessage = parsedError.message || errorMessage;
        } catch (e) {
            // Biarkan errorMessage seperti apa adanya jika bukan JSON
        }
        
        await toast.fire('Error', errorMessage, 'error');
    }
};

// Fungsi untuk menangani event load lazy data dari jabatan
const loadLazyData = async () => {
    try {
        await stockTransferStore.fetchStockTransfersPaginated();
    } catch (error) {
        const error_message = error.message;
        toast.fire('Error', `Tidak dapat memuat data Stock Transfer: ${error_message}`, 'error');
    }
};

onMounted(() => {
    permissionStore.fetchPermissions();
    userStore.loadUser();
    loadLazyData();
    stockTransferStore.fetchStats();
    warehouseStore.fetchAllWarehouses();
    perusahaanStore.fetchPerusahaans();
    cabangStore.fetchCabangs();
});

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    } else if (format === 'pdf') {
        myDataTableRef.value.exportPDF();
    }
};

// View Stock Transfer Details
const viewStockTransferDetails = (stockTransferId) => {
    router.push({ path: `/inventory/stock-transfer-detail`, query: { id: stockTransferId } });
};

const deleteStockTransfer = async (id) => {
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
            await stockTransferStore.deleteStockTransfer(id);
            loadLazyData(); // Muat ulang data
            await toast.fire({
                title: 'Berhasil!',
                text: 'Stock Transfer berhasil dihapus.',
                icon: 'success'
            });

        } catch (error) {
            await toast.fire({
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
        case 'approved':
            return { text: 'Approved', class: 'badge rounded-pill bg-label-success' };
    }
};
</script>

<style scoped>
    :deep(.perusahaan-select .vs__dropdown-toggle),
    :deep(.cabang-select .vs__dropdown-toggle),
    :deep(.stock-transfer-item-select .vs__dropdown-toggle),
    :deep(.status-select .vs__dropdown-toggle) ,
    :deep(.warehouse-select .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>