<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Quotation</h4>
            <p class="mb-6">
            List quotation yang terdaftar di sistem
            </p>
            <!-- quotation cards -->
            <div class="row g-6 mb-6">
                <!-- Static cards for display, can be made dynamic later -->
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h5 class="mb-1">Total Orders</h5>
                                <span class="badge bg-label-primary rounded-pill">Yearly</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <h1 class="mb-0 display-4">15</h1>
                                <i class="ri-arrow-up-s-line ri-24px text-success"></i>
                                <span class="fw-medium text-success">15.8%</span>
                            </div>
                            <p class="mb-0 mt-2">Analytics for last year</p>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h5 class="mb-1">Pending Orders</h5>
                                <span class="badge bg-label-warning rounded-pill">Weekly</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <h1 class="mb-0 display-4">5</h1>
                                <i class="ri-arrow-down-s-line ri-24px text-danger"></i>
                                <span class="fw-medium text-danger">8.2%</span>
                            </div>
                            <p class="mb-0 mt-2">Analytics for last week</p>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card h-100">
                        <div class="row h-100">
                            <div class="col-sm-5">
                                <div class="d-flex align-items-end h-100 justify-content-center">
                                    <img src="/img/illustrations/add-new-role-illustration.png" class="img-fluid" alt="Image" width="70">
                                </div>
                            </div>
                            <div class="col-sm-7">
                                <div class="card-body text-sm-end text-center ps-sm-0">
                                    <button v-if="userHasRole('superadmin') || userHasPermission('create_purchase_order')" @click="quotationStore.openModal()" class="btn btn-primary mb-2 text-wrap add-new-role">
                                        Tambah Quotation
                                    </button>
                                    <p class="mb-0 mt-1">Buat Quotation baru</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Quotation</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Quotation.</p>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <v-select v-model="filters.customerId" :options="customers || []" label="name" :reduce="v => v.id" placeholder="Pilih Customer" class="v-select-style"/>
                                </div>
                                <div class="col-md-6">
                                    <v-select v-model="filters.status" :options="statusOptions" label="label" :reduce="option => option.value" placeholder="Pilih Status" class="v-select-style"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <!-- quotation Table -->
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
                                            placeholder="Cari Quotation..."
                                            class="w-full md:w-20rem"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                            <MyDataTable 
                                ref="myDataTableRef"
                                :data="quotations" 
                                :rows="params.rows" 
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
                                    <Column header="#" :sortable="false">
                                        <template #body="slotProps">
                                            {{ params.first + slotProps.index + 1 }}
                                        </template>
                                    </Column>
                                    <Column field="noQuotation" header="No. Quotation" :sortable="true"></Column>
                                    <Column field="customer.name" header="Nama Customer" :sortable="true"></Column>
                                    <Column field="status" header="Status" :sortable="true">
                                        <template #body="slotProps">
                                            <span :class="getStatusBadge(slotProps.data.status).class">
                                                {{ getStatusBadge(slotProps.data.status).text }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="createdByUser.fullName" header="Dibuat Oleh" :sortable="true">
                                        <template #body="slotProps">
                                            <span>
                                                {{ slotProps.data.createdByUser?.fullName || '-' }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="approvedByUser.fullName" header="Approved By" :sortable="true">
                                        <template #body="slotProps">
                                            <span>
                                                {{ slotProps.data.approvedByUser?.fullName || '-' }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="up" header="Untuk Perhatian" :sortable="true"></Column>
                                    <Column field="date" header="Tanggal Quotation" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.date ? new Date(slotProps.data.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' }}
                                        </template>
                                    </Column>
                                    <Column field="validUntil" header="Berlaku Sampai" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.validUntil ? new Date(slotProps.data.validUntil).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' }}
                                        </template>
                                    </Column>
                                    <Column field="perusahaan.nmPerusahaan" header="Perusahaan" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.perusahaan?.nmPerusahaan || '-' }}
                                        </template>
                                    </Column>
                                    <Column field="cabang.nmCabang" header="Cabang" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.cabang?.nmCabang || '-' }}
                                        </template>
                                    </Column>
                                    <Column header="Actions" :exportable="false" style="min-width:8rem">
                                        <template #body="slotProps">
                                            <div class="d-inline-block">
                                                <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                                </a>
                                                <ul class="dropdown-menu">
                                                    <li v-if="userHasPermission('approve_purchase_order') && slotProps.data.status == 'draft'">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="quotationStore.approveQuotation(slotProps.data.id)">
                                                            <i class="ri-check-line me-2"></i> Approve
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('reject_purchase_order') && slotProps.data.status == 'draft')">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="quotationStore.rejectQuotation(slotProps.data.id)">
                                                            <i class="ri-close-line me-2"></i> Reject
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('view_purchase_order') && (slotProps.data.status == 'approved' || slotProps.data.status == 'partial' || slotProps.data.status == 'partial'))">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="viewQuotationDetails(slotProps.data.id)">
                                                            <i class="ri-eye-line me-2"></i> Lihat Detail
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('edit_purchase_order') && slotProps.data.status == 'draft')">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="quotationStore.fetchQuotationForEdit(slotProps.data.id)">
                                                            <i class="ri-edit-box-line me-2"></i> Edit
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('delete_purchase_order') && (slotProps.data.status == 'draft'))">
                                                        <a class="dropdown-item text-danger" href="javascript:void(0)" @click="quotationStore.deleteQuotation(slotProps.data.id)">
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
                    <!--/ quotation Table -->
                </div>
            </div>
            <!--/ quotation cards -->

            <Modal 
                id="QuotationModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="quotationStore.saveQuotation()">
                         <div class="row">
                            <div class="col">
                                <ul class="nav nav-tabs" role="tablist">
                                    <li class="nav-item">
                                        <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#form-tabs-info" role="tab" aria-selected="true" type="button">
                                            <span class="ri-user-line ri-20px d-sm-none"></span>
                                            <span class="d-none d-sm-block">Informasi Quotation</span>
                                        </button>
                                    </li>
                                    <li class="nav-item">
                                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#form-tabs-items" role="tab" aria-selected="false" type="button">
                                            <span class="ri-folder-user-line ri-20px d-sm-none"></span>
                                            <span class="d-none d-sm-block">List Product</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="tab-content pt-4">
                            <div class="tab-pane fade active show" id="form-tabs-info" role="tabpanel">
                                <div class="row g-4">
                                    <div class="col-md-12">
                                        <div class="form-floating form-floating-outline">
                                            <input type="hidden" v-model="form.noQuotation" class="form-control" placeholder="No PO" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select v-model="form.customerId" :options="customers || []" label="name" :reduce="v => v.id" placeholder="Pilih Customer" class="v-select-style"/>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" v-model="form.up" class="form-control" placeholder="Untuk Perhatian" required>
                                            <label>Untuk Perhatian</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="date" v-model="form.date" class="form-control" required>
                                            <label>Tanggal Quotation</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="date" v-model="form.shipDate" class="form-control">
                                            <label>Tanggal Pengiriman</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="date" v-model="form.validUntil" class="form-control" required>
                                            <label>Berlaku Sampai</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select 
                                            v-model="form.perusahaanId" 
                                            :options="perusahaans || []" 
                                            label="nmPerusahaan" 
                                            :reduce="p => p.id" 
                                            placeholder="Pilih Perusahaan" 
                                            class="v-select-style"
                                        />
                                    </div>
                                    <div class="col-md-6">
                                        <v-select 
                                            v-model="form.cabangId" 
                                            :options="filteredCabangs" 
                                            label="nmCabang" 
                                            :reduce="c => c.id" 
                                            placeholder="Pilih Cabang" 
                                            class="v-select-style"
                                        />
                                    </div>

                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="number" v-model="form.discountPercent" class="form-control" placeholder="Discount (%)">
                                            <label>Discount (%)</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="number" v-model="form.taxPercent" class="form-control" placeholder="Tax (%)">
                                            <label>Tax (%)</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" v-model="form.fobPoint" class="form-control" placeholder="FOB Point">
                                            <label>FOB Point</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" v-model="form.termsOfPayment" class="form-control" placeholder="Terms of Payment">
                                            <label>Terms of Payment</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" v-model="form.prNumber" class="form-control" placeholder="PR Number">
                                            <label>PR Number</label>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-floating form-floating-outline">
                                            <textarea v-model="form.description" class="form-control" placeholder="Deskripsi"></textarea>
                                            <label>Deskripsi</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="form-tabs-items" role="tabpanel">
                                <div v-for="(item, index) in form.quotationItems" :key="index" class="repeater-item mb-4">
                                    <div class="row g-3">
                                        <div class="col-md-4">
                                            <v-select 
                                                v-model="item.productId" 
                                                :options="products || []" 
                                                :get-option-label="p => `${p.name} (${p.unit?.name})`" 
                                                :reduce="p => p.id" 
                                                placeholder="Pilih Produk" 
                                                @update:modelValue="onProductChange(index)" 
                                                class="v-select-style"
                                            />
                                            <small class="text-muted">Selected: {{ item.productId }}</small>
                                        </div>
                                        <div class="col-md-2">
                                            <div class="form-floating form-floating-outline">
                                                <input type="number" v-model.number="item.quantity" @input="onQuantityChange(index)" class="form-control" placeholder="Qty">
                                                <label>Jumlah</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" :value="formatRupiah(item.price)" class="form-control" placeholder="Harga" readonly>
                                                <label>Harga</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" :value="formatRupiah(item.subtotal)" class="form-control" placeholder="Subtotal" readonly>
                                                <label>Subtotal</label>
                                            </div>
                                        </div>
                                        <div class="col-md-9">
                                             <div class="form-floating form-floating-outline">
                                                <input type="text" v-model="item.description" class="form-control" placeholder="Deskripsi item">
                                                <label>Deskripsi</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3 d-flex align-items-center">
                                            <button @click.prevent="quotationStore.removeItem(index)" class="btn btn-outline-danger w-100">Hapus</button>
                                        </div>
                                    </div>
                                    <hr class="my-4">
                                </div>
                                <div class="mt-4">
                                    <button @click.prevent="quotationStore.addItem()" class="btn btn-primary">Tambah Item</button>
                                </div>
                                <div class="d-flex justify-content-end mt-4">
                                    <span class="fw-bold fs-5">Grand Total: {{ formatRupiah(grandTotal) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer mt-6">
                             <button type="button" class="btn btn-outline-secondary" @click="quotationStore.closeModal()">Tutup</button>
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                Simpan
                            </button>
                        </div>
                    </form>
                </template>
            </Modal>
        </div>
         <div class="content-backdrop fade"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuotationStore } from '~/stores/quotation'
import { useCustomerStore } from '~/stores/customer'
import { usePerusahaanStore } from '~/stores/perusahaan'
import { useCabangStore } from '~/stores/cabang'
import { useProductStore } from '~/stores/product'
import { useUserStore } from '~/stores/user'
import { usePermissionsStore } from '~/stores/permissions'
import { usePermissions } from '~/composables/usePermissions'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import vSelect from 'vue-select'
import Dropdown from 'primevue/dropdown'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import 'vue-select/dist/vue-select.css'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useDynamicTitle } from '~/composables/useDynamicTitle'

// Composables
const { setListTitle, setFormTitle } = useDynamicTitle()

const config = useRuntimeConfig();
const router = useRouter();

// Store
const myDataTableRef                     = ref(null)
const quotationStore                     = useQuotationStore()
const customerStore                        = useCustomerStore()
const perusahaanStore                    = usePerusahaanStore()
const cabangStore                        = useCabangStore()
const productStore                       = useProductStore()
const userStore                          = useUserStore()
const formatRupiah                       = useFormatRupiah()
const { userHasPermission, userHasRole } = usePermissions();
const permissionStore                    = usePermissionsStore()

const { quotations, loading, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(quotationStore)
const { customers }     = storeToRefs(customerStore)
const { perusahaans } = storeToRefs(perusahaanStore)
const { cabangs }     = storeToRefs(cabangStore)
const { products }    = storeToRefs(productStore)
const { user }        = storeToRefs(userStore)
const { permissions } = storeToRefs(permissionStore)

// State
const globalFilterValue = ref('');
const attachmentPreview = ref(null);
const filters = ref({
    search: '',
    customerId: null,
    status: null,
});

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);
const modalTitle = computed(() => isEditMode.value ? 'Edit Quotation' : 'Tambah Quotation');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data quotation di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan quotation baru.');

const grandTotal = computed(() => {
  if (!form.value || !form.value.quotationItems) return 0;

  const totalItems = (form.value.quotationItems || []).reduce((total, item) => {
    return total + (Number(item.subtotal) || 0);
  }, 0);

  const discountPercent = Number(form.value.discountPercent) || 0;
  const taxPercent = Number(form.value.taxPercent) || 0;

  const discountAmount = totalItems * (discountPercent / 100);
  const totalAfterDiscount = totalItems - discountAmount;
  const taxAmount = totalAfterDiscount * (taxPercent / 100);

  return totalAfterDiscount + taxAmount;
});

const statusOptions = ref([
    { label: 'Draft', value: 'draft' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
]);


let modalInstance = null;
onMounted(() => {
    quotationStore.fetchQuotations();
    customerStore.fetchCustomers();
    perusahaanStore.fetchPerusahaans();
    cabangStore.fetchCabangs();
    productStore.fetchProducts();
    userStore.loadUser();
    permissionStore.fetchPermissions();
    
    const modalElement = document.getElementById('QuotationModal')
    if (modalElement) {
        modalInstance = new bootstrap.Modal(modalElement)
    }
    setListTitle('Quotation', quotations.value.length)
});

watch(showModal, (newValue) => {
    if (newValue) {
        modalInstance?.show()
    } else {
        modalInstance?.hide()
    }
})

watch(products, (newProducts) => {
    if (newProducts && newProducts.length > 0) {
    }
})

watch(filters, (newFilters) => {
    if (!newFilters) return;
    const { page, rows, ...restFilters } = newFilters;
    quotationStore.setFilters(restFilters);
}, { deep: true });

watch(() => form.value?.quotationItems, (newItems) => {
    if (newItems && newItems.length > 0) {
    }
}, { deep: true })

watch(() => form.value?.perusahaanId, (newPerusahaanId) => {
    if (newPerusahaanId && form.value) {
        if(!isEditMode.value) {
            form.value.cabangId = null;
        }
    }
});

const filteredCabangs = computed(() => {
    if (!form.value?.perusahaanId || !cabangs.value) return [];
    return (cabangs.value || []).filter(c => c.perusahaanId === form.value.perusahaanId);
});

const debouncedSearch = useDebounceFn(() => {
    if (globalFilterValue.value !== undefined) {
        quotationStore.setSearch(globalFilterValue.value)
    }
}, 500)

watch(globalFilterValue, (newValue) => {
    if (newValue !== undefined) {
        debouncedSearch();
    }
});

const onPage = (event) => {
    if (event) {
        quotationStore.setPagination(event);
    }
};
const handleRowsChange = () => {
    if (!params.value) return;
    params.value.first = 0;
    quotationStore.fetchQuotations();
};
const onSort = (event) => {
    if (event) {
        quotationStore.setSort(event);
    }
};

const exportData = (format) => {
    if (format === 'csv' && myDataTableRef.value) {
        myDataTableRef.value.exportCSV();
    }
};

function onFileChange(e) {
  if (!form.value) return;
  
  const file = e.target.files[0];
  if (file) {
    form.value.attachment = file;
    attachmentPreview.value = URL.createObjectURL(file);
  } else {
    form.value.attachment = null;
    attachmentPreview.value = null;
  }
}

const onProductChange = (index) => {
  if (!form.value || !form.value.quotationItems) return;
  
  const selectedProductId = form.value.quotationItems[index].productId;
  const selectedProduct = (products.value || []).find(p => p.id === selectedProductId);

  if (selectedProduct) {
    const item = form.value.quotationItems[index];
    item.price = Number(selectedProduct.priceBuy) || 0;
    calculateSubtotal(index);
  }
};

const onQuantityChange = (index) => {
  if (!form.value || !form.value.quotationItems) return;
  calculateSubtotal(index);
};

const calculateSubtotal = (index) => {
  if (!form.value || !form.value.quotationItems) return;
  
  const item = form.value.quotationItems[index];
  if (!item) return;
  
  const quantity = Number(item.quantity) || 0;
  const price = Number(item.price) || 0;
  
  item.subtotal = quantity * price;
};

const viewQuotationDetails = (quotationId) => {
    if (!quotationId) return;
    router.push({ path: `/sales/quotation-detail`, query: { id: quotationId } });
};

const getStatusBadge = (status) => {
    if (!status) return { text: '-', class: 'badge rounded-pill bg-label-light' };
    
    switch (status) {
        case 'draft': return { text: 'Draft', class: 'badge rounded-pill bg-label-secondary' };
        case 'approved': return { text: 'Approved', class: 'badge rounded-pill bg-label-primary' };
        case 'rejected': return { text: 'Rejected', class: 'badge rounded-pill bg-label-danger' };
        default: return { text: '-', class: 'badge rounded-pill bg-label-light' };
    }
};

</script>

<style scoped>
    .v-select-style {
        min-height: 48px;
    }

    :deep(.v-select-style .vs__dropdown-toggle),
    :deep(.perusahaan .vs__dropdown-toggle),
    :deep(.status .vs__dropdown-toggle),
    :deep(.customer .vs__dropdown-toggle),
    :deep(.product-select .vs__dropdown-toggle),
    :deep(.cabang .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>