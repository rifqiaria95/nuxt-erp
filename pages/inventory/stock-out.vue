<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Stock Out</h4>
            <p class="mb-6">
            List stock out yang terdaftar di sistem
            </p>
            <!-- stock in cards -->
            <div class="row g-6 mb-6">
                <CardBox
                    v-if="stats.total !== undefined"
                    title="Total Stock Out"
                    :total="stats.total + ' Stock Out'"
                />
                <CardBox
                    v-if="stats.draft !== undefined"
                    title="Total Stock Out Draft"
                    :total="stats.draft + ' Stock Out'"
                />
                <CardBox
                    v-if="stats.posted !== undefined"
                    title="Total Stock Out Posted"
                    :total="stats.posted + ' Stock Out'"
                />
            </div>
            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Stock Out</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Stock Out.</p>
                </div>
                <div class="col-12">
                    <!-- stock out Table -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                            <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                <span class="me-2">Baris:</span>
                                <Dropdown v-model="params.rows" :options="rowsPerPageOptionsArray" @change="stockOutStore.handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
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
                                            placeholder="Cari Stock Out..."
                                            class="w-full md:w-20rem"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="stockOuts" 
                            :rows="params.rows" 
                            :loading="loading"
                            :totalRecords="totalRecords"
                            :lazy="true"
                            @page="stockOutStore.setPagination($event)"
                            @sort="stockOutStore.setSort($event)"
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
                                <Column field="noSo" header="No. Stock Out" :sortable="true">
                                    <template #body="slotProps">
                                        <span class="badge bg-primary">
                                            {{ slotProps.data.noSo }}
                                        </span>
                                    </template>
                                </Column>
                                <Column field="date" header="Tanggal" :sortable="true" style="width:10%">
                                    <template #body="slotProps">
                                        {{ slotProps.data.date ? new Date(slotProps.data.date).toLocaleDateString() : '-' }}
                                    </template>
                                </Column>
                                <Column field="salesOrder.noSo" header="No. SO" :sortable="true" class="text-nowrap"></Column>
                                <Column field="status" header="Status" :sortable="true">
                                    <template #body="slotProps">
                                        <span :class="getStatusBadge(slotProps.data.status).class">
                                            {{ getStatusBadge(slotProps.data.status).text }}
                                        </span>
                                    </template>
                                </Column>
                                <Column field="warehouse.name" header="Gudang" :sortable="true"></Column>
                                <Column field="postedByUser.fullName" header="Pengirim" :sortable="true"></Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <div class="d-inline-block">
                                            <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li v-if="userHasRole('superadmin') || (userHasPermission('approve_stock_out') && slotProps.data.status == 'draft')">
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="postStockOut(slotProps.data.id)">
                                                        <i class="ri-upload-2-line me-2"></i> Post
                                                    </a>
                                                </li>
                                                <li v-if="userHasRole('superadmin') || (userHasPermission('view_stock_out') && slotProps.data.status == 'posted')">
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="viewStockOutDetails(slotProps.data.id)">
                                                        <i class="ri-eye-line me-2"></i> Lihat Detail
                                                    </a>
                                                </li>
                                                <li v-if="userHasRole('superadmin') || (userHasPermission('delete_stock_out') && slotProps.data.status == 'Received')">
                                                    <a class="dropdown-item text-danger" href="javascript:void(0)" @click="deleteStockOut(slotProps.data.id)">
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
                    <!--/ stock out Table -->
                </div>
            </div>
            <!--/ stock out cards -->
        </div>
         <!-- / Content -->
 
         <div class="content-backdrop fade"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
import { useStockOutStore } from '~/stores/stockout'
import { useWarehouseStore } from '~/stores/warehouse'
import CardBox from '~/components/cards/Cards.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Swal from 'sweetalert2'
import InputText from 'primevue/inputtext'
import 'vue-select/dist/vue-select.css'
import { useRouter } from 'vue-router'
import { usePermissions } from '~/composables/usePermissions'
import { usePermissionsStore } from '~/stores/permissions'
import { useDynamicTitle } from '~/composables/useDynamicTitle'

// Composables
const { setListTitle, setFormTitle } = useDynamicTitle()
const toast = useToast()

const { $api } = useNuxtApp()

const myDataTableRef            = ref(null)
const userStore                 = useUserStore()
const permissionStore           = usePermissionsStore()
const stockOutStore             = useStockOutStore()
const warehouseStore            = useWarehouseStore()
const { stockOuts, totalRecords, stats, params, form, validationErrors } = storeToRefs(stockOutStore)
const { warehouse: warehouses } = storeToRefs(warehouseStore)
const selectedStockOut          = ref(null);
const loading                   = ref(false);
const globalFilterValue         = ref('');
const router                    = useRouter()

const { userHasPermission, userHasRole } = usePermissions();

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

let searchDebounceTimer = null;
watch(globalFilterValue, (newValue) => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(() => {
        stockOutStore.setSearch(newValue);
    }, 500);
});

onBeforeUnmount(() => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }
});

const postStockOut = async (id) => {
    try {
        await stockOutStore.postStockOut(id);
        await stockOutStore.fetchStockOutsPaginated();
        toast.success({
            title: 'Berhasil!',
            message: `Stock Out berhasil diposting.`,
            color: 'green'
        });
    } catch (error) {
        let errorMessage = 'Gagal memposting stock out';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        
        // Coba parsing error jika itu adalah string JSON
        try {
            const parsedError = JSON.parse(errorMessage);
            if (parsedError.errors) {
                 stockOutStore.validationErrors = Array.isArray(parsedError.errors)
                    ? parsedError.errors
                    : Object.values(parsedError.errors).flat();
                return toast.error({
                    title: 'Gagal', 
                    message: 'Terdapat kesalahan validasi data.', 
                    color: 'red'
                });
            }
             errorMessage = parsedError.message || errorMessage;
        } catch (e) {
            // Biarkan errorMessage seperti apa adanya jika bukan JSON
        }
        
        toast.error({
            title: 'Error',
            message: errorMessage,
            color: 'red'
        });
    }
};

// Fungsi untuk menangani event load lazy data dari jabatan
const loadLazyData = async () => {
    try {
        await stockOutStore.fetchStockOutsPaginated();
    } catch (error) {
        const error_message = error.message;
        toast.error({
            title: 'Error',
            message: `Tidak dapat memuat data stock out: ${error_message}`,
            color: 'red'
        });
    }
};

onMounted(() => {
    loadLazyData();
    stockOutStore.fetchStats();
    warehouseStore.fetchWarehouses();
    permissionStore.fetchPermissions()
    userStore.loadUser()
    setListTitle('Stock Out', stockOuts.value.length)
});

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    } else if (format === 'pdf') {
        myDataTableRef.value.exportPDF();
    }
};

// View Stock Out Details
const viewStockOutDetails = (stockOutId) => {
    router.push({ path: `/inventory/stock-out-detail`, query: { id: stockOutId } });
};

const deleteStockOut = async (id) => {
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
            await stockOutStore.deleteStockOut(id);
            loadLazyData(); // Muat ulang data
            toast.success({
                title: 'Berhasil!',
                message: 'Stock Out berhasil dihapus.',
                color: 'green'
            });

        } catch (error) {
            toast.error({
                title: 'Error',
                message: error.message,
                color: 'red'
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
</script>

<style scoped>
    :deep(.status-select .vs__dropdown-toggle) ,
    :deep(.warehouse-select .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>