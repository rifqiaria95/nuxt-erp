<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Stock</h4>
            <p class="mb-6">
            List stock yang terdaftar di sistem
            </p>
            <!-- stock in cards -->
            <div class="row g-6 mb-6">
                <CardBox
                    v-if="stats.total !== undefined"
                    title="Total Stock"
                    :total="stats.total + ' Stock'"
                />
                <CardBox
                    v-if="stats.perWarehouse.length > 0"
                    title="Total Stock Per Gudang"
                    :total="stats.perWarehouse.length + ' Gudang'"
                />
            </div>
            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Stock</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Stock.</p>
                </div>
                <div class="col-12">
                    <!-- stock in Table -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                            <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                <span class="me-2">Baris:</span>
                                <Dropdown v-model="params.rows" :options="rowsPerPageOptionsArray" @change="stocksStore.handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
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
                            :data="stocks" 
                            :rows="Number(params.rows)" 
                            :loading="loading"
                            :totalRecords="totalRecords"
                            :lazy="true"
                            @page="stocksStore.setPagination($event)"
                            @sort="stocksStore.setSort($event)"
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
                                <Column field="image" header="Gambar" :sortable="true">
                                    <template #body="slotProps">
                                        <div v-if="slotProps.data.product.image">
                                            <img 
                                                :src="getProductImage(slotProps.data.product.image)" 
                                                alt="Gambar Produk" 
                                                style="height: 40px; max-width: 80px; object-fit: contain;" 
                                                @error="(e) => handleImageError(e, '/img/default-product-image.png')"
                                            />
                                        </div>
                                        <div v-else>
                                            <img 
                                                src="/img/default-product-image.png" 
                                                alt="Default Image" 
                                                style="height: 40px; max-width: 80px; object-fit: contain;"
                                            />
                                        </div>
                                    </template>
                                </Column>
                                <Column field="product.sku" header="Part Number" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.product.sku }}
                                    </template>
                                </Column>
                                <Column field="product.name" header="Nama Produk" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.product.name }}
                                    </template>
                                </Column>
                                <Column field="warehouse.name" header="Gudang" :sortable="true" class="text-nowrap">
                                    <template #body="slotProps">
                                        <span class="badge bg-primary">
                                            {{ slotProps.data.warehouse.name }}
                                        </span>
                                    </template>
                                </Column>
                                <Column field="quantity" header="Jumlah" :sortable="true" class="text-nowrap">
                                    <template #body="slotProps">
                                        {{ Math.floor(slotProps.data.quantity) }}
                                    </template>
                                </Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem" v-if="userHasRole('superadmin')">
                                    <template #body="slotProps">
                                        <div class="d-inline-block">
                                            <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li>
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
import { useStocksStore } from '~/stores/stocks'
import CardBox from '~/components/cards/Cards.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import { usePermissionsStore } from '~/stores/permissions'
import { usePermissions } from '~/composables/usePermissions'
import { useDynamicTitle } from '~/composables/useDynamicTitle'
import { useImageUrl } from '~/composables/useImageUrl'

// Composables
const { setListTitle, setFormTitle } = useDynamicTitle()
const { getProductImage, handleImageError } = useImageUrl()

const { $api } = useNuxtApp()

const myDataTableRef            = ref(null)
const userStore                 = useUserStore()
const stocksStore              = useStocksStore()
const permissionStore           = usePermissionsStore()
const { stocks, totalRecords, stats, params } = storeToRefs(stocksStore)
const loading                   = ref(false);
const globalFilterValue         = ref('');

const { userHasPermission, userHasRole } = usePermissions();

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

let searchDebounceTimer = null;
watch(globalFilterValue, (newValue) => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(() => {
        stocksStore.setSearch(newValue);
    }, 500);
});

onBeforeUnmount(() => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }
});

// Fungsi untuk menangani event load lazy data dari jabatan
const loadLazyData = async () => {
    try {
        await stocksStore.fetchStocksPaginated();
    } catch (error) {
        const error_message = error.message;
        toast.error(`Tidak dapat memuat data stock: ${error_message}`);
    }
};

onMounted(() => {
    loadLazyData();
    stocksStore.fetchStats();
    permissionStore.fetchPermissions()
    userStore.loadUser()
    setListTitle('Stock', stocks.value.length)
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
    const url = `${$api.getStockInDetails(stockInId)}`;
    window.open(url, '__blank');
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
            await stocksStore.deleteStockIn(id);
            loadLazyData(); // Muat ulang data
            toast.success('Stock In berhasil dihapus.');

        } catch (error) {
            toast.error(error.message);
        }
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