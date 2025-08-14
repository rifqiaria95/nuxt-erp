<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <div v-if="loading">
                <!-- Skeleton loader -->
                <div class="animate-pulse space-y-2">
                    <div class="h-6 bg-gray-200 rounded"></div>
                    <div class="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
            <template v-else>
                <div v-if="products.length > 0">
                    <h4 class="mb-1">List Product</h4>
                    <p class="mb-6">
                        List product yang terdaftar di sistem
                    </p>
                    <div class="row g-6 mb-6">
                        <div class="col-xl-4 col-lg-6 col-md-6">
                            <div class="card h-100">
                            <div class="row h-100">
                                <div class="col-sm-5">
                                <div class="d-flex align-items-end h-100 justify-content-center">
                                    <img
                                    src="/img/illustrations/add-new-role-illustration.png"
                                    class="img-fluid"
                                    alt="Image"
                                    width="70" />
                                </div>
                                </div>
                                <div class="col-sm-7">
                                <div class="card-body text-sm-end text-center ps-sm-0">
                                    <button v-if="userHasRole('superadmin') || userHasPermission('create_product')"
                                    @click="productStore.openModal()"
                                    class="btn btn-primary mb-2 text-nowrap add-new-role"
                                    >
                                    Tambah Product
                                    </button>
                                    <p class="mb-0 mt-1">Buat Product baru</p>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

                    <div class="row g-6">
                        <div class="col-12">
                            <!-- product Table -->
                            <div class="card">
                                <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                                    <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                        <span class="me-2">Baris:</span>
                                        <Dropdown v-model="params.rows" :options="rowsPerPageOptionsArray" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
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
                                                    placeholder="Cari product..."
                                                    class="w-full md:w-20rem"
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-datatable table-responsive py-3 px-3">
                                <MyDataTable 
                                    ref="myDataTableRef"
                                    :data="products" 
                                    :rows="Number(params.rows)" 
                                    :loading="loading"
                                    :totalRecords="totalRecords"
                                    :lazy="true"
                                    :sort-field="params.sortField"
                                    :sort-order="params.sortOrder"
                                    sort-mode="single"
                                    @page="onPage($event)"
                                    @sort="onSort($event)"
                                    responsiveLayout="scroll"
                                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                    currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} data"
                                    >
                                    <Column field="id" header="#" :sortable="true"></Column> 
                                        <Column field="image" header="Gambar" :sortable="true">
                                            <template #body="slotProps">
                                                <div v-if="slotProps.data.image">
                                                    <img 
                                                        :src="getProductImage(slotProps.data.image)" 
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
                                        <Column field="sku" header="No. Product" :sortable="true"></Column>
                                        <Column field="name" header="Nama Product" :sortable="true"></Column>
                                        <Column field="berat" header="Berat" :sortable="true">
                                            <template #body="slotProps">
                                                {{ slotProps.data.berat ? slotProps.data.berat + ' ' + units.find(unit => unit.id === slotProps.data.unitId)?.name : '-' }}
                                            </template>
                                        </Column>
                                        <Column field="stockMin" header="Stok Minimum" :sortable="true">
                                            <template #body="slotProps">
                                                {{ Math.round(slotProps.data.stockMin) }}
                                            </template>
                                        </Column>
                                        <Column field="priceBuy" header="Harga Beli" :sortable="true">
                                            <template #body="slotProps">
                                                {{ slotProps.data.priceBuy ? formatRupiah(slotProps.data.priceBuy) : '-' }}
                                            </template>
                                        </Column>
                                        <Column field="priceSell" header="Harga Jual" :sortable="true">
                                            <template #body="slotProps">
                                                {{ slotProps.data.priceSell ? formatRupiah(slotProps.data.priceSell) : '-' }}
                                            </template>
                                        </Column>
                                        <Column field="isService" header="Service" :sortable="true">
                                            <template #body="slotProps">
                                                <span :class="getStatusBadge(slotProps.data.isService).class">
                                                    {{ getStatusBadge(slotProps.data.isService).text }}
                                                </span>
                                            </template>
                                        </Column>
                                        <Column header="Kategori" field="category.name" :sortable="true">
                                            <template #body="slotProps">
                                                {{ slotProps.data.category && slotProps.data.category.name ? slotProps.data.category.name : '-' }}
                                            </template>
                                        </Column>
                                        <Column header="Actions" :exportable="false" style="min-width:8rem">
                                            <template #body="slotProps">
                                                <button v-if="userHasRole('superadmin') || userHasPermission('edit_product')" @click="productStore.openModal(slotProps.data)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line"></i></button>
                                                <button v-if="userHasRole('superadmin') || userHasPermission('delete_product')" @click="productStore.deleteProduct(slotProps.data.id)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line"></i></button>
                                            </template>
                                        </Column>
                                </MyDataTable>
                                </div>
                            </div>
                            <!--/ product Table -->
                        </div>
                    </div>
                    <!--/ product cards -->
                </div>
                <div v-else class="text-center">
                    <div class="d-flex flex-column align-items-center">
                        <img src="/img/illustrations/misc-under-maintenance-illustration.png" alt="page-misc-under-maintenance" width="300" class="img-fluid" />
                        <h4 class="mt-4">Tidak ada data Product</h4>
                        <p class="mb-4">
                            Saat ini belum ada data product yang tersedia.<br />
                            Silakan buat product baru untuk memulai.
                        </p>
                        <button @click="productStore.openModal()" class="btn btn-primary">
                            <i class="ri-add-line me-1"></i>
                            Tambah Product
                        </button>
                    </div>
                </div>
            </template>
            <!-- Placeholder untuk MenuModal component -->
            <Modal 
                id="ProductModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="productStore.saveProduct()">
                        <div class="row g-6">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        v-model="form.sku" 
                                        placeholder="Masukkan part number"
                                        required
                                    >
                                    <label>Part Number</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        v-model="form.name" 
                                        placeholder="Masukkan nama barang"
                                        required
                                    >
                                    <label>Nama Barang</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="form.stockMin" 
                                    placeholder="Masukkan stok minimum"
                                    @input="form.stockMin = $event.target.value.replace(/[^0-9]/g, '')"
                                    inputmode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    >
                                    <label>Stok Minimum</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="form.berat" 
                                    placeholder="Masukkan berat"
                                    @input="form.berat = $event.target.value.replace(/[^0-9]/g, '')"
                                    inputmode="numeric"
                                    pattern="[0-9]*"
                                    >
                                    <label>Berat</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="form.unitId"
                                        :options="units"
                                        label="name"
                                        :reduce="unit => unit.id"
                                        placeholder="-- Pilih Satuan --"
                                        class="unit"
                                    />
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="formattedPriceBuy" 
                                    placeholder="Masukkan harga beli"
                                    required
                                    >
                                    <label>Harga Beli</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="formattedPriceSell" 
                                    placeholder="Masukkan harga jual"
                                    required
                                    >
                                    <label>Harga Jual</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="form.categoryId"
                                        :options="kategori"
                                        label="name"
                                        :reduce="kategori => kategori.id"
                                        placeholder="-- Pilih Kategori --"
                                        class="kategori"
                                    />  
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="form.kondisi"
                                        :options="kondisiOptions"
                                        label="label"
                                        :reduce="option => option.value"
                                        :get-option-key="option => option.value"
                                        placeholder="-- Pilih Kondisi --"
                                        id="select-kondisi"
                                        class="select-kondisi"
                                    />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check form-switch mt-3 d-flex align-items-center">
                                    <input class="form-check-input me-2" type="checkbox" v-model="form.isService" />
                                    <label class="form-check-label mb-0">
                                        Service
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="file" 
                                        class="form-control"
                                        @change="onImageChange"
                                        accept="image/*"
                                        placeholder="Masukkan image product"
                                    >
                                    <label>Gambar</label>
                                    
                                    <div v-if="form.imagePreview" class="mt-2">
                                        <img 
                                            :src="form.imagePreview" 
                                            alt="Image Preview" 
                                            class="image-preview"
                                            style="height: 60px; max-width: 120px; object-fit: contain; border: 2px solid #ddd; border-radius: 8px;"
                                            @error="(e) => handleImageError(e, '/img/default-product-image.png')"
                                        />
                                        <a :href="form.imagePreview" target="_blank" rel="noopener noreferrer" class="d-block mt-1">Lihat Gambar</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer mt-6">
                            <button type="button" class="btn btn-outline-secondary" @click="productStore.closeModal()">Tutup</button>
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Simpan
                            </button>
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
import { storeToRefs } from 'pinia';
import { useProductStore } from '~/stores/product'
import { useKategoriStore } from '~/stores/kategori'
import { useUnitStore } from '~/stores/unit'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import { useDebounceFn } from '@vueuse/core'
import { useFormatRupiah } from '~/composables/formatRupiah';
import { usePermissions } from '~/composables/usePermissions'
import { usePermissionsStore } from '~/stores/permissions'
import { useUserStore } from '~/stores/user'
import { useDynamicTitle } from '~/composables/useDynamicTitle'
import { useImageUrl } from '~/composables/useImageUrl'

// Composables
const { setListTitle, setFormTitle } = useDynamicTitle()
const { getProductImage, handleImageError } = useImageUrl()

const { userHasPermission, userHasRole } = usePermissions();

const formatRupiah = useFormatRupiah()

const myDataTableRef    = ref(null)
const productStore      = useProductStore()
const kategoriStore     = useKategoriStore()
const unitStore         = useUnitStore()
const permissionStore   = usePermissionsStore()
const userStore         = useUserStore()

const { products, loading, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(productStore)
const { kategori } = storeToRefs(kategoriStore)
const { units } = storeToRefs(unitStore)

const globalFilterValue = ref('')
const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);
const modalTitle = computed(() => isEditMode.value ? 'Edit Product' : 'Tambah Product');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data product di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan product baru.');

const formattedPriceBuy = computed({
    get() {
        return form.value.priceBuy ? formatRupiah(form.value.priceBuy) : '';
    },
    set(value) {
        form.value.priceBuy = value.replace(/[^0-9]/g, '');
    }
});

const formattedPriceSell = computed({
    get() {
        return form.value.priceSell ? formatRupiah(form.value.priceSell) : '';
    },
    set(value) {
        form.value.priceSell = value.replace(/[^0-9]/g, '');
    }
});

const kondisiOptions = [
    { label: 'Baru', value: 'baru' }, { label: 'Bekas', value: 'bekas' },
    { label: 'Rusak', value: 'rusak' }, { label: 'Servis', value: 'servis' }
];

const config = useRuntimeConfig();


let modalInstance = null
onMounted(() => {
    productStore.fetchProducts();
    kategoriStore.fetchKategori();
    unitStore.fetchUnit();
    permissionStore.fetchPermissions()
    userStore.loadUser()
    const modalElement = document.getElementById('ProductModal')
    if (modalElement) {
        modalInstance = new bootstrap.Modal(modalElement)
    }
    setListTitle('Product', products.value.length)
});

watch(showModal, (newValue) => {
    if (newValue) {
        modalInstance?.show()
    } else {
        modalInstance?.hide()
    }
})


const debouncedSearch = useDebounceFn(() => {
    productStore.setSearch(globalFilterValue.value)
}, 500)
watch(globalFilterValue, debouncedSearch);

const onPage = (event) => productStore.setPagination(event);

const handleRowsChange = () => {
    params.value.first = 0; // Reset to first page
    productStore.fetchProducts();
};

const onSort = (event) => productStore.setSort(event);

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    } else if (format === 'pdf') {
        // Implement PDF export if needed
    }
};

function onImageChange(e) {
  const file = e.target.files[0];
  if (file) {
    productStore.handleImageChange(file);
  }
}

const getStatusBadge = (status) => {
    switch (status) {
        case true:
            return { text: 'Ya', class: 'badge rounded-pill bg-label-primary' };
        case false:
            return { text: 'Tidak', class: 'badge rounded-pill bg-label-danger' };
        default:
            return { text: '-', class: 'badge rounded-pill bg-label-light' };
    }
};

</script>

<style scoped>
    :deep(.unit .vs__dropdown-toggle),
    :deep(.kategori .vs__dropdown-toggle),
    :deep(.select-kondisi .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
    
    .image-preview {
        transition: all 0.3s ease;
    }

    .image-preview:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
</style>