<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Sales Return</h4>
            <p class="mb-6">
            List Sales Return yang terdaftar di sistem
            </p>
            <!-- salesReturn cards -->
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
                                    <button v-if="userHasRole('superadmin') || userHasPermission('create_sales_return')" @click="salesReturnStore.openModal(null)" class="btn btn-primary mb-2 text-wrap add-new-role">
                                        Tambah Sales Return
                                    </button>
                                    <p class="mb-0 mt-1">Buat Sales Return baru</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total & Filter Sales Return</h4>
                    <p class="mb-0">Temukan semua akun administrator perusahaan Anda dan Sales Return terkait.</p>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <v-select v-model="filters.customerId" :options="customers" label="name" :reduce="c => c.id" placeholder="Pilih Customer" class="v-select-style"/>
                                </div>
                                <div class="col-md-4">
                                    <v-select v-model="filters.perusahaanId" :options="perusahaans" label="nmPerusahaan" :reduce="p => p.id" placeholder="Pilih Perusahaan" class="v-select-style"/>
                                </div>
                                <div class="col-md-4">
                                    <v-select v-model="filters.status" :options="statusOptions" label="label" :reduce="option => option.value" placeholder="Pilih Status" class="v-select-style"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <!-- salesReturn Table -->
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
                                            placeholder="Cari Sales Return..."
                                            class="w-full md:w-20rem"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                            <MyDataTable 
                                ref="myDataTableRef"
                                :data="salesReturns" 
                                :rows="Number(params.rows)" 
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
                                    <Column field="noSr" header="No. SR" :sortable="true" class="text-nowrap">
                                        <template #body="slotProps">
                                            <span>
                                                {{ slotProps.data.noSr || '-' }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="salesOrder.noSo" header="No. SO" :sortable="true" class="text-nowrap">
                                        <template #body="slotProps">
                                            <span v-if="slotProps.data.salesOrder?.noSo && slotProps.data.salesOrder?.id">
                                                <a
                                                    :href="`/sales/sales-order-detail?id=${slotProps.data.salesOrder.id}`"
                                                    style="text-decoration: underline; color: #007bff;"
                                                >
                                                    {{ slotProps.data.salesOrder.noSo }}
                                                </a>
                                            </span>
                                            <span v-else>
                                                -
                                            </span>
                                        </template>
                                    </Column>
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
                                    <Column field="salesOrder.up" header="Untuk Perhatian" :sortable="true"></Column>
                                    <Column field="returnDate" header="Tanggal" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.returnDate ? new Date(slotProps.data.returnDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' }}
                                        </template>
                                    </Column>
                                    <Column field="perusahaan.nmPerusahaan" header="Perusahaan" :sortable="true"></Column>
                                    <Column field="cabang.nmCabang" header="Cabang" :sortable="true"></Column>
                                    <Column field="attachment" header="Nama File" :sortable="true">
                                        <template #body="slotProps">
                                            <div v-if="slotProps.data.attachment">
                                                <a :href="getAttachmentUrl(slotProps.data.attachment)" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: #007bff;">
                                                    {{ slotProps.data.attachment.split('/').pop() }}
                                                </a>
                                            </div>
                                            <div v-else>
                                                <span class="text-muted">Tidak ada file</span>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column header="Actions" :exportable="false" style="min-width:8rem">
                                        <template #body="slotProps">
                                            <div class="d-inline-block">
                                                <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                                </a>
                                                <ul class="dropdown-menu">
                                                    <li v-if="userHasPermission('approve_sales_return') && slotProps.data.status == 'draft'">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="salesReturnStore.approveSalesReturn(slotProps.data.id)">
                                                            <i class="ri-check-line me-2"></i> Approve
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('reject_sales_return') && slotProps.data.status == 'draft')">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="salesReturnStore.rejectSalesReturn(slotProps.data.id)">
                                                            <i class="ri-close-line me-2"></i> Reject
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('edit_sales_return') && slotProps.data.status == 'draft')">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="salesReturnStore.openModal(slotProps.data)">
                                                            <i class="ri-edit-box-line me-2"></i> Edit
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || userHasPermission('delete_sales_return')">
                                                        <a class="dropdown-item text-danger" href="javascript:void(0)" @click="salesReturnStore.deleteSalesReturn(slotProps.data.id)">
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
                    <!--/ salesReturn Table -->
                </div>
            </div>
            <!--/ salesReturn cards -->

            <Modal 
                id="SalesReturnModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="salesReturnStore.saveSalesReturn()">
                         <div class="row">
                            <div class="col">
                                <ul class="nav nav-tabs" role="tablist">
                                    <li class="nav-item">
                                        <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#form-tabs-info" role="tab" aria-selected="true" type="button">
                                            <span class="ri-user-line ri-20px d-sm-none"></span>
                                            <span class="d-none d-sm-block">Informasi Sales Return</span>
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
                        <div class="tab-content pt-6">
                            <div class="tab-pane fade active show" id="form-tabs-info" role="tabpanel">
                                <div class="row g-4">
                                    <div class="col-md-12">
                                        <div class="form-floating form-floating-outline">
                                            <input type="hidden" v-model="form.noSr" class="form-control" placeholder="No SR" required>
                                        </div>
                                    </div>
                                     <div class="col-md-6">
                                        <v-select v-model="form.customerId" :options="customers" label="name" :reduce="c => c.id" placeholder="Pilih Customer" class="v-select-style"/>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select v-model="form.salesOrderId" :options="salesOrders" label="noSo" :reduce="so => so.id" placeholder="Pilih Sales Order" class="v-select-style" :disabled="!form.customerId"/>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" v-model="form.up" class="form-control" placeholder="Untuk Perhatian" readonly>
                                            <label>Untuk Perhatian</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="date" v-model="form.returnDate" class="form-control" required>
                                            <label>Tanggal Pengembalian</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select v-model="form.perusahaanId" :options="perusahaans" label="nmPerusahaan" :reduce="p => p.id" placeholder="Pilih Perusahaan" class="v-select-style" readonly/>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select v-model="form.cabangId" :options="filteredCabangs" label="nmCabang" :reduce="c => c.id" placeholder="Pilih Cabang" class="v-select-style" readonly/>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="file" @change="onFileChange" class="form-control">
                                            <label>Attachment</label>
                                            <a v-if="attachmentPreview" :href="attachmentPreview" target="_blank" class="d-block mt-1">Lihat Attachment</a>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" :value="formatRupiah(form.totalReturnAmount)" class="form-control" placeholder="Total">
                                            <label>Total Pengembalian</label>
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
                                <div v-for="(item, index) in form.salesReturnItems" :key="index" class="repeater-item mb-4">
                                    <div class="row g-3">
                                        <div class="col-6">
                                            <v-select v-model="item.warehouseId" :options="warehouses"
                                            :get-option-label="w => `${w.name} (${w.code})`" :reduce="w => w.id" placeholder="Pilih Gudang" class="v-select-style" readonly/>
                                        </div>
                                        <div class="col-md-6">
                                            <v-select v-model="item.productId" :options="allAvailableProducts" :get-option-label="p => `${p.name} (${p.unit?.name})`" :reduce="p => p.id" placeholder="Pilih Produk" @update:modelValue="onProductChange(index)" class="v-select-style" readonly/>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-floating form-floating-outline">
                                                <input type="number" v-model.number="item.quantity" class="form-control" placeholder="Qty" readonly>
                                                <label>Jumlah</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" :value="formatRupiah(item.price)" class="form-control" placeholder="Harga" readonly>
                                                <label>Harga</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" v-model="item.reason" class="form-control" placeholder="Alasan">
                                                <label>Alasan</label>
                                            </div>
                                        </div>
                                        <div class="col-md-9">
                                             <div class="form-floating form-floating-outline">
                                                <input type="text" v-model="item.description" class="form-control" placeholder="Deskripsi item" readonly>
                                                <label>Deskripsi</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3 d-flex align-items-center">
                                            <button @click.prevent="salesReturnStore.removeItem(index)" class="btn btn-outline-danger w-100">Hapus</button>
                                        </div>
                                    </div>
                                    <hr class="my-4">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer mt-6">
                             <button type="button" class="btn btn-outline-secondary" @click="salesReturnStore.closeModal()">Tutup</button>
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
import { useSalesReturnStore } from '~/stores/sales-return'
import { useCustomerStore } from '~/stores/customer'
import { usePerusahaanStore } from '~/stores/perusahaan'
import { useCabangStore } from '~/stores/cabang'
import { useProductStore } from '~/stores/product'
import { useWarehouseStore } from '~/stores/warehouse'

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
const myDataTableRef        = ref(null)
const salesReturnStore       = useSalesReturnStore()
const customerStore         = useCustomerStore()
const perusahaanStore       = usePerusahaanStore()
const warehouseStore        = useWarehouseStore()
const cabangStore           = useCabangStore()
const productStore          = useProductStore()

const userStore             = useUserStore()
const formatRupiah          = useFormatRupiah()
const { userHasPermission, userHasRole } = usePermissions();
const permissionStore       = usePermissionsStore()

const { salesReturns, salesOrders, loading, totalRecords, params, form, isEditMode, showModal, validationErrors, allAvailableProducts } = storeToRefs(salesReturnStore)
const { customers }   = storeToRefs(customerStore)
const { perusahaans } = storeToRefs(perusahaanStore)
const { cabangs }     = storeToRefs(cabangStore)
const { warehouses }  = storeToRefs(warehouseStore)
const { products }    = storeToRefs(productStore)
const { user }        = storeToRefs(userStore)
const { permissions } = storeToRefs(permissionStore)

// State
const filters = ref({
  customerId: null,
  perusahaanId: null,
  status: null,
  search: '',
});
const globalFilterValue = ref('');
const attachmentPreview = ref(null);

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);
const modalTitle = computed(() => isEditMode.value ? 'Edit Sales Return' : 'Tambah Sales Return');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data Sales Return di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan data Sales Return baru.');

const getAttachmentUrl = (attachmentPath) => {
    if (!attachmentPath || typeof attachmentPath !== 'string') return null;
    if (attachmentPath.startsWith('http')) return attachmentPath;
    const baseUrl = (config.public.apiBase || '').replace('/api', '');
    return `${baseUrl}/${attachmentPath}`;
};

const statusOptions = ref([
    { label: 'Draft', value: 'draft' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
]);

let modalInstance = null;
onMounted(() => {
    salesReturnStore.fetchSalesReturns();
    customerStore.fetchCustomers();
    perusahaanStore.fetchPerusahaans();
    cabangStore.fetchCabangs();
    productStore.fetchProducts();
    warehouseStore.fetchWarehouses();
    permissionStore.fetchPermissions();
    userStore.loadUser();

    const modalElement = document.getElementById('SalesReturnModal')
    if (modalElement) {
        modalInstance = new bootstrap.Modal(modalElement)
    }
    setListTitle('Sales Return', salesReturns.value.length)
});

watch(showModal, (newValue) => {
    if (newValue) {
        modalInstance?.show()
        if (isEditMode.value) {
            if (form.value.attachment_url) {
                attachmentPreview.value = form.value.attachment_url
            } else if (form.value.attachment) {
                attachmentPreview.value = getAttachmentUrl(form.value.attachment)
            } else {
                attachmentPreview.value = null
            }
            

        } else {
            attachmentPreview.value = null
        }
    } else {
        modalInstance?.hide()
    }
})

watch(() => form.value.perusahaanId, (newPerusahaanId, oldPerusahaanId) => {
    if (oldPerusahaanId && newPerusahaanId !== oldPerusahaanId && !isEditMode.value) {
        form.value.cabangId = null;
    }
});

watch(() => form.value.customerId, (newCustomerId, oldCustomerId) => {
  if (newCustomerId && newCustomerId !== oldCustomerId) {
    salesReturnStore.fetchSalesOrdersByCustomer(newCustomerId);
    form.value.salesOrderId = null;
    form.value.salesReturnItems = [];
    salesReturnStore.addItem();
  } else if (!newCustomerId) {
    salesReturnStore.salesOrders = [];
    form.value.salesOrderId = null;
    form.value.salesReturnItems = [];
    salesReturnStore.addItem();
  }
});

watch(() => form.value.salesOrderId, (newSalesOrderId) => {
    if (newSalesOrderId) {
        salesReturnStore.populateFormFromSalesOrder(newSalesOrderId);
    }
});

watch(() => salesReturnStore.allAvailableProducts, (newProducts) => {
  if (form.value.salesReturnItems && newProducts) {
    form.value.salesReturnItems.forEach(item => {
      const productExists = newProducts.some(p => p.id === item.productId);
      if (!productExists) {
        item.productId = null;
        item.price = 0;
        item.quantity = 1;
        item.subtotal = 0;
      }
    });
  }
}, { deep: true });

const filteredCabangs = computed(() => {
    if (!form.value.perusahaanId || !cabangs.value) return [];
    return cabangs.value.filter(c => c.perusahaanId === form.value.perusahaanId);
});

watch(globalFilterValue, useDebounceFn((newValue) => {
    filters.value.search = newValue;
}, 500));

watch(filters, (newFilters) => {
    const { page, rows, ...restFilters } = newFilters;
    salesReturnStore.setFilters(restFilters);
}, { deep: true });

const onPage = (event) => {
    if (event) {
        salesReturnStore.setPagination(event);
    }
};

const handleRowsChange = (value) => {
    const rowsValue = Number(value) || 10;
    params.value.rows = rowsValue;
    params.value.first = 0;
    salesReturnStore.fetchSalesReturns();
};

const onSort = (event) => {
    if (event) {
        salesReturnStore.setSort(event);
    }
};

const exportData = (format) => {
    if (format === 'csv') myDataTableRef.value.exportCSV();
};

function onFileChange(e) {
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
  const selectedProductId = form.value.salesReturnItems[index].productId;
  const selectedProduct = allAvailableProducts.value.find(p => p.id === selectedProductId);

  if (selectedProduct) {
    const item = form.value.salesReturnItems[index];
    item.price = Number(selectedProduct.priceSell) || 0;
  }
};

const getStatusBadge = (status) => {
    switch (status) {
        case 'draft': return { text: 'Draft', class: 'badge rounded-pill bg-label-secondary' };
        case 'approved': return { text: 'Approved', class: 'badge rounded-pill bg-label-primary' };
        case 'rejected': return { text: 'Rejected', class: 'badge rounded-pill bg-label-danger' };
        case 'returned': return { text: 'Returned', class: 'badge rounded-pill bg-label-info' };
    }
};

const getPaymentMethodBadge = (paymentMethod) => {
    switch (paymentMethod) {
        case 'cash': return { text: 'Cash', class: 'badge rounded-pill bg-label-success' };
        case 'transfer': return { text: 'Transfer', class: 'badge rounded-pill bg-label-primary' };
        case 'qris': return { text: 'QRIS', class: 'badge rounded-pill bg-label-danger' };
        case 'card': return { text: 'Card', class: 'badge rounded-pill bg-label-secondary' };
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
    :deep(.warehouse-select .vs__dropdown-toggle),
    :deep(.status .vs__dropdown-toggle),
    :deep(.vendor .vs__dropdown-toggle),
    :deep(.product-select .vs__dropdown-toggle),
    :deep(.cabang .vs__dropdown-toggle),
    :deep(.select-payment-method .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>