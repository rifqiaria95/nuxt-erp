<template>
  <div class="content-wrapper">
      <!-- Content -->
      <div class="container-xxl flex-grow-1 container-p-y">
          <h4 class="mb-1">List Surat Jalan</h4>
          <p class="mb-6">
          List suratJalan yang terdaftar di sistem
          </p>
          <!-- suratJalan cards -->
          <div class="row g-6 mb-6">
              <!-- Static cards for display, can be made dynamic later -->
              <div class="col-xl-4 col-lg-6 col-md-6">
                  <div class="card">
                      <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center mb-4">
                              <h5 class="mb-1">Total Surat Jalan</h5>
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
                              <h5 class="mb-1">Pending Surat Jalan</h5>
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
                                  <button v-if="userHasRole('superadmin') || userHasPermission('create_surat_jalan')" @click="suratJalanStore.openModal(null)" class="btn btn-primary mb-2 text-wrap add-new-role">
                                      Tambah Surat Jalan
                                  </button>
                                  <p class="mb-0 mt-1">Buat Surat Jalan baru</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div class="row g-6">
              <div class="col-12">
                  <h4 class="mt-6 mb-1">Total & Filter Surat Jalan</h4>
                  <p class="mb-0">Temukan semua akun administrator perusahaan Anda dan Surat Jalan terkait.</p>
              </div>
              <div class="col-12">
                  <div class="card">
                      <div class="card-body">
                          <div class="row">
                              <div class="col-md-12">
                                  <v-select v-model="filters.customerId" :options="customers" label="name" :reduce="c => c.id" placeholder="Pilih Customer" class="v-select-style"/>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="col-12">
                  <!-- suratJalan Table -->
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
                                          placeholder="Cari Surat Jalan..."
                                          class="w-full md:w-20rem"
                                      />
                                  </span>
                              </div>
                          </div>
                      </div>
                      <div class="card-datatable table-responsive py-3 px-3">
                          <MyDataTable 
                              ref="myDataTableRef"
                              :data="suratJalans"
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
                                  <Column field="noSuratJalan" header="No. Surat Jalan" :sortable="true">
                                      <template #body="slotProps">
                                          <span>
                                              {{ slotProps.data.noSuratJalan || '-' }}
                                          </span>
                                      </template>
                                  </Column>
                                  <Column field="salesOrder.noSo" header="No. SO" :sortable="true">
                                      <template #body="slotProps">
                                          <span v-if="slotProps.data.salesOrder?.noSo && slotProps.data.salesOrder?.id">
                                              <a :href="`/sales/sales-order-detail?id=${slotProps.data.salesOrder.id}`" class="text-primary"
                                              style="text-decoration: underline;"
                                              title="Lihat Sales Order"
                                              >
                                                  {{ slotProps.data.salesOrder.noSo }}
                                              </a>
                                          </span>
                                          <span v-else>
                                              -
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
                                  <Column field="salesOrder.perusahaan.nmPerusahaan" header="Perusahaan" :sortable="true">
                                      <template #body="slotProps">
                                          <span>
                                              {{ slotProps.data.salesOrder?.perusahaan?.nmPerusahaan || '-' }}
                                          </span>
                                      </template>
                                  </Column>
                                  <Column header="Actions" :exportable="false" style="min-width:8rem">
                                      <template #body="slotProps">
                                          <div class="d-inline-block">
                                              <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                              </a>
                                              <ul class="dropdown-menu">
                                                  <li v-if="userHasRole('superadmin') || userHasPermission('view_surat_jalan')">
                                                      <a class="dropdown-item" href="javascript:void(0)" @click="viewSuratJalanDetails(slotProps.data.id)">
                                                          <i class="ri-eye-line me-2"></i> Lihat Detail
                                                      </a>
                                                  </li>
                                                  <li v-if="userHasRole('superadmin') || userHasPermission('edit_surat_jalan')">
                                                      <a class="dropdown-item" href="javascript:void(0)" @click="suratJalanStore.openModal(slotProps.data)">
                                                          <i class="ri-edit-box-line me-2"></i> Edit
                                                      </a>
                                                  </li>
                                                  <li v-if="userHasRole('superadmin') || userHasPermission('delete_surat_jalan')">
                                                      <a class="dropdown-item text-danger" href="javascript:void(0)" @click="suratJalanStore.deleteSuratJalan(slotProps.data.id)">
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
                  <!--/ suratJalan Table -->
              </div>
          </div>
          <!--/ suratJalan cards -->

          <Modal 
              id="SuratJalanModal"
              :title="modalTitle" 
              :description="modalDescription"
              :validation-errors-from-parent="validationErrors"
          >
              <template #default>
                  <form @submit.prevent="suratJalanStore.saveSuratJalan()">
                       <div class="row">
                          <div class="col">
                              <ul class="nav nav-tabs" role="tablist">
                                  <li class="nav-item">
                                      <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#form-tabs-info" role="tab" aria-selected="true" type="button">
                                          <span class="ri-user-line ri-20px d-sm-none"></span>
                                          <span class="d-none d-sm-block">Informasi Surat Jalan</span>
                                      </button>
                                  </li>
                                  <li class="nav-item">
                                      <button class="nav-link" data-bs-toggle="tab" data-bs-target="#form-tabs-items" role="tab" aria-selected="false" type="button">
                                          <span class="ri-folder-user-line ri-20px d-sm-none"></span>
                                          <span class="d-none d-sm-block">List Produk</span>
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
                                          :options="filteredSalesOrders" 
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
                                          <label>Tanggal Surat Jalan</label>
                                      </div>
                                  </div>
                                  <div class="col-md-3">
                                      <div class="form-floating form-floating-outline">
                                          <input type="text" v-model="form.picName" class="form-control" placeholder="Nama PIC">
                                          <label>Nama PIC</label>
                                      </div>
                                  </div>
                                  <div class="col-md-6">
                                    <div class="form-check form-switch mt-3 d-flex align-items-center">
                                        <input
                                          class="form-check-input me-2"
                                          type="checkbox"
                                          v-model="alamatSamaDenganCustomer"
                                        />
                                        <label class="form-check-label mb-0">
                                          Sama dengan alamat customer?
                                        </label>
                                    </div>
                                  </div>
                                  <div class="col-md-12" v-if="!alamatSamaDenganCustomer">
                                      <div class="form-floating form-floating-outline">
                                          <textarea v-model="form.alamatPengiriman" class="form-control" placeholder="Alamat Pengiriman"></textarea>
                                          <label>Alamat Pengiriman</label>
                                      </div>
                                  </div>
                                  <div class="col-md-12">
                                      <div class="form-floating form-floating-outline">
                                          <textarea v-model="form.description" class="form-control" placeholder="Deskripsi Surat Jalan"></textarea>
                                          <label>Deskripsi Surat Jalan</label>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="tab-pane fade" id="form-tabs-items" role="tabpanel">
                              <div v-for="(item, index) in (form.suratJalanItems || [])" :key="index" class="repeater-item mb-4">
                                  <div class="row g-3">
                                      <div class="col-md-6">
                                          <v-select v-model="item.productId" :options="customerProducts || []" :get-option-label="p => `${p.name} (${p.unit?.name || 'No Unit'})`" :reduce="p => p.id" placeholder="Pilih Produk" @update:modelValue="onProductChange(index)" class="v-select-style"/>
                                      </div>
                                      <div class="col-md-6">
                                          <v-select v-model="item.warehouseId" :options="warehouses" :get-option-label="w => `${w.name} (${w.code})`" :reduce="w => w.id" placeholder="Pilih Gudang" class="v-select-style" @update:modelValue="updateStockInfo(index)"/>
                                      </div>
                                      <div class="col-md-3">
                                          <div class="form-floating form-floating-outline">
                                              <input type="number" v-model.number="item.quantity" @input="onQuantityChange(index)" class="form-control" placeholder="Qty" step="1" min="0">
                                              <label>Jumlah</label>
                                          </div>
                                      </div>
                                      <div class="col-md-6">
                                          <div class="form-floating form-floating-outline">
                                              <input type="text" v-model="item.description" class="form-control" placeholder="Deskripsi item">
                                              <label>Deskripsi</label>
                                          </div>
                                      </div>
                                      <div class="col-md-3 d-flex align-items-center">
                                          <button @click.prevent="removeSuratJalanItem(index)" class="btn btn-outline-danger w-100">Hapus</button>
                                      </div>
                                  </div>
                                  <hr class="my-4">
                              </div>
                              <div class="mt-4">
                                  <button @click.prevent="addSuratJalanItem()" class="btn btn-primary">Tambah Item</button>
                              </div>
                          </div>
                      </div>
                      <div class="modal-footer mt-6">
                           <button type="button" class="btn btn-outline-secondary" @click="suratJalanStore.closeModal()">Tutup</button>
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
import { useSuratJalanStore } from '~/stores/surat-jalan'
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
import { useFormatRupiah } from '~/composables/formatRupiah'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import vSelect from 'vue-select'
import Dropdown from 'primevue/dropdown'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import 'vue-select/dist/vue-select.css'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'

const config = useRuntimeConfig();
const router = useRouter();
const toast = useToast();

// Store
const myDataTableRef        = ref(null)
const suratJalanStore       = useSuratJalanStore()
const customerStore         = useCustomerStore()
const perusahaanStore       = usePerusahaanStore()
const warehouseStore        = useWarehouseStore()
const productStore          = useProductStore()
const userStore             = useUserStore()
const formatRupiah          = useFormatRupiah()
const { userHasPermission, userHasRole } = usePermissions();
const permissionStore       = usePermissionsStore()
const salesOrderStore       = useSalesOrderStore()

const { suratJalans, loading, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(suratJalanStore)
const { customers }   = storeToRefs(customerStore)
const { salesOrders, customerProducts } = storeToRefs(salesOrderStore)
const { warehouses }  = storeToRefs(warehouseStore)

// State
const filters = ref({
customerId: null,
search: '',
});

const globalFilterValue = ref('');
const alamatSamaDenganCustomer = ref(false)

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);
const modalTitle = computed(() => isEditMode.value ? 'Edit Surat Jalan' : 'Tambah Surat Jalan');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data Surat Jalan di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan data Surat Jalan baru.');

let modalInstance = null;
onMounted(() => {
  userStore.loadUser();
  suratJalanStore.fetchSuratJalans();
  customerStore.fetchCustomers();
  salesOrderStore.fetchSalesOrders();
  warehouseStore.fetchWarehouses();
  permissionStore.fetchPermissions();

  const modalElement = document.getElementById('SuratJalanModal')
  if (modalElement) {
      modalInstance = new bootstrap.Modal(modalElement)
  }
});

watch(showModal, (newValue) => {
  if (newValue) {
      modalInstance?.show()
      if (isEditMode.value) {
        // Fetch stock for existing items
        if (form.value.suratJalanItems && form.value.suratJalanItems.length > 0) {
            form.value.suratJalanItems.forEach((item, index) => {
                updateStockInfo(index);
            });
        }
      }
  } else {
      modalInstance?.hide()
  }
})

// Watcher untuk salesOrderId - auto fill data ketika dipilih
watch(() => form.value.salesOrderId, async (newSalesOrderId, oldSalesOrderId) => {
  if (newSalesOrderId && newSalesOrderId !== oldSalesOrderId) {
    // Filter salesOrders hanya yang status-nya 'approved' atau 'partial'
    const filteredSalesOrders = salesOrders.value?.filter(so => so.status === 'approved' || so.status === 'partial' || so.status === 'delivered') || [];
    const selectedSalesOrder = filteredSalesOrders.find(so => so.id === newSalesOrderId);

    if (selectedSalesOrder) {

      // Auto fill data dari sales order yang dipilih
      form.value.customerId = selectedSalesOrder.customerId || selectedSalesOrder.customer?.id;

      // Jika ada data perusahaan dan cabang di sales order
      if (selectedSalesOrder.perusahaanId) {
        form.value.perusahaanId = selectedSalesOrder.perusahaanId;
      }

      // Auto fill tanggal jika belum ada
      if (!form.value.date && selectedSalesOrder.date) {
        form.value.date = new Date(selectedSalesOrder.date).toISOString().split('T')[0];
      }

      // ✅ AUTO FILL SALES ORDER ITEMS - HANYA JIKA BUKAN EDIT MODE
      if (!isEditMode.value) {
        try {
          // Fetch detail sales order dengan items
          await salesOrderStore.getSalesOrderDetails(newSalesOrderId);
          const detailedSalesOrder = salesOrderStore.salesOrder;

          if (detailedSalesOrder && detailedSalesOrder.salesOrderItems) {

            // Pastikan suratJalanItems selalu ada
            if (!form.value.suratJalanItems) {
              form.value.suratJalanItems = [];
            }

            // Clear existing items
            form.value.suratJalanItems = [];

            // Auto fill items dari sales order - HANYA YANG STATUS_PARTIAL = TRUE
            detailedSalesOrder.salesOrderItems
              .filter(soItem => soItem.statusPartial === true)
              .forEach((soItem, index) => {
                const suratJalanItem = {
                  productId: soItem.productId,
                  warehouseId: soItem.warehouseId,
                  quantity: Math.floor(Number(soItem.quantity)) || 0,
                  description: soItem.description || '',
                  // Sertakan info produk jika ada
                  product: soItem.product ? {
                    id: soItem.product.id,
                    name: soItem.product.name,
                    sku: soItem.product.sku,
                    priceSell: soItem.product.priceSell,
                    unit: soItem.product.unit
                  } : null,
                  // Sertakan info gudang jika ada
                  warehouse: soItem.warehouse ? {
                    id: soItem.warehouse.id,
                    name: soItem.warehouse.name
                  } : null,
                  // Referensi ke sales order item
                  salesOrderItemId: soItem.id
                };

                form.value.suratJalanItems.push(suratJalanItem);
              });

            
          }
        } catch (error) {
          console.error('❌ Error fetching sales order details for auto fill:', error);
          // Fallback: buat array kosong
          form.value.suratJalanItems = [];
        }
        } else {
      }

      
    }
  } else if (!newSalesOrderId && oldSalesOrderId) {
    // Jika sales order dihapus/di-clear, reset beberapa field ke kondisi manual

    // Reset ke default values tapi tetap biarkan user bisa edit
    if (!isEditMode.value) {
      form.value.customerId = null;
      // Clear surat jalan items
      if (!form.value.suratJalanItems) {
        form.value.suratJalanItems = [];
      } else {
        form.value.suratJalanItems = [];
      }
    }
  }
});

// ✅ NEW: Watcher untuk customerId - fetch products untuk customer yang dipilih
watch(() => form.value.customerId, (newCustomerId, oldCustomerId) => {
if (newCustomerId && newCustomerId !== oldCustomerId) {
  // Hanya fetch jika customerId valid dan berubah
  if (typeof newCustomerId === 'number' || typeof newCustomerId === 'string') {
    salesOrderStore.fetchProductsForCustomer(newCustomerId);
  }
} else if (!newCustomerId) {
  // Reset customer products jika customer dihapus
  salesOrderStore.customerProducts = [];
}
});

watch(() => customerProducts, (newProducts) => {
if (form.value.suratJalanItems && Array.isArray(form.value.suratJalanItems) && newProducts && Array.isArray(newProducts)) {
  form.value.suratJalanItems.forEach(item => {
    if (!item) return;
    const productExists = newProducts.some(p => p && p.id === item.productId);
    if (!productExists) {
      item.productId = null;
    }
  });
}
}, { deep: true });

watch(alamatSamaDenganCustomer, (val) => {
  if (val) {
    // Ambil data customer yang dipilih
    const selectedCustomer = customers.value.find(c => c.id === form.value.customerId)
    form.value.alamatPengiriman = selectedCustomer?.address || ''
  } else {
    form.value.alamatPengiriman = ''
  }
})

// Jika customerId berubah dan checkbox aktif, update alamat otomatis
watch(() => form.value.customerId, (val) => {
  if (alamatSamaDenganCustomer.value) {
    const selectedCustomer = customers.value.find(c => c.id === val)
    form.value.alamatPengiriman = selectedCustomer?.address || ''
  }
})


watch(globalFilterValue, useDebounceFn((newValue) => {
  filters.value.search = newValue;
}, 500));

watch(filters, (newFilters) => {
  const { page, rows, ...restFilters } = newFilters;
  suratJalanStore.setFilters(restFilters);
}, { deep: true });

const onPage = (event) => {
  params.value.first = event.first;
  suratJalanStore.fetchSuratJalans();
};
const handleRowsChange = () => {
  params.value.first = 0;
  suratJalanStore.fetchSuratJalans();
};
const onSort = (event) => {
  params.value.sortField = event.sortField;
  params.value.sortOrder = event.sortOrder;
  suratJalanStore.fetchSuratJalans();
};

const exportData = (format) => {
  if (format === 'csv') myDataTableRef.value.exportCSV();
};

// ✅ NEW: Function untuk menangani perubahan produk pada suratJalan items
const onProductChange = (index) => {
const selectedProductId = form.value.suratJalanItems[index].productId;
const selectedProduct = customerProducts.value && Array.isArray(customerProducts.value) 
  ? customerProducts.value.find(p => p && p.id === selectedProductId)
  : null;

if (selectedProduct) {
  const item = form.value.suratJalanItems[index];
  item.price = Number(selectedProduct.priceSell) || 0;
  calculateSubtotal(index);
  updateStockInfo(index);
}
};

// ✅ NEW: Function untuk getSalesOrderLabel
const getSalesOrderLabel = (salesOrder) => {
  if (!salesOrder) return '';
  return `${salesOrder.noSo} - ${salesOrder.customer?.name || 'No Customer'}`;
};

// ✅ NEW: Function untuk calculateSubtotal
const calculateSubtotal = (index) => {
  const item = form.value.suratJalanItems[index];
  if (item && item.quantity && item.price) {
    item.subtotal = Number(item.quantity) * Number(item.price);
  } else {
    item.subtotal = 0;
  }
};

// ✅ NEW: Function untuk handle perubahan quantity
const onQuantityChange = (index) => {
  const item = form.value.suratJalanItems[index];
  if (item && item.quantity !== null && item.quantity !== undefined) {
    item.quantity = Math.floor(Number(item.quantity)) || 0;
    calculateSubtotal(index);
  }
};

// ✅ NEW: Computed property untuk suratJalanItemsTotal
const suratJalanItemsTotal = computed(() => {
  if (!form.value.suratJalanItems || !Array.isArray(form.value.suratJalanItems)) {
    return 0;
  }
  return form.value.suratJalanItems.reduce((total, item) => {
    return total + (Number(item.subtotal) || 0);
  }, 0);
});

// ✅ NEW: Computed property untuk grandTotal
const grandTotal = computed(() => {
  return suratJalanItemsTotal.value;
});

// ✅ NEW: Function untuk update stock info
const updateStockInfo = async (index) => {
const item = form.value.suratJalanItems[index];
if (item.productId && item.warehouseId) {
  try {
    const stockStore = useStocksStore();
    stockStore.params.search = ''; // Reset search if any
    stockStore.params.rows = 1; // We only need one record
    const response = await stockStore.fetchStocksPaginated({
      productId: item.productId,
      warehouseId: item.warehouseId,
    });
    if (response && response.data && response.data.length > 0) {
      item.stock = response.data[0];
    } else {
      item.stock = { quantity: 0 };
    }
  } catch (error) {
    console.error('Failed to fetch stock info:', error);
    item.stock = { quantity: 0 };
  }
} else {
  item.stock = { quantity: 0 };
}
};

// ✅ NEW: Function untuk menambah item suratJalan
const addSuratJalanItem = () => {
// Pastikan suratJalanItems selalu ada
if (!form.value.suratJalanItems) {
  form.value.suratJalanItems = [];
}
form.value.suratJalanItems.push({
  productId: null,
  warehouseId: null,
  quantity: 1,
  price: 0,
  description: '',
  subtotal: 0,
  deliveredQty: 0,
  isReturned: false,
  stock: { quantity: 0 },
});
};

// ✅ NEW: Function untuk menghapus item suratJalan
const removeSuratJalanItem = (index) => {
form.value.suratJalanItems.splice(index, 1);
};

const viewSuratJalanDetails = (suratJalanId) => {
  
  if (!suratJalanId) {
      console.error('❌ Page Debug - No suratJalanId provided');
      toast.fire({
          icon: 'error',
          title: 'Parameter Tidak Valid',
          text: 'ID Surat Jalan tidak valid.',
          confirmButtonText: 'OK'
      });
      return;
  }
  
  router.push({ path: `/sales/surat-jalan-detail`, query: { id: suratJalanId } });
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID', { 
      day  : '2-digit',
      month: '2-digit',
      year : 'numeric'
  });
};

const filteredSalesOrders = computed(() => {
  return (salesOrders.value || []).filter(so => so.status === 'approved' || so.status === 'partial' || so.status === 'delivered')
})

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