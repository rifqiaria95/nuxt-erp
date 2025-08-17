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
                                        <li><a class="dropdown-item" href="javascript:void(0)" @click="exportData('csv')">
                                            <i class="ri-file-excel-line me-2"></i> CSV (dengan Detail Item)
                                        </a></li>
                                        <li><a class="dropdown-item" href="javascript:void(0)" @click="exportData('pdf')">
                                            <i class="ri-file-pdf-line me-2"></i> PDF
                                        </a></li>
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
                                                <li v-if="userHasRole('superadmin') || (userHasPermission('approve_stock_in') && slotProps.data.status == 'draft')">
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="postStockIn(slotProps.data.id)">
                                                        <i class="ri-upload-2-line me-2"></i> Post
                                                    </a>
                                                </li>
                                                <li v-if="userHasRole('superadmin') || (userHasPermission('view_stock_in') && slotProps.data.status == 'posted')">
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="viewStockInDetails(slotProps.data.id)">
                                                        <i class="ri-eye-line me-2"></i> Lihat Detail
                                                    </a>
                                                </li>
                                                <li v-if="userHasRole('superadmin') || (userHasPermission('edit_stock_in') && slotProps.data.status == 'draft')">
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="stockInStore.openModal(slotProps.data)">
                                                        <i class="ri-edit-box-line me-2"></i> Edit
                                                    </a>
                                                </li>
                                                <li v-if="userHasRole('superadmin') || (userHasPermission('delete_stock_in') && slotProps.data.status == 'Received')">
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
const stockInStore              = useStockStore()
const warehouseStore            = useWarehouseStore()
const { stockIns, totalRecords, stats, params } = storeToRefs(stockInStore)
const { warehouse: warehouses } = storeToRefs(warehouseStore)
const loading                   = ref(false);
const globalFilterValue         = ref('');
const router                    = useRouter()

const { userHasPermission, userHasRole } = usePermissions();

const status       = ref([
    { label: 'Draft', value: 'draft' },
    { label: 'Posted', value: 'posted' },
]);

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

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

const postStockIn = async (id) => {
    try {
        await stockInStore.postStockIn(id);
        await stockInStore.fetchStockInsPaginated();
        toast.success(`Stock In berhasil diposting.`);
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
                return toast.error('Terdapat kesalahan validasi data.');
            }
             errorMessage = parsedError.message || errorMessage;
        } catch (e) {
            // Biarkan errorMessage seperti apa adanya jika bukan JSON
        }
        
        toast.error(errorMessage);
    }
};

// Fungsi untuk menangani event load lazy data dari jabatan
const loadLazyData = async () => {
    try {
        await stockInStore.fetchStockInsPaginated();
    } catch (error) {
        const error_message = error.message;
        toast.error(`Tidak dapat memuat data stock in: ${error_message}`);
    }
};

onMounted(() => {
    loadLazyData();
    stockInStore.fetchStats();
    warehouseStore.fetchWarehouses();
    permissionStore.fetchPermissions()
    userStore.loadUser()
    setListTitle('Stock In', stockIns.value.length)
});

const exportData = (format) => {
    if (format === 'csv') {
        exportStockInWithDetails();
    } else if (format === 'pdf') {
        myDataTableRef.value.exportPDF();
    }
};

// Fungsi export dengan detail item menggunakan CSV
const exportStockInWithDetails = async () => {
    try {
        loading.value = true;
        
        // Ambil data stock in dengan detail
        const stockInData = await stockInStore.exportStockInWithDetails();
        if (stockInData && stockInData.length > 0) {
            console.log('First Stock In item:', stockInData[0]);
            console.log('First Stock In item keys:', Object.keys(stockInData[0]));
            if (stockInData[0].stockInDetails) {
                console.log('First Stock In Details:', stockInData[0].stockInDetails);
                if (stockInData[0].stockInDetails.length > 0) {
                    console.log('First Stock In Detail item:', stockInData[0].stockInDetails[0]);
                }
            }
        }
        
        if (!stockInData || stockInData.length === 0) {
            toast.warning('Tidak ada data untuk diexport');
            return;
        }

        // Siapkan data untuk export dengan format yang lebih sederhana
        const exportData = [];
        
        // Ambil nama perusahaan dari user store atau default
        const userData = userStore.user;
        console.log('User Data:', userData);
        const nmPerusahaan = userData?.perusahaan?.name || userData?.cabang?.perusahaan?.name || userData?.perusahaan?.nmPerusahaan || userData?.cabang?.perusahaan?.nmPerusahaan || 'Perusahaan';
        
        // Tambahkan title
        exportData.push([`Rekapitulasi data Stock In ${nmPerusahaan}`]);
        exportData.push([]); // Baris kosong
        
        // Tambahkan header utama
        exportData.push(['No. Stock In', 'Tanggal', 'Gudang', 'Status', 'No. PO', 'Penerima', 'Produk', 'Deskripsi', 'Quantity']);
        exportData.push(['-'.repeat(10), '-'.repeat(10), '-'.repeat(10), '-'.repeat(10), '-'.repeat(10), '-'.repeat(10), '-'.repeat(10), '-'.repeat(10), '-'.repeat(10)]); // Garis pemisah header
        
        // Tambahkan data dengan detail item
        stockInData.forEach((stockIn) => {
            if (stockIn.stockInDetails && stockIn.stockInDetails.length > 0) {
                stockIn.stockInDetails.forEach(detail => {
                    exportData.push([
                        stockIn.noSi || '-',
                        stockIn.date ? new Date(stockIn.date).toLocaleDateString() : '-',
                        stockIn.warehouse?.name || '-',
                        stockIn.status || '-',
                        stockIn.purchaseOrder?.noPo || '-',
                        stockIn.purchaseOrder?.receivedByUser?.fullName || stockIn.postedByUser?.fullName || '-',
                        detail.product?.name || '-',
                        detail.description || '-',
                        detail.quantity || 0
                    ]);
                });
            } else {
                // Jika tidak ada detail item, tetap tampilkan header stock in
                exportData.push([
                    stockIn.noSi || '-',
                    stockIn.date ? new Date(stockIn.date).toLocaleDateString() : '-',
                    stockIn.warehouse?.name || '-',
                    stockIn.status || '-',
                    stockIn.purchaseOrder?.noPo || '-',
                    stockIn.purchaseOrder?.receivedByUser?.fullName || stockIn.postedByUser?.fullName || '-',
                    '-',
                    'Tidak ada detail item',
                    '-'
                ]);
            }
        });
        
        // Tambahkan informasi tambahan
        exportData.push([]); // Baris kosong
        exportData.push(['='.repeat(100)]); // Garis pemisah
        exportData.push([`Total Data: ${stockInData.length} Stock In`]);
        exportData.push([`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`]);
        exportData.push([`Waktu Export: ${new Date().toLocaleTimeString('id-ID')}`]);
        
        // Buat file CSV dengan border dan styling
        let csvContent = '';
        
        // Tambahkan BOM untuk UTF-8
        csvContent += '\uFEFF';
        
        // Proses setiap baris dengan border
        exportData.forEach((row, index) => {
            if (index === 0) {
                // Title - center align dengan border
                csvContent += `"${row[0]}"\n`;
            } else if (row.length === 0) {
                // Baris kosong
                csvContent += '\n';
            } else if (index === 2) {
                // Header - dengan border dan styling
                csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
            } else if (index === 3) {
                // Garis pemisah header
                csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
            } else if (row.length === 1) {
                // Informasi tambahan atau garis pemisah (single cell)
                if (row[0].includes('=')) {
                    // Garis pemisah
                    csvContent += `"${row[0]}"\n`;
                } else {
                    // Informasi tambahan
                    csvContent += `"${row[0]}"\n`;
                }
            } else {
                // Data rows - dengan border
                csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
            }
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `stock-in-report-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const toast = useToast();
        toast.success({
            title: 'Success',
            message: 'Export CSV dengan detail item berhasil!',
            color: 'green'
        });
        
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        const toast = useToast();
        toast.error({
            title: 'Error',
            message: 'Gagal export CSV: ' + (error.message || 'Unknown error'),
            color: 'red'
        });
    } finally {
        loading.value = false;
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
            toast.success('Stock In berhasil dihapus.');

        } catch (error) {
            toast.error(error.message);
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