<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Sales Order</h4>
            <p class="mb-6">
            List salesOrder yang terdaftar di sistem
            </p>
            <!-- salesOrder cards -->
            <div class="row g-6 mb-6">
                <!-- Card untuk Tambah Pegawai -->                
                <CardBox
                    v-if="stats.total !== undefined"
                    title="Total Sales Order"
                    :total="(stats.total !== undefined ? stats.total + ' Sales Order' : 'Memuat...')"
                    :column-class="cardBoxColumnClass"
                />
                <CardBox
                    v-if="stats.approved !== undefined"
                    title="Total Sales Order Approved"
                    :total="(stats.approved !== undefined ? stats.approved + ' Sales Order' : 'Memuat...')"
                    :column-class="cardBoxColumnClass"
                />
                <CardBox
                    v-if="stats.rejected !== undefined"
                    title="Total Sales Order Rejected"
                    :total="(stats.rejected !== undefined ? stats.rejected + ' Sales Order' : 'Memuat...')"
                    :column-class="cardBoxColumnClass"
                />
                <CardBox
                    v-if="stats.partial !== undefined"
                    title="Total Sales Order Partial"
                    :total="(stats.partial !== undefined ? stats.partial + ' Sales Order' : 'Memuat...')"
                    :column-class="cardBoxColumnClass"
                />
                <CardBox
                    v-if="stats.delivered !== undefined"
                    title="Total Sales Order Delivered"
                    :total="(stats.delivered !== undefined ? stats.delivered + ' Sales Order' : 'Memuat...')"
                    :column-class="cardBoxColumnClass"
                />
                <CardBox
                    v-if="userHasRole('superadmin') || userHasPermission('create_sales_order')"
                    :isAddButtonCard="true"
                    image-src="/img/illustrations/add-new-role-illustration.png"
                    image-alt="Tambah Sales Order"
                    button-text="Tambah Sales Order"
                    modal-target="#SalesOrderModal" 
                    @button-click="salesOrderStore.openModal(null, 'admin')"
                    :column-class="cardBoxColumnClass"
                />
            </div>

            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total & Filter Sales Order</h4>
                    <p class="mb-0">Temukan semua akun administrator perusahaan Anda dan Sales Order terkait.</p>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <v-select v-model="filters.customerId" :options="customers" label="name" :reduce="c => c.id" placeholder="Pilih Customer" class="v-select-style"/>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <v-select v-model="filters.source" :options="sourceOptions" label="label" :reduce="option => option.value" placeholder="Pilih Source" class="v-select-style"/>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <v-select v-model="filters.status" :options="statusOptions" label="label" :reduce="option => option.value" placeholder="Pilih Status" class="v-select-style"/>
                                </div>
                            </div>
                            <div class="row mt-5">
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating form-floating-outline">
                                        <input type="date" v-model="filters.startDate" class="form-control" placeholder="Tanggal Mulai" @change="onDateChange">
                                        <label>Tanggal Mulai</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating form-floating-outline">
                                        <input type="date" v-model="filters.endDate" class="form-control" placeholder="Tanggal Akhir" @change="onDateChange">
                                        <label>Tanggal Akhir</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3 reset-filter-button">
                                    <button @click="clearDateFilters" class="btn btn-outline-secondary me-2">
                                        <i class="ri-refresh-line me-1"></i> Reset Filter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <!-- salesOrder Table -->
                    <div class="card">
                        <div class="card-header">
                            <TableControls
                                v-model="tableControls"
                                :rows-per-page-options="rowsPerPageOptionsArray"
                                search-placeholder="Cari Sales Order..."
                                @rows-change="handleRowsChange"
                                @search="handleSearch"
                                @export="exportData"
                            />
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                            <MyDataTable 
                                ref="myDataTableRef"
                                :data="salesOrders" 
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
                                    <Column field="noSo" header="No. SO" :sortable="true">
                                        <template #body="slotProps">
                                            <span>
                                                {{ slotProps.data.noSo || '-' }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="noPo" header="No. PO" :sortable="true">
                                        <template #body="slotProps">
                                            <span>
                                                {{ slotProps.data.noPo || '-' }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="customer.name" header="Nama Customer" :sortable="true"></Column>
                                    <Column field="paymentMethod" header="Metode Pembayaran" :sortable="true">
                                        <template #body="slotProps">
                                            <span :class="getPaymentMethodBadge(slotProps.data.paymentMethod).class">
                                                {{ getPaymentMethodBadge(slotProps.data.paymentMethod).text }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="source" header="Source" :sortable="true">
                                        <template #body="slotProps">
                                            <span>
                                                {{ slotProps.data.source || '-' }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="status" header="Status SO" :sortable="true">
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
                                    <Column field="date" header="Tanggal SO" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.date ? new Date(slotProps.data.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' }}
                                        </template>
                                    </Column>
                                    <Column field="dueDate" header="Jatuh Tempo SO" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.dueDate ? new Date(slotProps.data.dueDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' }}
                                        </template>
                                    </Column>
                                    <Column field="perusahaan.nmPerusahaan" header="Perusahaan" :sortable="true"></Column>
                                    <Column field="cabang.nmCabang" header="Cabang" :sortable="true"></Column>
                                    <Column field="attachment" header="Attachment" :sortable="true">
                                        <template #body="slotProps">
                                            <div v-if="slotProps.data.attachment">
                                                <div class="d-flex align-items-center">
                                                    <a 
                                                        :href="getAttachmentUrl(slotProps.data.attachment)" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        download
                                                        class="badge rounded-pill bg-label-primary"
                                                        style="text-decoration: none;"
                                                    >
                                                        <i class="ri-file-line me-2"></i>
                                                        Download File
                                                    </a>
                                                </div>
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
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('approve_sales_order') && slotProps.data.status == 'draft')">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="salesOrderStore.approveSalesOrder(slotProps.data.id)">
                                                            <i class="ri-check-line me-2"></i> Approve
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('reject_sales_order') && slotProps.data.status == 'draft')">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="salesOrderStore.rejectSalesOrder(slotProps.data.id)">
                                                            <i class="ri-close-line me-2"></i> Reject
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('view_sales_order'))">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="viewSalesOrderDetails(slotProps.data.id)">
                                                            <i class="ri-eye-line me-2"></i> Lihat Detail
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('edit_sales_order') && slotProps.data.status == 'draft')">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="salesOrderStore.openModal(slotProps.data, 'admin')">
                                                            <i class="ri-edit-box-line me-2"></i> Edit
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('delete_sales_order') && (slotProps.data.status == 'draft'))">
                                                        <a class="dropdown-item text-danger" href="javascript:void(0)" @click="salesOrderStore.deleteSalesOrder(slotProps.data.id)">
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
                    <!--/ salesOrder Table -->
                </div>
            </div>
            <!--/ salesOrder cards -->

            <Modal 
                id="SalesOrderModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="handleSubmit">
                         <div class="row">
                            <div class="col">
                                <ul class="nav nav-tabs" role="tablist">
                                    <li class="nav-item">
                                        <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#form-tabs-info" role="tab" aria-selected="true" type="button">
                                            <span class="ri-user-line ri-20px d-sm-none"></span>
                                            <span class="d-none d-sm-block">Informasi Sales Order</span>
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
                                            <input type="hidden" v-model="form.noSo" class="form-control" placeholder="No SO" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" v-model="form.noPo" class="form-control" placeholder="No. PO" required>
                                            <label>No. PO</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select v-model="form.quotationId" :options="quotations" label="noQuotation" :reduce="q => q.id" placeholder="Pilih Quotation" class="v-select-style"/>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select v-model="form.customerId" :options="customers" label="name" :reduce="c => c.id" placeholder="Pilih Customer" class="v-select-style"/>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" v-model="form.up" class="form-control" placeholder="Untuk Perhatian" required>
                                            <label>Untuk Perhatian</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="date" v-model="form.date" class="form-control" required>
                                            <label>Tanggal SO</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="date" v-model="form.dueDate" class="form-control" required>
                                            <label>Jatuh Tempo SO</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select v-model="form.perusahaanId" :options="perusahaans" label="nmPerusahaan" :reduce="p => p.id" placeholder="Pilih Perusahaan" class="v-select-style"/>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select v-model="form.cabangId" :options="filteredCabangs" label="nmCabang" :reduce="c => c.id" placeholder="Pilih Cabang" class="v-select-style"/>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <v-select
                                                v-model="form.paymentMethod"
                                                :options="paymentMethodOptions"
                                                label="label"
                                                :reduce="option => option.value"
                                                :get-option-key="option => option.value"
                                                placeholder="-- Pilih Metode Pembayaran --"
                                                id="select-payment-method"
                                                class="select-payment-method"
                                            />
                                        </div>
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
                                            <input 
                                                type="file" 
                                                @change="onFileChange" 
                                                class="form-control"
                                                accept=".pdf,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.svg"
                                            >
                                            <label>Attachment (PDF, Excel, Image)</label>
                                            
                                            <div v-if="form.attachmentPreview" class="mt-2">
                                                <div class="d-flex align-items-center mb-2">
                                                    <i :class="getFileIcon(form.attachmentPreview)" style="font-size: 1.2rem; margin-right: 0.5rem;"></i>
                                                    <a :href="form.attachmentPreview" target="_blank" rel="noopener noreferrer" class="d-block">Lihat Attachment</a>
                                                </div>
                                                <div v-if="isImageFile(form.attachmentPreview)" class="mt-2">
                                                    <img 
                                                        :src="form.attachmentPreview" 
                                                        alt="Attachment Preview" 
                                                        class="attachment-preview"
                                                        style="height: 60px; max-width: 120px; object-fit: contain; border: 2px solid #ddd; border-radius: 8px;"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <textarea v-model="form.description" class="form-control" placeholder="Deskripsi SO"></textarea>
                                            <label>Deskripsi</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="form-tabs-items" role="tabpanel">
                                <div v-for="(item, index) in form.salesOrderItems" :key="index" class="repeater-item mb-4">
                                    <div class="row g-3">
                                        <div class="col-12">
                                            <v-select v-model="item.warehouseId" :options="warehouses"
                                            :get-option-label="w => `${w.name} (${w.code})`" :reduce="w => w.id" placeholder="Pilih Gudang SO" class="v-select-style" @update:modelValue="updateStockInfo(index)"/>
                                        </div>
                                        <div class="col-md-4">
                                            <v-select v-model="item.productId" :options="customerProducts" :get-option-label="p => `${p.name} (${p.unit?.name})`" :reduce="p => p.id" placeholder="Pilih Produk" @update:modelValue="onProductChange(index)" class="v-select-style"/>
                                        </div>
                                        <div class="col-md-2">
                                            <div class="form-floating form-floating-outline">
                                                <input type="number" v-model.number="item.quantity" @input="onQuantityChange(index)" class="form-control" placeholder="Qty">
                                                <label>Qty</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" :value="formatRupiah(item.price)" class="form-control" placeholder="Harga" readonly>
                                                <label>Harga Satuan</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" :value="formatRupiah(item.subtotal)" class="form-control" placeholder="Subtotal" readonly>
                                                <label>Subtotal</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                             <div class="form-floating form-floating-outline">
                                                <input type="text" v-model="item.description" class="form-control" placeholder="Deskripsi item">
                                                <label>Deskripsi</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" :value="item.stock && item.stock.quantity !== undefined && item.stock.quantity !== null ? Math.floor(item.stock.quantity) : ''" class="form-control" placeholder="Stock" readonly>
                                                <label>Stock</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3 d-flex align-items-center">
                                            <button @click.prevent="salesOrderStore.removeItem(index)" class="btn btn-outline-danger w-100">Hapus</button>
                                        </div>
                                    </div>
                                    <hr class="my-4">
                                </div>
                                <div class="mt-4">
                                    <button @click.prevent="salesOrderStore.addItem()" class="btn btn-primary">Tambah Item</button>
                                </div>
                                <div class="d-flex justify-content-end mt-4">
                                    <span class="fw-bold fs-5">Grand Total: {{ formatRupiah(grandTotal) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer mt-6">
                             <button type="button" class="btn btn-outline-secondary" @click="salesOrderStore.closeModal()">Tutup</button>
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
import { useSalesOrderStore } from '~/stores/sales-order'
import { useCustomerStore } from '~/stores/customer'
import { usePerusahaanStore } from '~/stores/perusahaan'
import { useCabangStore } from '~/stores/cabang'
import { useQuotationStore } from '~/stores/quotation'
import { useProductStore } from '~/stores/product'
import { useWarehouseStore } from '~/stores/warehouse'
import { useStocksStore } from '~/stores/stocks'
import { useUserStore } from '~/stores/user'
import { usePermissionsStore } from '~/stores/permissions'
import { usePermissions } from '~/composables/usePermissions'
import Modal from '~/components/modal/Modal.vue'
import CardBox from '~/components/cards/Cards.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import TableControls from '~/components/table/TableControls.vue'
import vSelect from 'vue-select'
import Dropdown from 'primevue/dropdown'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import 'vue-select/dist/vue-select.css'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useDynamicTitle } from '~/composables/useDynamicTitle'
import { useImageUrl } from '~/composables/useImageUrl'
import Swal from 'sweetalert2'

// Composables
const { setListTitle, setFormTitle } = useDynamicTitle()
const { getAttachmentUrl, getFileIcon, isImageFile, isPdfFile, isExcelFile } = useImageUrl()

const config = useRuntimeConfig();
const router = useRouter();

// Store
const myDataTableRef        = ref(null)
const salesOrderStore       = useSalesOrderStore()
const customerStore         = useCustomerStore()
const perusahaanStore       = usePerusahaanStore()
const warehouseStore        = useWarehouseStore()
const cabangStore           = useCabangStore()
const quotationStore        = useQuotationStore()
const productStore          = useProductStore()
const stockStore            = useStocksStore()
const userStore             = useUserStore()
const formatRupiah          = useFormatRupiah()
const { userHasPermission, userHasRole } = usePermissions();
const permissionStore       = usePermissionsStore()

const { salesOrders, loading, totalRecords, params, form, isEditMode, showModal, validationErrors, customerProducts, stats } = storeToRefs(salesOrderStore)
const { quotations } = storeToRefs(quotationStore)
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
  source: null,
  status: null,
  startDate: null,
  endDate: null,
  search: '',
});
const globalFilterValue = ref('');

// Table controls data
const tableControls = ref({
  rows: 10,
  search: ''
});

const cardBoxColumnClass = computed(() => {
  return stats.value.total !== undefined ? 'col-6' : 'col-xl-4 col-lg-6 col-md-6';
});

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);
const modalTitle = computed(() => isEditMode.value ? 'Edit Sales Order' : 'Tambah Sales Order');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data Sales Order di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan data Sales Order baru.');

const grandTotal = computed(() => {
  if (!form.value || !form.value.salesOrderItems) return 0;
  
  const totalItems = form.value.salesOrderItems.reduce((total, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.price) || 0;
    return total + (quantity * unitPrice);
  }, 0);

  const discountPercent = Number(form.value.discountPercent) || 0;
  const taxPercent = Number(form.value.taxPercent) || 0;

  const discountAmount = totalItems * (discountPercent / 100);
  const totalAfterDiscount = totalItems - discountAmount;
  const taxAmount = totalAfterDiscount * (taxPercent / 100);

  return totalAfterDiscount + taxAmount;
});



const paymentMethodOptions = [
    { label: 'Cash', value: 'cash' }, { label: 'Transfer', value: 'transfer' },
    { label: 'QRIS', value: 'qris' }, { label: 'Card', value: 'card' }
];

const sourceOptions = ref([
    { label: 'POS', value: 'pos' },
    { label: 'Admin', value: 'admin' },
]);

const statusOptions = ref([
    { label: 'Draft', value: 'draft' },
    { label: 'Approved', value: 'approved' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Partial', value: 'partial' },
]);

let modalInstance = null;
onMounted(async () => {
    salesOrderStore.fetchSalesOrders();
    salesOrderStore.fetchStats(); // <--- TAMBAHKAN INI
    customerStore.fetchCustomers();
    perusahaanStore.fetchPerusahaans();
    cabangStore.fetchCabangs();
    productStore.fetchProducts();
    warehouseStore.fetchWarehouses();
    permissionStore.fetchPermissions();
    userStore.loadUser();

    // Gunakan endpoint data baru untuk load data
    try {
        const [perusahaanData, cabangData, customerData] = await Promise.all([
            salesOrderStore.fetchPerusahaanData(),
            salesOrderStore.fetchCabangData(),
            salesOrderStore.fetchCustomerData(),
        ]);
        
        // Assign data ke store yang sesuai
        perusahaanStore.perusahaans = perusahaanData;
        cabangStore.cabangs         = cabangData;
        customerStore.customers     = customerData;

    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback ke method lama jika endpoint data baru gagal
        customerStore.fetchCustomers();
        perusahaanStore.fetchPerusahaans();
        cabangStore.fetchCabangs();
    }
    
    // Load quotations secara terpisah
    try {
        await quotationStore.fetchQuotations();
    } catch (error) {
        console.error('❌ Error loading quotations:', error);
    }

    const modalElement = document.getElementById('SalesOrderModal')
    if (modalElement) {
        modalInstance = new bootstrap.Modal(modalElement)
    }
    setListTitle('Sales Order', salesOrders.value.length)
    
    // Initialize table controls
    tableControls.value.rows = Number(params.value.rows) || 10;
    tableControls.value.search = globalFilterValue.value;
});

// Watch untuk sinkronisasi table controls
watch(() => params.value.rows, (newValue) => {
    tableControls.value.rows = Number(newValue) || 10;
});

watch(() => globalFilterValue.value, (newValue) => {
    tableControls.value.search = newValue;
});

watch(showModal, (newValue) => {
    if (newValue) {
        
        modalInstance?.show()
        if (isEditMode.value) {
            if (form.value.attachment_url) {
                form.value.attachmentPreview = form.value.attachment_url
            } else if (form.value.attachment) {
                form.value.attachmentPreview = getAttachmentUrl(form.value.attachment)
            } else {
                form.value.attachmentPreview = null
            }
            
            // Fetch stock for existing items
            if (form.value.salesOrderItems && form.value.salesOrderItems.length > 0) {
                form.value.salesOrderItems.forEach((item, index) => {
                    updateStockInfo(index);
                });
            }
        } else {
            form.value.attachmentPreview = null
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

watch(() => form.value.customerId, (newCustomerId, oldCustomerId) => {
  if (newCustomerId && oldCustomerId && newCustomerId !== oldCustomerId) {
    salesOrderStore.fetchProductsForCustomer(newCustomerId);
    
    form.value.salesOrderItems = [];
    salesOrderStore.addItem();
  } else if (newCustomerId && !oldCustomerId) {
    salesOrderStore.fetchProductsForCustomer(newCustomerId);
  } else if (!newCustomerId) {
    salesOrderStore.customerProducts = [];
    form.value.salesOrderItems = [];
    salesOrderStore.addItem();
  }
});

watch(() => salesOrderStore.customerProducts, (newProducts) => {
  if (form.value.salesOrderItems && newProducts) {
    form.value.salesOrderItems.forEach(item => {
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
    salesOrderStore.setFilters(restFilters);
}, { deep: true });

const onPage = (event) => {
    if (event) {
        // Ensure the event has valid values
        const validEvent = {
            first: Number(event.first) || 0,
            rows: Number(event.rows) || 10,
            page: Number(event.page) || 0
        };
        salesOrderStore.setPagination(validEvent);
    }
};

const handleRowsChange = (value) => {
    const rowsValue = Number(value) || 10;
    params.value.rows = rowsValue;
    params.value.first = 0;
    salesOrderStore.fetchSalesOrders();
};

const handleSearch = (value) => {
    globalFilterValue.value = value;
    params.value.first = 0;
    salesOrderStore.fetchSalesOrders();
};

const onSort = (event) => {
    if (event) {
        salesOrderStore.setSort(event);
    }
};

const exportData = async (format) => {
    const toast = useToast();
    
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    } else if (format === 'pdf') {
        try {
            // Cek apakah ada filter yang diterapkan
            const hasFilters = filters.value.customerId || filters.value.source || filters.value.status || filters.value.search;
            
            toast.info({
                title: 'Info',
                message: hasFilters 
                    ? 'Sedang mempersiapkan data sesuai filter untuk export PDF...' 
                    : 'Sedang mempersiapkan semua data untuk export PDF...',
                color: 'blue'
            });
            
            // Ambil semua data yang sesuai dengan filter untuk export PDF
            const allData = await salesOrderStore.fetchAllSalesOrdersForExport();
            
            if (allData && allData.length > 0) {
                // Gunakan fungsi export PDF khusus untuk Sales Order
                await exportSalesOrderPDF(allData);
                toast.success({
                    title: 'Success',
                    message: `PDF berhasil dibuat dengan ${allData.length} data Sales Order${hasFilters ? ' sesuai filter' : ''}`,
                    color: 'green'
                });
            } else {
                toast.warning({
                    title: 'Warning',
                    message: 'Tidak ada data untuk diexport',
                    color: 'orange'
                });
            }
        } catch (error) {
            console.error('Error exporting PDF:', error);
            toast.error({
                title: 'Error',
                message: 'Gagal membuat PDF. Mencoba dengan data yang ditampilkan saat ini.',
                color: 'red'
            });
            // Fallback ke data yang ditampilkan saat ini
            await exportSalesOrderPDF(salesOrders.value);
        }
    }
};

const handleSubmit = () => {
    salesOrderStore.saveSalesOrder();
};



const onProductChange = (index) => {
  const selectedProductId = form.value.salesOrderItems[index].productId;
  const selectedProduct = customerProducts.value.find(p => p.id === selectedProductId);

  if (selectedProduct) {
    const item = form.value.salesOrderItems[index];
    item.price = Number(selectedProduct.priceSell) || 0;
    calculateSubtotal(index);
    updateStockInfo(index)
  }
};

const onQuantityChange = (index) => {
  calculateSubtotal(index);
};

const calculateSubtotal = (index) => {
  const item = form.value.salesOrderItems[index];
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.price) || 0;
  item.subtotal = quantity * unitPrice;
};

const viewSalesOrderDetails = (salesOrderId) => {
    
    if (!salesOrderId) {
        console.error('❌ Page Debug - No salesOrderId provided');
        toast.fire({
            icon: 'error',
            title: 'Parameter Tidak Valid',
            text: 'ID Sales Order tidak valid.',
            confirmButtonText: 'OK'
        });
        return;
    }
    router.push({ path: `/sales/sales-order-detail`, query: { id: salesOrderId } });
};

const getStatusBadge = (status) => {
    switch (status) {
        case 'draft': return { text: 'Draft', class: 'badge rounded-pill bg-label-secondary' };
        case 'approved': return { text: 'Approved', class: 'badge rounded-pill bg-label-primary' };
        case 'delivered': return { text: 'Delivered', class: 'badge rounded-pill bg-label-success' };
        case 'rejected': return { text: 'Rejected', class: 'badge rounded-pill bg-label-danger' };
        case 'partial': return { text: 'Partial', class: 'badge rounded-pill bg-label-warning' };
        default: return { text: '-', class: 'badge rounded-pill bg-label-light' };
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

const updateStockInfo = async (index) => {
    const item = form.value.salesOrderItems[index]
    if (item.productId && item.warehouseId) {
        try {
            stockStore.params.search = '' // Reset search if any
            stockStore.params.rows = 1 // We only need one record
            const response = await stockStore.fetchStocksPaginated({
                productId: item.productId,
                warehouseId: item.warehouseId,
            })
            if (response && response.data && response.data.length > 0) {
                item.stock = response.data[0]
            } else {
                item.stock = { quantity: 0 }
            }
        } catch (error) {
            console.error('Failed to fetch stock info:', error)
            item.stock = { quantity: 0 }
        }
    } else {
        item.stock = { quantity: 0 }
    }
}

const clearDateFilters = () => {
    filters.value.startDate = null;
    filters.value.endDate = null;
    salesOrderStore.setFilters(filters.value);
};

function onFileChange(e) {
  if (!form.value) return;
  
  const file = e.target.files[0];
  if (file) {
    // Validasi file tidak kosong
    if (!file.size || file.size === 0) {
      Swal.fire('Error', 'File attachment kosong atau tidak valid', 'error');
      return;
    }

    // Validasi file type
    const fileType = file.type || '';
    const fileExtension = file.name?.split('.').pop()?.toLowerCase() || '';

    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];

    const allowedExtensions = ['pdf', 'xlsx', 'xls', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

    const isValidMimeType = allowedMimeTypes.includes(fileType);
    const isValidExtension = allowedExtensions.includes(fileExtension);

    if (!isValidMimeType && !isValidExtension) {
      Swal.fire('Error', `File harus berupa PDF, Excel, atau gambar. Detected: MIME=${fileType}, Ext=${fileExtension}`, 'error');
      return;
    }

    // Validasi file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire('Error', 'Ukuran file terlalu besar (maksimal 10MB)', 'error');
      return;
    }

    form.value.attachment = file;
    form.value.attachmentPreview = URL.createObjectURL(file);
  } else {
    form.value.attachment = null;
    form.value.attachmentPreview = null;
  }
}

// Fungsi export PDF khusus untuk Sales Order
const exportSalesOrderPDF = async (dataToExport) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    // Definisikan kolom yang akan diexport
    const columnDefinitions = [
        { field: 'noSo', header: 'No. SO' },
        { field: 'noPo', header: 'No. PO' },
        { field: 'customer.name', header: 'Nama Customer' },
        { field: 'paymentMethod', header: 'Metode Pembayaran' },
        { field: 'status', header: 'Status SO' },
        { field: 'date', header: 'Tanggal SO' },
        { field: 'dueDate', header: 'Jatuh Tempo SO' },
        { field: 'perusahaan.nmPerusahaan', header: 'Perusahaan' },
        { field: 'cabang.nmCabang', header: 'Cabang' },
        { field: 'total', header: 'Total' }
    ];

    const head = [columnDefinitions.map(col => col.header)];

    if (!dataToExport || dataToExport.length === 0) {
        console.warn('Tidak ada data untuk diexport');
        const doc = new jsPDF('landscape');
        doc.setFontSize(16);
        doc.text('Laporan Sales Orders', 14, 15);
        doc.setFontSize(12);
        doc.text('Tidak ada data yang tersedia untuk export', 14, 50);
        doc.save('sales-orders-empty.pdf');
        return;
    }

    const body = dataToExport.map(row => columnDefinitions.map(col => {
        const field = col.field;
        let value = '';

        if (field.includes('.')) {
            value = field.split('.').reduce((o, i) => (o ? o[i] : ''), row) || '';
        } else {
            value = row[field] || '';
        }

        // Format tanggal
        if (field === 'date' || field === 'dueDate' || field === 'createdAt' || field === 'updatedAt') {
            if (value) {
                try {
                    value = new Date(value).toLocaleDateString('id-ID');
                } catch (e) {
                    value = value.toString();
                }
            }
        }

        // Format total (currency)
        if (field === 'total') {
            if (value) {
                try {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                        value = new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(numValue);
                    }
                } catch (e) {
                    value = value.toString();
                }
            }
        }

        // Format payment method
        if (field === 'paymentMethod') {
            if (value) {
                const paymentMethods = {
                    'cash': 'Cash',
                    'transfer': 'Transfer',
                    'qris': 'QRIS',
                    'card': 'Card'
                };
                value = paymentMethods[value] || value;
            }
        }

        // Format status
        if (field === 'status') {
            if (value) {
                const statusLabels = {
                    'draft': 'Draft',
                    'approved': 'Approved',
                    'delivered': 'Delivered',
                    'rejected': 'Rejected',
                    'partial': 'Partial'
                };
                value = statusLabels[value] || value;
            }
        }

        // Potong text panjang
        const maxLength = 30;
        if (value && value.length > maxLength) {
            value = value.substring(0, maxLength) + '...';
        }

        return value != null ? value.toString() : '';
    }));

    // Ambil data perusahaan dari dataToExport, bukan hardcode
    let companyInfo = {
        name: '',
        address: '',
        email: '',
        phone: '',
        logo: null
    };

    // Cari data perusahaan pertama yang valid dari dataToExport
    let foundPerusahaan = null;
    for (let i = 0; i < dataToExport.length; i++) {
        if (dataToExport[i].perusahaan) {
            foundPerusahaan = dataToExport[i].perusahaan;
            break;
        }
    }

    if (foundPerusahaan) {
        companyInfo = {
            name: foundPerusahaan.nmPerusahaan || '',
            address: foundPerusahaan.alamatPerusahaan || '',
            email: foundPerusahaan.emailPerusahaan || '',
            phone: foundPerusahaan.tlpPerusahaan || '',
            logo: foundPerusahaan.logoPerusahaan || null
        };
    } else {
        // Jika tidak ada data perusahaan sama sekali, fallback ke hardcode
        companyInfo = {
            name: 'PT. ANDARA PRIMA UTAMA',
            address: 'Jl. Raya Serpong KM 7, Serpong',
            email: 'info@andara.co.id',
            phone: '(021) 1234-5678',
            logo: null
        };
    }

    // Hitung grand total
    let grandTotal = 0;
    dataToExport.forEach(row => {
        const totalValue = parseFloat(row.total) || 0;
        grandTotal += totalValue;
    });

    // Format grand total
    const formattedGrandTotal = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(grandTotal);

    // Buat PDF
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Gunakan font yang tersedia di jsPDF
    // jsPDF mendukung: helvetica, courier, times, symbol, zapfdingbats
    const fontFamily = 'helvetica'; // Font yang aman dan tersedia

    // Logo perusahaan (jika ada)
    if (companyInfo.logo) {
        try {
            doc.addImage(companyInfo.logo, 'PNG', pageWidth - 60, 10, 50, 20);
        } catch (e) {
            void e;
        }
    }

    // Info perusahaan di kanan atas
    doc.setFontSize(10);
    doc.setFont(fontFamily, 'bold');
    if (companyInfo.name) doc.text(String(companyInfo.name), pageWidth - 10, 15, { align: 'right' });

    doc.setFontSize(8);
    doc.setFont(fontFamily, 'normal');
    if (companyInfo.address) doc.text(String(companyInfo.address), pageWidth - 10, 22, { align: 'right' });
    if (companyInfo.email) doc.text(`Email: ${String(companyInfo.email)}`, pageWidth - 10, 28, { align: 'right' });
    if (companyInfo.phone) doc.text(`Telp: ${String(companyInfo.phone)}`, pageWidth - 10, 34, { align: 'right' });

    // Judul di kiri atas
    doc.setFontSize(16);
    doc.setFont(fontFamily, 'bold');
    doc.text('Laporan Sales Orders', 14, 15);

    // Timestamp dan jumlah data
    doc.setFontSize(10);
    doc.setFont(fontFamily, 'normal');
    doc.text(`Dibuat pada: ${new Date().toLocaleString('id-ID')}`, 14, 25);
    doc.text(`Total Data: ${dataToExport.length}`, 14, 32);

    // Info filter hanya tanggal
    const filterInfo = [];
    // Tambahkan filter tanggal jika ada
    if (filters.value.startDate) {
        filterInfo.push(`${new Date(filters.value.startDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}`);
    }
    if (filters.value.endDate) {
        filterInfo.push(`${new Date(filters.value.endDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}`);
    }

    if (filterInfo.length > 0) {
        doc.setFontSize(8);
        doc.setFont(fontFamily, 'normal');
        doc.text(`Periode: ${filterInfo.join(' - ')}`, 14, 40);
    }

    // Hitung lebar kolom dinamis
    const columnCount = columnDefinitions.length;
    const availableWidth = doc.internal.pageSize.width - 20;
    const baseColumnWidth = availableWidth / columnCount;

    // Style kolom
    const columnStyles = {};
    columnDefinitions.forEach((col, index) => {
        let cellWidth = baseColumnWidth;
        if (col.field === 'noSo' || col.field === 'noPo') {
            cellWidth = 25;
        } else if (col.field === 'customer.name') {
            cellWidth = 40;
        } else if (col.field === 'paymentMethod') {
            cellWidth = 25;
        } else if (col.field === 'status') {
            cellWidth = 20;
        } else if (col.field === 'date' || col.field === 'dueDate') {
            cellWidth = 25;
        } else if (col.field === 'perusahaan.nmPerusahaan' || col.field === 'cabang.nmCabang') {
            cellWidth = 30;
        } else if (col.field === 'total') {
            cellWidth = 25;
        }
        columnStyles[index] = { cellWidth };
    });

    autoTable(doc, {
        head: head,
        body: body,
        startY: filterInfo.length > 0 ? 50 : 45,
        styles: {
            font: fontFamily,
            fontSize: 7,
            cellPadding: 2,
            overflow: 'linebreak',
            halign: 'left',
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center',
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
        margin: { top: 30, right: 10, bottom: 10, left: 10 },
        tableWidth: 'auto',
        columnStyles: columnStyles,
        didDrawPage: function (data) {
            // Tambahkan nomor halaman
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setFont(fontFamily, 'normal');
            doc.text(`Halaman ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        },
        didParseCell: function (data) {
            // Highlight kolom total
            if (data.column.index === columnDefinitions.findIndex(col => col.field === 'total')) {
                if (data.section === 'head') {
                    data.cell.styles.textColor = [255, 255, 255];
                } else {
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.fillColor = [200, 255, 200];
                }
            }
        },
    });

    // Grand total setelah tabel
    const finalY = doc.lastAutoTable.finalY || 200;

    // Garis pemisah
    doc.setDrawColor(200, 200, 200);
    doc.line(10, finalY + 5, doc.internal.pageSize.width - 10, finalY + 5);

    // Grand total
    doc.setFontSize(12);
    doc.setFont(fontFamily, 'bold');
    doc.text('Grand Total:', 10, finalY + 20);
    doc.text(String(formattedGrandTotal), doc.internal.pageSize.width - 10, finalY + 20, { align: 'right' });

    // Info ringkasan
    doc.setFontSize(8);
    doc.setFont(fontFamily, 'normal');
    doc.text(`Total Sales Orders: ${dataToExport.length}`, 10, finalY + 30);

    // Pastikan pembagian tidak menghasilkan NaN atau Infinity
    let rataRata = 0;
    if (dataToExport.length > 0) {
        rataRata = grandTotal / dataToExport.length;
    }
    doc.text(
        `Rata-rata per Order: ${new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(rataRata)}`,
        10,
        finalY + 37
    );

    doc.save('sales-orders.pdf');
};

</script>

<style scoped>
    .v-select-style {
        min-height: 48px;
    }
    
    .attachment-preview {
        transition: all 0.3s ease;
    }

    .attachment-preview:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    :deep(.v-select-style .vs__dropdown-toggle),
    :deep(.perusahaan .vs__dropdown-toggle),
    :deep(.warehouse-select .vs__dropdown-toggle),
    :deep(.status .vs__dropdown-toggle),
    :deep(.vendor .vs__dropdown-toggle),
    :deep(.product-select .vs__dropdown-toggle),
    :deep(.reset-filter-button .btn),
    :deep(.cabang .vs__dropdown-toggle),
    :deep(.select-payment-method .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }

    @media (max-width: 575.98px) {
        .reset-filter-button {
            width: 25rem !important;
        }
        .reset-filter-button .btn {
            width: 100%;
        }
    }


</style>