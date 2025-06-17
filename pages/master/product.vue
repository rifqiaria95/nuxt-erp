<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Product</h4>
            <p class="mb-6">
            List product yang terdaftar di sistem
            </p>
            <!-- product cards -->
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
                            @click="openAddProductModal"
                            >
                            Tambah Product
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Product</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Product.</p>
                </div>
                <div class="col-12">
                    <!-- product Table -->
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
                            :data="product" 
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
                                <Column field="image" header="Gambar" :sortable="true">
                                    <template #body="slotProps">
                                        <div v-if="slotProps.data.image">
                                            <img :src="getLogoUrl(slotProps.data.image)" alt="Logo" style="height: 40px; max-width: 80px; object-fit: contain;" />
                                        </div>
                                        <div v-else>
                                            <span class="text-muted">Tidak ada image</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="sku" header="No. Product" :sortable="true"></Column>
                                <Column field="name" header="Nama Product" :sortable="true"></Column>
                                <Column field="unit.name" header="Satuan" :sortable="true"></Column>
                                <Column field="stockMin" header="Stok Minimum" :sortable="true"></Column>
                                <Column field="priceBuy" header="Harga Beli" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.priceBuy ? formatRupiah(slotProps.data.priceBuy) : '-' }}
                                    </template>
                                </Column>
                                <Column field="isService" header="Service" :sortable="true">
                                    <template #body="slotProps">
                                        <span :class="getStatusBadge(slotProps.data.isService).class">
                                            {{ getStatusBadge(slotProps.data.isService).text }}
                                        </span>
                                    </template>
                                </Column>
                                <Column header="Kategori" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.category && slotProps.data.category.name ? slotProps.data.category.name : '-' }}
                                    </template>
                                </Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <button @click="openEditProductModal(slotProps.data)" class="btn btn-sm btn-icon      btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line"></i></button>
                                        <button @click="deleteProduct(slotProps.data.id)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line"></i></button>
                                    </template>
                                </Column>
                        </MyDataTable>
                        </div>
                    </div>
                    <!--/ product Table -->
                </div>
            </div>
            <!--/ product cards -->

            <!-- Placeholder untuk MenuModal component -->
            <Modal 
                :isEditMode="isEditMode"
                :validationErrorsFromParent="validationErrors"
                :title="modalTitle" 
                :description="modalDescription"
                :selectedProduct="selectedProduct"
            >
                <template #default>
                    <form @submit.prevent="handleSubmit">
                        <div class="row g-6">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="skuProduct" 
                                        v-model="formProduct.sku" 
                                        placeholder="Masukkan sku product"
                                        required
                                    >
                                    <label for="skuProduct">Kode Product</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="nmProduct" 
                                        v-model="formProduct.name" 
                                        placeholder="Masukkan nama product"
                                        required
                                    >
                                    <label for="nmProduct">Nama Product</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    id="stockMinProduct" 
                                    v-model="formProduct.stockMin" 
                                    placeholder="Masukkan stok minimum product"
                                    @input="formProduct.stockMin = $event.target.value.replace(/[^0-9]/g, '')"
                                    inputmode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    >
                                    <label for="stockMinProduct">Stok Minimum Product</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="formProduct.unitId"
                                        :options="unit"
                                        label="name"
                                        :reduce="unit => unit.id"
                                        placeholder="-- Pilih Satuan --"
                                        id="unit"
                                        class="unit"
                                    />
                                    <!-- Debug: tampilkan data unit di bawah select -->
                                    <div v-if="!unit || unit.length === 0" class="text-danger mt-1">
                                        Data satuan belum tersedia.
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    id="priceBuyProduct" 
                                    v-model="formattedPriceBuy" 
                                    placeholder="Masukkan harga beli product"
                                    required
                                    >
                                    <label for="priceBuyProduct">Harga Beli Product</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="formProduct.categoryId"
                                        :options="kategori"
                                        label="name"
                                        :reduce="kategori => kategori.id"
                                        placeholder="-- Pilih Kategori --"
                                        id="kategori"
                                        class="kategori"
                                    />  
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="file" 
                                        class="form-control" 
                                        id="imageProduct" 
                                        @change="onImageChange"
                                        placeholder="Masukkan image product"
                                        :required="!isEditMode"
                                    >
                                    <label for="imageProduct">Gambar Product</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check form-switch mt-3 d-flex align-items-center">
                                    <input class="form-check-input me-2" type="checkbox" id="isServiceProduct" v-model="formProduct.isService" />
                                    <label class="form-check-label mb-0" for="isServiceProduct">
                                        Service Product
                                    </label>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    class="btn btn-primary me-2"
                                    @click="handleSaveProduct"
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
import { useProductStore } from '~/stores/product'
import { useKategoriStore } from '~/stores/kategori'
import { useUnitStore } from '~/stores/unit'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Swal from 'sweetalert2'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'

const config   = useRuntimeConfig();
const { $api } = useNuxtApp()

const myDataTableRef    = ref(null)
const productStore      = useProductStore()
const kategoriStore     = useKategoriStore()
const unitStore         = useUnitStore()
const formatRupiah      = useFormatRupiah()
const selectedProduct   = ref(null);
const product           = ref([])
const unit              = ref([])
const kategori          = ref([])
const selectedKategori  = ref(null)
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

const formProduct = ref({
  name      : '',
  sku       : '',
  unitId    : '',
  stockMin  : '',
  priceBuy  : '',
  isService : false,
  image     : '',
  categoryId: ''
});

const formattedPriceBuy = computed({
    get() {
        return formatRupiah(formProduct.value.priceBuy);
    },
    set(value) {
        formProduct.value.priceBuy = value.replace(/[^0-9]/g, '');
    }
});

const getLogoUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') {
        return null;
    }
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    if (!config.public.apiBase) {
        return imagePath;
    }
    const origin = new URL(config.public.apiBase).origin;
    const imageUrl = `${origin}/${imagePath}`;
    return imageUrl;
};

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Product' : 'Tambah Product');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data product di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan product baru.');

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

const fetchUnit = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await fetch($api.unit(), {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        
        if (!response.ok) throw new Error('Gagal mengambil data unit')
        
        const data = await response.json()
        unit.value = data.data;
    } catch (error) {
        console.error('Error fetching unit:', error)
    }
}

const fetchKategori = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await fetch($api.categories(), {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        
        if (!response.ok) throw new Error('Gagal mengambil data kategori')
        
        const data = await response.json()
        kategori.value = data.data;
    } catch (error) {
        console.error('Error fetching kategori:', error)
    }
}

// Tambahkan state untuk error validasi agar bisa digunakan di modal
const validationErrors = ref([]);

const handleSaveProduct = async () => {
    loading.value = true;
    validationErrors.value = []; // reset error sebelum submit
    try {
        // Ambil CSRF token
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token || document.querySelector('meta[name="csrf-token"]')?.content;
        const token = localStorage.getItem('token');

        // Validasi form sederhana
        if (!formProduct.value.name || !formProduct.value.sku) {
            Swal.fire('Validasi', 'Nama dan SKU product wajib diisi.', 'warning');
            loading.value = false;
            return;
        }

        const formData = new FormData();
        formData.append('name', formProduct.value.name);
        formData.append('sku', formProduct.value.sku);
        formData.append('unitId', formProduct.value.unitId);
        formData.append('stockMin', formProduct.value.stockMin);
        formData.append('priceBuy', formProduct.value.priceBuy);
        formData.append('isService', formProduct.value.isService);
        formData.append('categoryId', formProduct.value.categoryId);

        if (formProduct.value.image && formProduct.value.image instanceof File) {
            formData.append('image', formProduct.value.image);
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrfToken || '',
            'Accept': 'application/json',
        };

        let url;
        let response;

        if (isEditMode.value) {
            // Cari ID product dari form atau selectedProduct
            let productIdToUpdate = formProduct.value?.id || selectedProduct.value?.id;
            if (!productIdToUpdate) {
                Swal.fire('Error', 'ID Product tidak ditemukan untuk update.', 'error');
                loading.value = false;
                return;
            }
            url = `${$api.product()}/${productIdToUpdate}`;
            
            // Untuk update, tambahkan _method=PUT ke formData
            formData.append('_method', 'PUT');

            response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                credentials: 'include'
            });
        } else {
            // Create baru
            url = $api.product();
            response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: headers,
                credentials: 'include'
            });
        }

        if (response.ok) {
            await loadLazyData();
            handleCloseModal();
            await Swal.fire(
                'Berhasil!',
                `Product berhasil ${isEditMode.value ? 'diperbarui' : 'dibuat'}.`,
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
                Swal.fire('Gagal', errorData.message || `Gagal ${isEditMode.value ? 'memperbarui' : 'membuat'} product`, 'error');
            }
        }
    } catch (error) {
        Swal.fire('Error', error.message || 'Terjadi kesalahan saat menyimpan data product.', 'error');
    } finally {
        loading.value = false;
    }
};

// Fungsi untuk menangani event load lazy data dari product
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

        const response = await fetch(`${$api.product()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data product dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data product');
        }

        const result = await response.json();
        product.value = result.data || []; 
        totalRecords.value = parseInt(result.meta.total) || 0;
        if (result.draw) {
             lazyParams.value.draw = parseInt(result.draw);
        }

    } catch (error) {
        console.error('Error loading lazy data for product:', error);
        product.value = [];
        totalRecords.value = 0;
        Swal.fire('Error', `Tidak dapat memuat data product: ${error.message}`, 'error');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadLazyData();
    fetchUnit();
    fetchKategori();
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

// Definisikan imagePreview terlebih dahulu
const imagePreview = ref(null);

function onImageChange(e) {
  const file = e.target.files[0];
  formProduct.value.image = file;
  if (file) {
    const objectURL = URL.createObjectURL(file);
    imagePreview.value = objectURL;
  } else {
    formProduct.value.image = '';
    imagePreview.value = null;
  }
}

const openAddProductModal = () => {
    isEditMode.value = false;
    modalTitle.value = 'Tambah Product';
    modalDescription.value = 'Silakan isi form di bawah ini untuk menambahkan product baru.';
    resetParentFormState();
};

async function openEditProductModal(productData) {
    isEditMode.value = true;
    // Mapping manual dari response API ke field form
    selectedProduct.value = { ...productData };
    formProduct.value = {
        name      : productData.name ?? productData.nmProduct ?? '',
        sku       : productData.sku ?? productData.skuProduct ?? '',
        unitId    : productData.unitId ?? productData.unitIdProduct ?? '',
        stockMin  : productData.stockMin ?? productData.stockMinProduct ?? '',
        priceBuy  : productData.priceBuy ?? productData.priceBuyProduct ?? '',
        isService : !!(productData.isService ?? productData.isServiceProduct),
        categoryId: productData.categoryId ?? productData.categoryIdProduct ?? '',
        image     : productData.image ?? productData.imageProduct ?? ''
    };
    validationErrors.value = [];

    // Tunggu DOM update agar binding form sudah siap sebelum show modal
    await nextTick();

    const modalEl = document.getElementById('Modal');
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
    } else {
        console.error('ProductModal element tidak ditemukan atau Bootstrap belum dimuat.');
    }
}

const deleteProduct = async (productId) => {
    if (!productId) return;

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

            url = `${$api.product()}/${productId}`;

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
                throw new Error(errorData.message || 'Gagal menghapus product');
            }

            loadLazyData();

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Product berhasil dihapus.',
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
        case true:
            return { text: 'Ya', class: 'badge rounded-pill bg-label-primary' };
        case false:
            return { text: 'Tidak', class: 'badge rounded-pill bg-label-danger' };
        default:
            return { text: '-', class: 'badge rounded-pill bg-label-light' };
    }
};

const resetParentFormState = () => {
    formProduct.value = {
        name: '',
        sku: '',
        unitId: '',
        stockMin: '',
        priceBuy: '',
        isService: false,
        categoryId: '',
        image: ''
    };
};
</script>

<style scoped>
    :deep(.unit .vs__dropdown-toggle),
    :deep(.kategori .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>