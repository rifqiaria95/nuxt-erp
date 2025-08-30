<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Customer</h4>
            <p class="mb-6">
            List customer yang terdaftar di sistem
            </p>
            <!-- customer cards -->
            <div class="row g-6 mb-6">
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
                                <button
                                @click="customerStore.openModal()"
                                class="btn btn-primary mb-2 text-nowrap add-new-role"
                                >
                                Tambah Customer
                                </button>
                                <p class="mb-0 mt-1">Buat Customer baru</p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Customer</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Customer.</p>
                </div>
                <div class="col-12">
                    <!-- customer Table -->
                    <div class="card">
                        <div class="card-header">
                            <TableControls
                                v-model="tableControls"
                                :rows-per-page-options="rowsPerPageOptionsArray"
                                search-placeholder="Cari customer..."
                                @rows-change="handleRowsChange"
                                @search="handleSearch"
                                @export="exportData"
                            />
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="customers" 
                            :rows="Number(params.rows)" 
                            :loading="loading"
                            :totalRecords="totalRecords"
                            :lazy="true"
                            @page="onPage($event)"
                            @sort="onSort($event)"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} data"
                            >
                            <Column field="id" header="#" :sortable="true"></Column> 
                                <Column field="logo" header="Logo" :sortable="true">
                                    <template #body="slotProps">
                                        <div v-if="slotProps.data.logo">
                                            <img 
                                                :src="getCustomerLogo(slotProps.data.logo)" 
                                                alt="Logo Customer" 
                                                style="height: 40px; max-width: 80px; object-fit: contain;" 
                                                @error="(e) => handleImageError(e, '/img/default-customer-logo.png')"
                                            />
                                        </div>
                                        <div v-else>
                                            <img 
                                                src="/img/default-customer-logo.png" 
                                                alt="Default Logo" 
                                                style="height: 40px; max-width: 80px; object-fit: contain;"
                                            />
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
                                                <li v-if="userHasRole('superadmin') || userHasPermission('view_customer')">
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="openCustomerDetails(slotProps.data.id)">
                                                        <i class="ri-eye-line me-2"></i> Lihat Detail
                                                    </a>
                                                </li>
                                                <li v-if="userHasRole('superadmin') || userHasPermission('edit_customer')">
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="customerStore.openModal(slotProps.data)">
                                                        <i class="ri-edit-box-line me-2"></i> Edit
                                                    </a>
                                                </li>
                                                <li v-if="userHasRole('superadmin') || userHasPermission('delete_customer')">
                                                    <a class="dropdown-item text-danger" href="javascript:void(0)" @click="customerStore.deleteCustomer(slotProps.data.id)">
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
                id="CustomerModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="customerStore.saveCustomer()">
                        <div class="row g-6">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="file" 
                                        class="form-control" 
                                        @change="onLogoChange"
                                        placeholder="Masukkan logo customer"
                                    >
                                    <label>Logo Customer</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        v-model="form.name" 
                                        placeholder="Masukkan nama customer"
                                        required
                                    >
                                    <label>Nama Customer</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="email" 
                                        class="form-control" 
                                        v-model="form.email" 
                                        placeholder="Masukkan email customer"
                                        required
                                    >
                                    <label>Email Customer</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="form.phone" 
                                    placeholder="Masukkan no. telp customer"
                                    required
                                    >
                                    <label>No. Telp Customer</label>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="form.npwp" 
                                    placeholder="Masukkan npwp customer"
                                    >
                                    <label>NPWP Customer</label>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <textarea
                                        class="form-control h-px-100"
                                        placeholder="Alamat Customer"
                                        v-model="form.address">
                                    </textarea>
                                    <label>Alamat Customer</label>
                                </div>
                            </div>
                            <hr class="mt-7 w-70 justify-content-center" />
                            <div v-for="(item, index) in form.customerProducts" :key="index" class="repeater-item">
                                <div class="row">
                                    <div class="mb-6 col-lg-6 col-xl-6 col-12 mb-0">
                                        <div class="form-floating form-floating-outline">
                                            <v-select
                                                v-model="item.productId"
                                                :options="products"
                                                :get-option-label="product => `${product.name}`"
                                                :reduce="product => product.id"
                                                placeholder="-- Pilih Produk --"
                                                class="product-select"
                                            />
                                        </div>
                                    </div>
                                    <div class="mb-3 col-lg-4 col-xl-3 col-12 mb-0">
                                        <div class="form-floating form-floating-outline">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="Harga"
                                                :value="formatRupiah(item.priceSell)"
                                                @input="e => {
                                                    const angka = e.target.value.replace(/[^0-9]/g, '');
                                                    item.priceSell = angka ? parseInt(angka) : 0;
                                                }"
                                            />
                                            <label>Harga Jual</label>
                                        </div>
                                    </div>
                                    <div class="mb-3 col-lg-2 col-xl-3 col-12 mb-0">
                                        <button type="button" class="btn btn-sm btn-secondary" @click.prevent="customerStore.removeItem(index)" style="width: 100%;">
                                            <span class="tf-icons ri-delete-bin-7-line ri-16px me-2"></span> Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-0">
                                <button class="btn btn-sm btn-primary" @click.prevent="customerStore.addItem()">
                                    <i class="ri-add-line me-1"></i>
                                    <span class="align-middle">Tambah Item</span>
                                </button>
                            </div>  
                            <div class="modal-footer mt-6">
                                <button type="button" class="btn btn-outline-secondary" @click="customerStore.closeModal()">Tutup</button>
                                <button type="submit" class="btn btn-primary" :disabled="loading">
                                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Simpan
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

import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia';
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import TableControls from '~/components/table/TableControls.vue'
import { useCustomerStore } from '~/stores/customer'
import { useProductStore } from '~/stores/product'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Column from 'primevue/column'
import { useDebounceFn } from '@vueuse/core'
import { useFormatRupiah } from '~/composables/formatRupiah';
import { usePermissionsStore } from '~/stores/permissions'
import { usePermissions } from '~/composables/usePermissions'
import { useUserStore } from '~/stores/user'
import { useRouter } from 'vue-router'
import { useDynamicTitle } from '~/composables/useDynamicTitle'
import { useImageUrl } from '~/composables/useImageUrl';

// Composables
const { setListTitle, setFormTitle } = useDynamicTitle()
const { getCustomerLogo, handleImageError } = useImageUrl();

const config   = useRuntimeConfig();
const router = useRouter()
const formatRupiah = useFormatRupiah()

const myDataTableRef                     = ref(null)
const customerStore                      = useCustomerStore()
const productStore                       = useProductStore()
const { userHasPermission, userHasRole } = usePermissions();
const permissionStore                    = usePermissionsStore()
const userStore                          = useUserStore()

const { customers, loading, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(customerStore)
const { products } = storeToRefs(productStore)
const { permissions } = storeToRefs(permissionStore)

const globalFilterValue = ref('')
const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

// Table controls data
const tableControls = ref({
  rows: 10,
  search: ''
});

const modalTitle = computed(() => isEditMode.value ? 'Edit Customer' : 'Tambah Customer');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data customer di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan customer baru.');



let modalInstance = null
onMounted(() => {
    permissionStore.fetchPermissions();
    userStore.loadUser();
    if (customerStore.customers.length === 0) {
      customerStore.fetchCustomers();
    }
    productStore.fetchProducts(); // Fetch products for the select dropdown
    const modalElement = document.getElementById('CustomerModal')
    if (modalElement) {
        modalInstance = new bootstrap.Modal(modalElement)
    }
    setListTitle('Customer', customers.value.length)
    
    // Initialize table controls
    tableControls.value.rows = params.value.rows;
    tableControls.value.search = globalFilterValue.value;
});

// Watch untuk sinkronisasi table controls
watch(() => params.value.rows, (newValue) => {
    tableControls.value.rows = newValue;
});

watch(() => globalFilterValue.value, (newValue) => {
    tableControls.value.search = newValue;
});

watch(showModal, (newValue) => {
    if (newValue) {
        modalInstance?.show()
    } else {
        modalInstance?.hide()
    }
})

const debouncedSearch = useDebounceFn(() => {
    customerStore.setSearch(globalFilterValue.value)
}, 500);
watch(globalFilterValue, debouncedSearch);

// Fungsi untuk menangani event load lazy data dari customer
const onPage = (event) => customerStore.setPagination(event);

const handleRowsChange = (value) => {
    const rowsValue = Number(value) || 10;
    params.value.rows = rowsValue;
    params.value.first = 0;
    customerStore.fetchCustomers();
};

const handleSearch = (value) => {
    globalFilterValue.value = value;
    params.value.first = 0;
    customerStore.fetchCustomers();
};

const onSort = (event) => customerStore.setSort(event);

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    } else if (format === 'pdf') {
        // Implement PDF export if needed
    }
};

function onLogoChange(e) {
  const file = e.target.files[0];
  if (file) {
    customerStore.handleLogoChange(file)
  }
}

// View Customer Details
const openCustomerDetails = (customerId) => {
    router.push({ path: `/sales/customer-detail`, query: { id: customerId } });
};

</script>

<style scoped>
    :deep(.product-select .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>