<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Customer</h4>
            <p class="mb-6">
            List customer yang terdaftar di sistem
            </p>
            <!-- customer cards -->
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
                            @click="openAddCustomerModal"
                            >
                            Tambah Customer
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Customer</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Customer.</p>
                </div>
                <div class="col-12">
                    <!-- customer Table -->
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
                                            placeholder="Cari customer..."
                                            class="w-full md:w-20rem"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="customer" 
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
                                <Column field="logo" header="Logo" :sortable="true">
                                    <template #body="slotProps">
                                        <div v-if="slotProps.data.logo">
                                            <img :src="getLogoUrl(slotProps.data.logo)" alt="Logo" style="height: 40px; max-width: 80px; object-fit: contain;" />
                                        </div>
                                        <div v-else>
                                            <span class="text-muted">Tidak ada logo</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="name" header="Nama Customer" :sortable="true"></Column>
                                <Column field="address" header="Alamat Customer" :sortable="true"></Column>
                                <Column field="npwp" header="NPWP Customer" :sortable="true"></Column>
                                <Column field="email" header="Email Customer" :sortable="true"></Column>
                                <Column field="phone" header="Phone Customer" :sortable="true"></Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <div class="d-inline-block">
                                            <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="openCustomerDetails(slotProps.data.id)">
                                                        <i class="ri-eye-line me-2"></i> Lihat Detail
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="openEditCustomerModal(slotProps.data)">
                                                        <i class="ri-edit-box-line me-2"></i> Edit
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item text-danger" href="javascript:void(0)" @click="deleteCustomer(slotProps.data.id)">
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
                    <!--/ customer Table -->
                </div>
            </div>
            <!--/ customer cards -->

            <!-- Placeholder untuk MenuModal component -->
            <Modal 
                :isEditMode="isEditMode"
                :validationErrorsFromParent="validationErrors"
                :title="modalTitle" 
                :description="modalDescription"
                :selectedCustomer="selectedCustomer"
            >
                <template #default>
                    <form @submit.prevent="handleSubmit">
                        <div class="row g-6">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="file" 
                                        class="form-control" 
                                        id="logoCustomer" 
                                        @change="onLogoChange"
                                        placeholder="Masukkan logo customer"
                                        :required="!isEditMode"
                                    >
                                    <label for="logoCustomer">Logo Customer</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="nmCustomer" 
                                        v-model="formCustomer.name" 
                                        placeholder="Masukkan nama customer"
                                        required
                                    >
                                    <label for="nmCustomer">Nama Customer</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="email" 
                                        class="form-control" 
                                        id="emailCustomer" 
                                        v-model="formCustomer.email" 
                                        placeholder="Masukkan email customer"
                                        required
                                    >
                                    <label for="emailCustomer">Email Customer</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    id="phoneCustomer" 
                                    v-model="formCustomer.phone" 
                                    placeholder="Masukkan no. telp customer"
                                    @input="formCustomer.phone = $event.target.value.replace(/[^0-9]/g, '')"
                                    inputmode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    >
                                    <label for="phoneCustomer">No. Telp Customer</label>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    id="npwpCustomer" 
                                    v-model="formCustomer.npwp" 
                                    placeholder="Masukkan npwp customer"
                                    @input="formCustomer.npwp = $event.target.value.replace(/[^0-9]/g, '')"
                                    inputmode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    >
                                    <label for="npwpCustomer">NPWP Customer</label>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <textarea
                                        class="form-control h-px-100"
                                        id="alamat_vendor"
                                        placeholder="Alamat Customer"
                                        v-model="formCustomer.address">
                                    </textarea>
                                    <label for="alamat_vendor">Alamat Customer</label>
                                </div>
                            </div>
                            <hr class="mt-7 w-70 justify-content-center" />
                            <div v-for="(item, index) in formCustomer.customerProducts" :key="index" class="repeater-item">
                                <div class="row">
                                    <div class="mb-6 col-lg-6 col-xl-6 col-12 mb-0">
                                        <div class="form-floating form-floating-outline">
                                            <v-select
                                                v-model="item.productId"
                                                :options="products"
                                                :get-option-label="product => `${product.name}`"
                                                :reduce="product => product.id"
                                                placeholder="-- Pilih Produk --"
                                                :id="`product-${index}`"
                                                class="product-select"
                                            />
                                            <div v-if="!products || products.length === 0" class="text-danger mt-1">
                                                Data produk belum tersedia.
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3 col-lg-4 col-xl-3 col-12 mb-0">
                                        <div class="form-floating form-floating-outline">
                                            <input
                                                type="text"
                                                :id="`price-${index}`"
                                                class="form-control"
                                                placeholder="Harga"
                                                :value="formatRupiah(item.priceSell)"
                                                @input="e => {
                                                    // Ambil hanya angka dari input
                                                    const angka = e.target.value.replace(/[^0-9]/g, '');
                                                    // Update model dengan angka mentah
                                                    item.priceSell = angka;
                                                }"
                                            />
                                            <label :for="`price-${index}`">Harga Jual</label>
                                        </div>
                                    </div>
                                    <div class="mb-3 col-lg-2 col-xl-3 col-12 mb-0">
                                        <button type="button" class="btn btn-sm btn-secondary" @click.prevent="removeItem(index)" style="width: 100%;">
                                            <span class="tf-icons ri-delete-bin-7-line ri-16px me-2"></span> Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-0">
                                <button class="btn btn-sm btn-primary" @click.prevent="addItem">
                                    <i class="ri-add-line me-1"></i>
                                    <span class="align-middle">Tambah Item</span>
                                </button>
                            </div>  
                            <div class="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    class="btn btn-primary me-2"
                                    @click="handleSaveCustomer"
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
import { useCustomerStore } from '~/stores/customer'
import { useProductStore } from '~/stores/product'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const config   = useRuntimeConfig();
const { $api } = useNuxtApp()

const myDataTableRef    = ref(null)
const customerStore     = useCustomerStore()
const productStore      = useProductStore()
const formatRupiah      = useFormatRupiah()
const selectedCustomer  = ref(null);
const customer          = ref([])
const products          = ref([])
const logoPreview       = ref('');
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

const formCustomer = ref({
  name: '',
  address: '',
  email: '',
  phone: '',
  npwp: '',
  logo: '',
  customerProducts: [
    {
      productId: null,
      priceSell: 0
    }
  ]
});

const getLogoUrl = (logoPath) => {
    if (!logoPath || typeof logoPath !== 'string') {
        return null;
    }
    if (logoPath.startsWith('http')) {
        return logoPath;
    }
    if (!config.public.apiBase) {
        return logoPath;
    }
    const origin = new URL(config.public.apiBase).origin;
    const imageUrl = `${origin}/${logoPath}`;
    return imageUrl;
};

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Customer' : 'Tambah Customer');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data customer di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan customer baru.');

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

const handleSaveCustomer = async () => {
    loading.value = true;
    validationErrors.value = [];

    try {
        if (!formCustomer.value.name || !formCustomer.value.npwp) {
            Swal.fire('Validasi', 'Nama dan NPWP customer wajib diisi.', 'warning');
            return;
        }

        const result = await customerStore.saveUpdateCustomer(formCustomer.value);

        await loadLazyData();
        handleCloseModal();
        await Swal.fire(
            'Berhasil!',
            result.message || `Customer berhasil ${isEditMode.value ? 'diperbarui' : 'dibuat'}.`,
            'success'
        );

    } catch (error) {
        const errorData = error.errorData || {};
        if (errorData.errors) {
            validationErrors.value = Array.isArray(errorData.errors)
                ? errorData.errors
                : Object.values(errorData.errors).flat();
            Swal.fire('Gagal', 'Terdapat kesalahan validasi data.', 'error');
        } else {
            Swal.fire('Gagal', errorData.message || `Gagal ${isEditMode.value ? 'memperbarui' : 'membuat'} customer`, 'error');
        }
    } finally {
        loading.value = false;
    }
};

// Fungsi untuk menangani event load lazy data dari customer
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

        const response = await fetch(`${$api.customer()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data customer dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data customer');
        }

        const result = await response.json();
        customer.value = result.data || []; 
        totalRecords.value = parseInt(result.meta.total) || 0;
        if (result.draw) {
             lazyParams.value.draw = parseInt(result.draw);
        }

    } catch (error) {
        console.error('Error loading lazy data for customer:', error);
        customer.value = [];
        totalRecords.value = 0;
        Swal.fire('Error', `Tidak dapat memuat data customer: ${error.message}`, 'error');
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    loadLazyData();
    if (typeof productStore.fetchProduct === 'function') {
        await productStore.fetchProduct();
    }
    // Pastikan productStore.product ada dan merupakan array sebelum melakukan map
    if (Array.isArray(productStore.product)) {
        products.value = productStore.product.map(product => ({
            id: product.id,
            name: `${product.name || product.sku || 'Produk'}`
        }));
    } else {
        products.value = [];
    }
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

function onLogoChange(e) {
  const file = e.target.files[0];
  formCustomer.value.logo = file;
  if (file) {
    const objectURL = URL.createObjectURL(file);
    logoPreview.value = objectURL;
  } else {
    formCustomer.value.logo = '';
  }
}

// View Customer Details
const openCustomerDetails = (customerId) => {
    try {
        router.push({ path: `/master/customer-detail?id=${customerId}` });
    } catch (e) {
        window.location.href = `/master/customer-detail?id=${customerId}`;
        console.error('Error fetching customer details:', e);
    }
};

const openAddCustomerModal = () => {
    isEditMode.value = false;
    modalTitle.value = 'Tambah Customer';
    modalDescription.value = 'Silakan isi form di bawah ini untuk menambahkan customer baru.';
    resetParentFormState();
};

async function openEditCustomerModal(vendorData) {
    isEditMode.value = true;
    selectedCustomer.value = { ...vendorData };
    validationErrors.value = [];

    resetParentFormState();

    const modalEl = document.getElementById('Modal');
    if (modalEl && window.bootstrap) {
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
    } else {
        console.error('CustomerModal element tidak ditemukan atau Bootstrap belum dimuat.');
        return;
    }

    try {
        loading.value = true;
        const token = localStorage.getItem('token');
        const response = await fetch(`${$api.customer()}/${vendorData.id}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Gagal mengambil detail data customer.');
        
        const data = await response.json();

        formCustomer.value = {
            id              : data.id,
            name            : data.name ?? '',
            address         : data.address ?? '',
            email           : data.email ?? '',
            phone           : data.phone ?? '',
            npwp            : data.npwp ?? '',
            logo            : data.logo ?? '',
            customerProducts: data.customerProducts && data.customerProducts.length > 0 ? data.customerProducts: []
        };

    } catch (error) {
        console.error("Error fetching customer details:", error);
        Swal.fire('Error', error.message || 'Tidak dapat memuat detail customer.', 'error');
        handleCloseModal();
    } finally {
        loading.value = false;
    }
}

const deleteCustomer = async (vendorId) => {
    if (!vendorId) return;

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

            url = `${$api.customer()}/${vendorId}`;

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
                throw new Error(errorData.message || 'Gagal menghapus customer');
            }

            loadLazyData();

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Customer berhasil dihapus.',
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
    formCustomer.value = {
        name: '',
        address: '',
        email: '',
        phone: '',
        npwp: '',
        logo: '',
        customerProducts: []
    };
};

// Add Item
const addItem = () => {
  formCustomer.value.customerProducts.push({
    productId: null,
    priceSell: 0
  });
};

// Remove Item
const removeItem = (index) => {
  formCustomer.value.customerProducts.splice(index, 1);
};
</script>

<style scoped>
    :deep(.product-select .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>