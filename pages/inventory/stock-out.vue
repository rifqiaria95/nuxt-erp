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
                                    <button 
                                        class="btn btn-dark px-2 py-2" 
                                        type="button" 
                                        @click="postAllSelectedStockOut"
                                        :disabled="stockOutStore.selectedIds.length === 0"
                                        title="Post semua stock out yang dipilih"
                                        style="min-width: 150px; min-height: 38px;"
                                    >
                                        <i class="ri-upload-2-line me-1"></i> Post All ({{ stockOutStore.selectedIds.length }})
                                    </button>
                                </div>
                                <div class="btn-group me-2">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="min-width: 150px; min-height: 38px;">
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
                                <Column header="#" :sortable="false" style="width: 50px;">
                                    <template #header>
                                        <Checkbox 
                                            v-model="stockOutStore.selectAll" 
                                            @change="stockOutStore.toggleSelectAll"
                                            :indeterminate="stockOutStore.selectedIds.length > 0 && !stockOutStore.selectAll"
                                        />
                                    </template>
                                    <template #body="slotProps">
                                        <Checkbox 
                                            v-model="stockOutStore.selectedIds" 
                                            :value="slotProps.data.id"
                                            @change="stockOutStore.toggleSelection(slotProps.data.id)"
                                            :disabled="slotProps.data.status !== 'draft'"
                                        />
                                    </template>
                                </Column>
                                <Column header="No." :sortable="false" style="width: 60px;">
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
import Checkbox from 'primevue/checkbox'
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
const { stockOuts, totalRecords, stats, params, form, validationErrors, selectedIds, selectAll } = storeToRefs(stockOutStore)
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

const postAllSelectedStockOut = async () => {
    if (stockOutStore.selectedIds.length === 0) {
        toast.warning('Pilih stock out yang akan diposting terlebih dahulu.');
        return;
    }

    const result = await Swal.fire({
        title: 'Konfirmasi Post All',
        text: `Apakah Anda yakin ingin memposting ${stockOutStore.selectedIds.length} stock out yang dipilih?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Post All!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        try {
            loading.value = true;
            const result = await stockOutStore.postAllStockOut(stockOutStore.selectedIds);
            
            // Tampilkan hasil
            let message = result.message;
            if (result.results.failed.length > 0) {
                message += '\n\nGagal:';
                result.results.failed.forEach(item => {
                    message += `\n- ${item.id}: ${item.reason}`;
                });
            }
            
            await Swal.fire({
                title: 'Hasil Post All',
                text: message,
                icon: result.results.failed.length === 0 ? 'success' : 'warning',
                confirmButtonText: 'OK'
            });
            
            // Refresh data dan clear selection
            await stockOutStore.fetchStockOutsPaginated();
            stockOutStore.clearSelection();
            
        } catch (error) {
            let errorMessage = 'Gagal memposting stock out';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            
            toast.error({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            });
        } finally {
            loading.value = false;
        }
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

// Clear selection saat data berubah
watch(stockOuts, () => {
    stockOutStore.clearSelection();
});

const exportData = (format) => {
    if (format === 'csv') {
        exportStockOutWithDetails();
    } else if (format === 'pdf') {
        myDataTableRef.value.exportPDF();
    }
};

// Fungsi export dengan detail item menggunakan CSV
const exportStockOutWithDetails = async () => {
    try {
        loading.value = true;
        
        // Ambil data stock out dengan detail
        const stockOutData = await stockOutStore.exportStockOutWithDetails();
        
        if (!stockOutData || stockOutData.length === 0) {
            toast.warning('Tidak ada data untuk diexport');
            return;
        }

        // Siapkan data untuk export dengan format yang lebih sederhana
        const exportData = [];
        
        // Ambil nama perusahaan dari user store atau default
        const userData = userStore.user;
        const nmPerusahaan = userData?.perusahaan?.name || userData?.cabang?.perusahaan?.name || userData?.perusahaan?.nmPerusahaan || userData?.cabang?.perusahaan?.nmPerusahaan || 'Perusahaan';
        
        // Tambahkan title
        exportData.push([`Rekapitulasi data Stock Out ${nmPerusahaan}`]);
        exportData.push([]); // Baris kosong
        
        // Tambahkan header utama
        exportData.push(['No. Stock Out', 'Tanggal', 'Gudang', 'Status', 'No. SO', 'Pengirim', 'Produk', 'Deskripsi', 'Quantity']);
        exportData.push(['-'.repeat(10), '-'.repeat(10), '-'.repeat(10), '-'.repeat(10), '-'.repeat(10), '-'.repeat(10), '-'.repeat(10), '-'.repeat(10), '-'.repeat(10)]); // Garis pemisah header
        
        // Tambahkan data dengan detail item
        stockOutData.forEach((stockOut) => {
            if (stockOut.stockOutDetails && stockOut.stockOutDetails.length > 0) {
                stockOut.stockOutDetails.forEach(detail => {
                    exportData.push([
                        stockOut.noSo || '-',
                        stockOut.date ? new Date(stockOut.date).toLocaleDateString() : '-',
                        stockOut.warehouse?.name || '-',
                        stockOut.status || '-',
                        stockOut.salesOrder?.noSo || '-',
                        stockOut.salesOrder?.deliveredByUser?.fullName || stockOut.postedByUser?.fullName || '-',
                        detail.product?.name || '-',
                        detail.description || '-',
                        detail.quantity || 0
                    ]);
                });
            } else {
                // Jika tidak ada detail item, tetap tampilkan header stock out
                exportData.push([
                    stockOut.noSo || '-',
                    stockOut.date ? new Date(stockOut.date).toLocaleDateString() : '-',
                    stockOut.warehouse?.name || '-',
                    stockOut.status || '-',
                    stockOut.salesOrder?.noSo || '-',
                    stockOut.salesOrder?.deliveredByUser?.fullName || stockOut.postedByUser?.fullName || '-',
                    '-',
                    'Tidak ada detail item',
                    '-'
                ]);
            }
        });
        
        // Tambahkan informasi tambahan
        exportData.push([]); // Baris kosong
        exportData.push(['='.repeat(100)]); // Garis pemisah
        exportData.push([`Total Data: ${stockOutData.length} Stock Out`]);
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
        link.setAttribute('download', `stock-out-report-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success({
            title: 'Success',
            message: 'Export CSV dengan detail item berhasil!',
            color: 'green'
        });
        
    } catch (error) {
        toast.error({
            title: 'Error',
            message: 'Gagal export CSV: ' + (error.message || 'Unknown error'),
            color: 'red'
        });
    } finally {
        loading.value = false;
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