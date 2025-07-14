<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Sales Invoice</h4>
            <p class="mb-6">
            List salesInvoice yang terdaftar di sistem
            </p>
            <!-- salesInvoice cards -->
            <div class="row g-6 mb-6">
                <!-- Static cards for display, can be made dynamic later -->
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h5 class="mb-1">Total Invoices</h5>
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
                                <h5 class="mb-1">Pending Invoices</h5>
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
                                    <button @click="salesInvoiceStore.openModal(null, 'admin')" class="btn btn-primary mb-2 text-wrap add-new-role">
                                        Tambah Sales Invoice
                                    </button>
                                    <p class="mb-0 mt-1">Buat Sales Invoice baru</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total & Filter Sales Invoice</h4>
                    <p class="mb-0">Temukan semua akun administrator perusahaan Anda dan Sales Invoice terkait.</p>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <v-select v-model="filters.customerId" :options="customers" label="name" :reduce="c => c.id" placeholder="Pilih Customer" class="v-select-style"/>
                                </div>
                                <div class="col-md-6">
                                    <v-select v-model="filters.status" :options="statusOptions" label="label" :reduce="option => option.value" placeholder="Pilih Status" class="v-select-style"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <!-- salesInvoice Table -->
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
                                            placeholder="Cari Sales Invoice..."
                                            class="w-full md:w-20rem"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                            <MyDataTable 
                                ref="myDataTableRef"
                                :data="salesInvoices"
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
                                    <Column field="noInvoice" header="No. Invoice" :sortable="true">
                                        <template #body="slotProps">
                                            <span>
                                                {{ slotProps.data.noInvoice || '-' }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="salesOrder.noSo" header="No. SO" :sortable="true">
                                        <template #body="slotProps">
                                            <span>
                                                {{ slotProps.data.salesOrder?.noSo || '-' }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="customer.name" header="Customer" :sortable="true">
                                        <template #body="slotProps">
                                            <span>
                                                {{ slotProps.data.customer?.name || '-' }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="date" header="Tanggal" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.date ? new Date(slotProps.data.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' }}
                                        </template>
                                    </Column>
                                    <Column field="dueDate" header="Jatuh Tempo" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.dueDate ? new Date(slotProps.data.dueDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' }}
                                        </template>
                                    </Column>
                                    <Column field="status" header="Status" :sortable="true">
                                        <template #body="slotProps">
                                            <span :class="getStatusBadge(slotProps.data.status).class">
                                                {{ getStatusBadge(slotProps.data.status).text }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="salesOrder.perusahaan.nmPerusahaan" header="Perusahaan" :sortable="true">
                                        <template #body="slotProps">
                                            <span>
                                                {{ slotProps.data.salesOrder?.perusahaan?.nmPerusahaan || '-' }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="salesOrder.cabang.nmCabang" header="Cabang" :sortable="true">
                                        <template #body="slotProps">
                                            <span>
                                                {{ slotProps.data.salesOrder?.cabang?.nmCabang || '-' }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column header="Actions" :exportable="false" style="min-width:8rem">
                                        <template #body="slotProps">
                                            <div class="d-inline-block">
                                                <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                                </a>
                                                <ul class="dropdown-menu">
                                                    <li v-if="userHasRole('superadmin') || userHasPermission('view_sales_invoice')">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="viewSalesInvoiceDetails(slotProps.data.id)">
                                                            <i class="ri-eye-line me-2"></i> Lihat Detail
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('edit_sales_invoice') && slotProps.data.status == 'unpaid')">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="salesInvoiceStore.openModal(slotProps.data, 'admin')">
                                                            <i class="ri-edit-box-line me-2"></i> Edit
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || userHasPermission('delete_sales_invoice')">
                                                        <a class="dropdown-item text-danger" href="javascript:void(0)" @click="salesInvoiceStore.deleteSalesInvoice(slotProps.data.id)">
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
                    <!--/ salesInvoice Table -->
                </div>
            </div>
            <!--/ salesInvoice cards -->

            <Modal 
                id="SalesInvoiceModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="salesInvoiceStore.saveSalesInvoice()">
                         <div class="row">
                            <div class="col">
                                <ul class="nav nav-tabs" role="tablist">
                                    <li class="nav-item">
                                        <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#form-tabs-info" role="tab" aria-selected="true" type="button">
                                            <span class="ri-user-line ri-20px d-sm-none"></span>
                                            <span class="d-none d-sm-block">Informasi Sales Invoice</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="tab-content pt-6">
                            <div class="tab-pane fade active show" id="form-tabs-info" role="tabpanel">
                                <div class="row g-4">
                                    <div class="col-md-6">
                                        <v-select 
                                            v-model="form.salesOrderId" 
                                            :options="salesOrders || []" 
                                            label="noSo" 
                                            :reduce="so => so.id" 
                                            placeholder="Pilih Sales Order" 
                                            class="v-select-style sales-order-select"
                                            :filterable="true"
                                            :searchable="true"
                                            :get-option-label="getSalesOrderLabel"
                                            :loading="loading"
                                        >
                                            <template #option="option">
                                                <div class="d-flex justify-content-between align-items-center w-100">
                                                    <div>
                                                        <div class="fw-bold">{{ option.noSo }}</div>
                                                        <small class="text-muted">{{ option.customer?.name || 'No Customer' }}</small>
                                                    </div>
                                                    <div class="text-end">
                                                        <small class="text-muted">{{ formatDate(option.date) }}</small>
                                                    </div>
                                                </div>
                                            </template>
                                        </v-select>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select v-model="form.customerId" :options="customers" label="name" :reduce="c => c.id" placeholder="Pilih Customer" class="v-select-style" :disabled="!!form.salesOrderId"/>
                                        <div v-if="form.salesOrderId" class="form-text mt-1">
                                            <small class="text-muted">📋 Customer diambil dari Sales Order yang dipilih</small>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="date" v-model="form.date" class="form-control" required>
                                            <label>Tanggal Invoice</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="date" v-model="form.dueDate" class="form-control" required>
                                            <label>Jatuh Tempo Invoice</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select
                                            v-model="form.status"
                                            :options="statusOptions"
                                            label="label"
                                            :reduce="option => option.value"
                                            placeholder="-- Pilih Status --"
                                            id="status"
                                            class="status"
                                        />   
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="number" v-model="form.discountPercent" class="form-control" placeholder="Discount (%)" :readonly="!!form.salesOrderId">
                                            <label>Discount Invoice (%)</label>
                                            <div v-if="form.salesOrderId" class="form-text">
                                                <small class="text-muted">📋 Diambil dari Sales Order</small>
                                            </div>
                                            <div class="form-text mt-1">
                                                <small class="text-info">💰 {{ formatRupiah(discountAmount) }}</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="number" v-model="form.taxPercent" class="form-control" placeholder="Tax (%)" :readonly="!!form.salesOrderId">
                                            <label>Tax Invoice (%)</label>
                                            <div v-if="form.salesOrderId" class="form-text">
                                                <small class="text-muted">📋 Diambil dari Sales Order</small>
                                            </div>
                                            <div class="form-text mt-1">
                                                <small class="text-info">💰 {{ formatRupiah(taxAmount) }}</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" :value="formatRupiah(form.total)" @input="updateTotalFromInput" class="form-control" placeholder="Total" :readonly="!!form.salesOrderId">
                                            <label>Total</label>
                                            <div v-if="form.salesOrderId" class="form-text">
                                                <small class="text-muted">📋 Diambil dari Sales Order</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" :value="formatRupiah(form.paidAmount)" @input="updatePaidAmountFromInput" class="form-control" placeholder="Paid Amount" :class="{ 'is-invalid': !isPaidAmountValid }">
                                            <label>Paid Amount</label>
                                            <div v-if="!isPaidAmountValid" class="invalid-feedback">
                                                <template v-if="form.status === 'unpaid'">Paid amount harus 0 untuk status unpaid</template>
                                                <template v-else-if="form.status === 'paid'">Paid amount harus sama dengan grand total ({{ formatRupiah(grandTotal) }}) untuk status paid</template>
                                                <template v-else-if="form.status === 'partial'">Paid amount harus lebih dari 0 dan kurang dari grand total ({{ formatRupiah(grandTotal) }}) untuk status partial</template>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" :value="formatRupiah(form.remainingAmount)" class="form-control" readonly>
                                            <label>Sisa Pembayaran</label>
                                        </div>
                                    </div>
                                    <div class="col-md-9">
                                        <div class="form-floating form-floating-outline">
                                            <textarea v-model="form.description" class="form-control" placeholder="Deskripsi Invoice"></textarea>
                                            <label>Deskripsi Invoice</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card border-primary">
                                            <div class="card-header">
                                                <h6 class="mb-0">💰 Ringkasan Pembayaran</h6>
                                            </div>
                                            <div class="card-body mt-3">
                                                <div class="row text-sm">
                                                    <div class="col-6">
                                                        <div class="mb-2">
                                                            <span class="text-muted">Subtotal:</span><br>
                                                            <strong>{{ formatRupiah(form.total) }}</strong>
                                                        </div>
                                                        <div class="mb-2">
                                                            <span class="text-muted">Discount ({{ form.discountPercent }}%):</span><br>
                                                            <strong class="text-danger">-{{ formatRupiah(discountAmount) }}</strong>
                                                        </div>
                                                        <div class="mb-2">
                                                            <span class="text-muted">Tax ({{ form.taxPercent }}%):</span><br>
                                                            <strong class="text-success">+{{ formatRupiah(taxAmount) }}</strong>
                                                        </div>
                                                        <hr class="my-2">
                                                        <div class="mb-2">
                                                            <span class="text-muted">Grand Total:</span><br>
                                                            <strong class="fs-5 text-primary">{{ formatRupiah(grandTotal) }}</strong>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="mb-2">
                                                            <span class="text-muted">Status:</span><br>
                                                            <span :class="paymentStatusClass">{{ form.status?.toUpperCase() || 'UNKNOWN' }}</span>
                                                        </div>
                                                        <div class="mb-2">
                                                            <span class="text-muted">Paid Amount:</span><br>
                                                            <strong class="text-success">{{ formatRupiah(form.paidAmount) }}</strong>
                                                        </div>
                                                        <div class="mb-2">
                                                            <span class="text-muted">Remaining:</span><br>
                                                            <strong :class="form.remainingAmount > 0 ? 'text-warning' : 'text-success'">
                                                                {{ formatRupiah(form.remainingAmount) }}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="alert alert-info">
                                            <div class="d-flex align-items-center">
                                                <div class="me-2">
                                                    <i class="ri-information-line ri-24px"></i>
                                                </div>
                                                <div>
                                                    <strong>Info Pembayaran:</strong><br>
                                                    <small class="text-muted">
                                                        • Status akan otomatis berubah berdasarkan jumlah pembayaran<br>
                                                        • Unpaid: Rp 0 | Partial: Sebagian | Paid: Lunas
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer mt-6">
                             <button type="button" class="btn btn-outline-secondary" @click="salesInvoiceStore.closeModal()">Tutup</button>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useSalesInvoiceStore } from '~/stores/sales-invoice'
import { useCustomerStore } from '~/stores/customer'
import { usePerusahaanStore } from '~/stores/perusahaan'
import { useCabangStore } from '~/stores/cabang'
import { useProductStore } from '~/stores/product'
import { useWarehouseStore } from '~/stores/warehouse'
import { useStocksStore } from '~/stores/stocks'
import { useUserStore } from '~/stores/user'
import { usePermissionsStore } from '~/stores/permissions'
import { usePermissions } from '~/composables/usePermissions'
import { useSalesOrderStore } from '~/stores/sales-order'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import vSelect from 'vue-select'
import Dropdown from 'primevue/dropdown'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import 'vue-select/dist/vue-select.css'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const config = useRuntimeConfig();
const router = useRouter();

// Store
const myDataTableRef        = ref(null)
const salesInvoiceStore       = useSalesInvoiceStore()
const customerStore         = useCustomerStore()
const perusahaanStore       = usePerusahaanStore()
const warehouseStore        = useWarehouseStore()
const cabangStore           = useCabangStore()
const productStore          = useProductStore()
const userStore             = useUserStore()
const formatRupiah          = useFormatRupiah()
const { userHasPermission, userHasRole } = usePermissions();
const permissionStore       = usePermissionsStore()
const salesOrderStore       = useSalesOrderStore()

const { salesInvoices, loading, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(salesInvoiceStore)
const { customers }   = storeToRefs(customerStore)
const { salesOrders } = storeToRefs(salesOrderStore)

// State
const filters = ref({
  customerId: null,
  source: null,
  status: null,
  search: '',
});
const globalFilterValue = ref('');
const attachmentPreview = ref(null);

// Flag untuk mencegah recursive watcher updates
const isUpdatingFromWatcher = ref(false);

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);
const modalTitle = computed(() => isEditMode.value ? 'Edit Sales Invoice' : 'Tambah Sales Invoice');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data Sales Invoice di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan data Sales Invoice baru.');

// Computed untuk menghitung sisa pembayaran berdasarkan grand total
const remainingAmount = computed(() => {
  const total = grandTotal.value;
  const paid = Number(form.value.paidAmount) || 0;
  return total - paid;
});

// Computed untuk menentukan apakah paid amount valid
const isPaidAmountValid = computed(() => {
  const total = grandTotal.value;
  const paid = Number(form.value.paidAmount) || 0;
  
  if (form.value.status === 'unpaid') {
    return paid === 0;
  } else if (form.value.status === 'paid') {
    return paid === total;
  } else if (form.value.status === 'partial') {
    return paid > 0 && paid < total;
  }
  
  return true;
});

// Computed untuk status badge class
const paymentStatusClass = computed(() => {
  if (form.value.status === 'paid') {
    return 'badge bg-success';
  } else if (form.value.status === 'partial') {
    return 'badge bg-warning';
  } else if (form.value.status === 'unpaid') {
    return 'badge bg-danger';
  }
  return 'badge bg-secondary';
});

// Computed untuk discount amount dalam rupiah
const discountAmount = computed(() => {
  const total = Number(form.value.total) || 0;
  const discountPercent = Number(form.value.discountPercent) || 0;
  return total * (discountPercent / 100);
});

// Computed untuk tax amount dalam rupiah
const taxAmount = computed(() => {
  const total = Number(form.value.total) || 0;
  const discountPercent = Number(form.value.discountPercent) || 0;
  const taxPercent = Number(form.value.taxPercent) || 0;
  
  // Tax dihitung setelah discount
  const totalAfterDiscount = total - (total * (discountPercent / 100));
  return totalAfterDiscount * (taxPercent / 100);
});

// Computed untuk grand total (total + tax - discount)
const grandTotal = computed(() => {
  const total = Number(form.value.total) || 0;
  const discount = discountAmount.value;
  const tax = taxAmount.value;
  return total - discount + tax;
});

const statusOptions = ref([
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Partial', value: 'partial' },
    { label: 'Paid', value: 'paid' },
]);

const paymentMethodOptions = ref([
    { label: 'Cash', value: 'cash' },
    { label: 'Transfer Bank', value: 'transfer' },
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'Debit Card', value: 'debit_card' },
    { label: 'Cheque', value: 'cheque' },
    { label: 'E-Wallet', value: 'e_wallet' },
]);

let modalInstance = null;
onMounted(() => {
    salesInvoiceStore.fetchSalesInvoices();
    customerStore.fetchCustomers();
    salesOrderStore.fetchSalesOrders();
    permissionStore.fetchPermissions();

    const modalElement = document.getElementById('SalesInvoiceModal')
    if (modalElement) {
        modalInstance = new bootstrap.Modal(modalElement)
    }
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
            
            // Fetch stock for existing items
            if (form.value.salesInvoiceItems && form.value.salesInvoiceItems.length > 0) {
                form.value.salesInvoiceItems.forEach((item, index) => {
                    updateStockInfo(index);
                });
            }
        } else {
            attachmentPreview.value = null
        }
    } else {
        modalInstance?.hide()
    }
})

watch(() => form.value.perusahaanId, (newPerusahaanId) => {
    if (newPerusahaanId) {
        if(!isEditMode.value) {
            form.value.cabangId = null;
        }
    }
});

// Watcher untuk salesOrderId - auto fill data ketika dipilih
watch(() => form.value.salesOrderId, (newSalesOrderId, oldSalesOrderId) => {
  if (newSalesOrderId && newSalesOrderId !== oldSalesOrderId) {
    const selectedSalesOrder = salesOrders.value?.find(so => so.id === newSalesOrderId);
    
    if (selectedSalesOrder) {
      console.log('🔍 Selected Sales Order:', selectedSalesOrder);
      
      // Auto fill data dari sales order yang dipilih
      form.value.customerId = selectedSalesOrder.customerId || selectedSalesOrder.customer?.id;
      form.value.discountPercent = selectedSalesOrder.discountPercent || 0;
      form.value.taxPercent = selectedSalesOrder.taxPercent || 0;
      form.value.total = selectedSalesOrder.total || 0;
      
      // Jika ada data perusahaan dan cabang di sales order
      if (selectedSalesOrder.perusahaanId) {
        form.value.perusahaanId = selectedSalesOrder.perusahaanId;
      }
      if (selectedSalesOrder.cabangId) {
        form.value.cabangId = selectedSalesOrder.cabangId;
      }
      
      // Auto fill tanggal jika belum ada
      if (!form.value.date && selectedSalesOrder.date) {
        form.value.date = new Date(selectedSalesOrder.date).toISOString().split('T')[0];
      }
      
      // Auto fill due date jika belum ada (misal 30 hari dari sales order date)
      if (!form.value.dueDate && selectedSalesOrder.date) {
        const dueDate = new Date(selectedSalesOrder.date);
        dueDate.setDate(dueDate.getDate() + 30); // 30 hari dari tanggal SO
        form.value.dueDate = dueDate.toISOString().split('T')[0];
      }
      
      // Set status default
      if (!form.value.status) {
        form.value.status = 'unpaid';
      }
      
      // Set paid amount default
      if (!form.value.paidAmount) {
        form.value.paidAmount = 0;
      }
      
      console.log('✅ Auto filled form data:', {
        customerId: form.value.customerId,
        discountPercent: form.value.discountPercent,
        taxPercent: form.value.taxPercent,
        total: form.value.total,
        perusahaanId: form.value.perusahaanId,
        cabangId: form.value.cabangId,
        date: form.value.date,
        dueDate: form.value.dueDate,
        status: form.value.status,
        paidAmount: form.value.paidAmount
      });
    }
  } else if (!newSalesOrderId && oldSalesOrderId) {
    // Jika sales order dihapus/di-clear, reset beberapa field ke kondisi manual
    console.log('🔄 Sales Order cleared, enabling manual input');
    
    // Reset ke default values tapi tetap biarkan user bisa edit
    if (!isEditMode.value) {
      form.value.customerId = null;
      form.value.discountPercent = 0;
      form.value.taxPercent = 0;
      form.value.total = 0;
      form.value.paidAmount = 0;
      form.value.status = 'unpaid';
    }
  }
});

// Watcher untuk status - auto adjust paid amount
watch(() => form.value.status, (newStatus, oldStatus) => {
  if (newStatus !== oldStatus && !isUpdatingFromWatcher.value) {
    isUpdatingFromWatcher.value = true;
    
    const totalAmount = grandTotal.value;
    
    if (newStatus === 'paid') {
      // Jika status paid, paid amount harus sama dengan grand total
      form.value.paidAmount = totalAmount;
    } else if (newStatus === 'unpaid') {
      // Jika status unpaid, paid amount harus 0
      form.value.paidAmount = 0;
    }
    // Untuk status 'partial', biarkan user input manual
    
    console.log('💰 Status changed to:', newStatus, 'Paid Amount:', form.value.paidAmount);
    
    // Reset flag setelah update selesai
    nextTick(() => {
      isUpdatingFromWatcher.value = false;
    });
  }
});

// Watcher untuk grand total - adjust paid amount jika status paid
watch(() => grandTotal.value, (newGrandTotal, oldGrandTotal) => {
  if (form.value.status === 'paid' && newGrandTotal !== oldGrandTotal) {
    form.value.paidAmount = newGrandTotal;
    console.log('💰 Grand Total changed, adjusting paid amount for paid status:', form.value.paidAmount);
  }
});

// Watcher untuk paid amount - auto adjust status berdasarkan jumlah yang dibayar
watch(() => form.value.paidAmount, (newPaidAmount, oldPaidAmount) => {
  if (newPaidAmount !== oldPaidAmount && !isUpdatingFromWatcher.value) {
    isUpdatingFromWatcher.value = true;
    
    const totalAmount = grandTotal.value;
    const paidAmount = Number(newPaidAmount) || 0;
    
    let newStatus = form.value.status;
    
    if (paidAmount === 0) {
      newStatus = 'unpaid';
    } else if (paidAmount >= totalAmount && totalAmount > 0) {
      newStatus = 'paid';
      // Batasi paid amount tidak boleh lebih dari grand total
      if (paidAmount > totalAmount) {
        form.value.paidAmount = totalAmount;
      }
    } else if (paidAmount > 0 && paidAmount < totalAmount) {
      newStatus = 'partial';
    }
    
    if (newStatus !== form.value.status) {
      form.value.status = newStatus;
      console.log('🔄 Status auto-changed to:', newStatus, 'based on paid amount:', paidAmount);
    }
    
    // Reset flag setelah update selesai
    nextTick(() => {
      isUpdatingFromWatcher.value = false;
    });
  }
});

watch(() => salesInvoiceStore.customerProducts, (newProducts) => {
  if (form.value.salesInvoiceItems && newProducts) {
    form.value.salesInvoiceItems.forEach(item => {
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


watch(globalFilterValue, useDebounceFn((newValue) => {
    filters.value.search = newValue;
}, 500));

watch(filters, (newFilters) => {
    const { page, rows, ...restFilters } = newFilters;
    salesInvoiceStore.setFilters(restFilters);
}, { deep: true });

const onPage = (event) => {
    params.value.first = event.first;
    salesInvoiceStore.fetchSalesInvoices();
};
const handleRowsChange = () => {
    params.value.first = 0;
    salesInvoiceStore.fetchSalesInvoices();
};
const onSort = (event) => {
    params.value.sortField = event.sortField;
    params.value.sortOrder = event.sortOrder;
    salesInvoiceStore.fetchSalesInvoices();
};

const exportData = (format) => {
    if (format === 'csv') myDataTableRef.value.exportCSV();
};


const onQuantityChange = (index) => {
  calculateSubtotal(index);
};

const calculateSubtotal = (index) => {
  const item = form.value.salesInvoiceItems[index];
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.price) || 0;
  item.subtotal = quantity * unitPrice;
};

// Function to convert formatted rupiah back to number
const parseRupiahToNumber = (rupiahString) => {
  if (!rupiahString) return 0;
  // Remove 'Rp', spaces, dots (thousand separators) and convert to number
  return Number(rupiahString.replace(/[Rp\s.]/g, '').replace(',', '.')) || 0;
};

// Handler untuk update total dari input yang diformat
const updateTotalFromInput = (event) => {
  if (!form.value.salesOrderId) { // Only allow manual input if no sales order selected
    const inputValue = event.target.value;
    const numericValue = parseRupiahToNumber(inputValue);
    form.value.total = numericValue;
  }
};

// Handler untuk update paid amount dari input yang diformat
const updatePaidAmountFromInput = (event) => {
  const inputValue = event.target.value;
  const numericValue = parseRupiahToNumber(inputValue);
  form.value.paidAmount = numericValue;
};

const viewSalesInvoiceDetails = (salesInvoiceId) => {
    console.log('🔍 Page Debug - viewSalesInvoiceDetails called with ID:', salesInvoiceId);
    console.log('🔍 Page Debug - ID type:', typeof salesInvoiceId);
    
    if (!salesInvoiceId) {
        console.error('❌ Page Debug - No salesInvoiceId provided');
        Swal.fire({
            icon: 'error',
            title: 'Parameter Tidak Valid',
            text: 'ID Sales Invoice tidak valid.',
            confirmButtonText: 'OK'
        });
        return;
    }
    
    console.log('🔍 Page Debug - Navigating to sales-invoice-detail with ID:', salesInvoiceId);
    router.push({ path: `/sales/sales-invoice-detail`, query: { id: salesInvoiceId } });
};

const getStatusBadge = (status) => {
    switch (status) {
        case 'unpaid': return { text: 'Unpaid', class: 'badge rounded-pill bg-label-danger' };
        case 'partial': return { text: 'Partial', class: 'badge rounded-pill bg-label-warning' };
        case 'paid': return { text: 'Paid', class: 'badge rounded-pill bg-label-success' };
        default: return { text: '-', class: 'badge rounded-pill bg-label-light' };
    }
};

const printSalesInvoice = (salesInvoiceId) => {
    console.log('🔍 Page Debug - printSalesInvoice called with ID:', salesInvoiceId);
    console.log('🔍 Page Debug - ID type:', typeof salesInvoiceId);
    
    if (!salesInvoiceId) {
        console.error('❌ Page Debug - No salesInvoiceId provided');
        Swal.fire({
            icon: 'error',
            title: 'Parameter Tidak Valid',
            text: 'ID Sales Invoice tidak valid.',
            confirmButtonText: 'OK'
        });
        return;
    }
    
    console.log('🔍 Page Debug - Navigating to cetak-invoice with ID:', salesInvoiceId);
    router.push({ path: `/sales/cetak-invoice`, query: { id: salesInvoiceId } });
};

const getSalesOrderLabel = (option) => {
    if (!option) return '';
    return `${option.noSo} - ${option.customer?.name || 'No Customer'}`;
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
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

    /* Sales Order Select - Limit dropdown height for max 5 items */
    :deep(.sales-order-select .vs__dropdown-menu) {
        max-height: 250px !important; /* Approximately 5 items * 50px each */
        overflow-y: auto !important;
        border-radius: 7px;
    }

    :deep(.sales-order-select .vs__dropdown-option) {
        padding: 12px 16px;
        min-height: 50px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f0f0f0;
    }

    :deep(.sales-order-select .vs__dropdown-option:last-child) {
        border-bottom: none;
    }

    :deep(.sales-order-select .vs__dropdown-option--highlight) {
        background-color: #e3f2fd;
        color: #666CFF;
    }

    :deep(.sales-order-select .vs__dropdown-option--selected) {
        background-color: #666CFF;
        color: white;
    }

    /* Custom scrollbar styling */
    :deep(.sales-order-select .vs__dropdown-menu)::-webkit-scrollbar {
        width: 6px;
    }

    :deep(.sales-order-select .vs__dropdown-menu)::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    :deep(.sales-order-select .vs__dropdown-menu)::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }

    :deep(.sales-order-select .vs__dropdown-menu)::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }

    /* Styling untuk field yang disabled ketika sales order dipilih */
    :deep(.v-select-style.vs--disabled .vs__dropdown-toggle) {
        background-color: #f8f9fa;
        border-color: #e9ecef;
        opacity: 0.65;
    }

    :deep(.v-select-style.vs--disabled .vs__selected) {
        color: #6c757d;
    }

    /* Styling untuk readonly input fields */
    .form-control:read-only {
        background-color: #f8f9fa;
        border-color: #e9ecef;
        color: #6c757d;
    }

    /* Custom styling untuk form text hint */
    .form-text small {
        font-size: 0.75rem;
        font-style: italic;
    }

    /* Styling untuk payment summary card */
    .card.border-primary {
        border-width: 2px !important;
    }

    .card-header.bg-primary {
        background: linear-gradient(135deg, #8185ff 0%, #666CFF 100%) !important;
    }

    .card-body .text-sm {
        font-size: 0.875rem;
    }

    .card-body .mb-2 {
        margin-bottom: 0.75rem !important;
    }

    /* Styling untuk format rupiah yang positif dan negatif */
    .text-danger {
        color: #FF6D6A !important;
    }

    .text-success {
        color: #198754 !important;
    }

    .text-warning {
        color: #FDB935 !important;
    }

    .text-primary {
        color: #666CFF !important;
    }

    /* Responsive design untuk payment summary */
    @media (max-width: 768px) {
        .card-body .row.text-sm .col-6 {
            margin-bottom: 1rem;
        }
    }
</style>