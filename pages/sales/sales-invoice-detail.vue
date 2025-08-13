<template>
  <div class="content-wrapper">
    <!-- Content -->
    <div class="container-xxl flex-grow-1 container-p-y">
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <template v-else-if="salesInvoice">
        <div class="row invoice-preview">
          <!-- Invoice -->
          <div class="col-xl-9 col-md-8 col-12 mb-md-0 mb-6">
            <div class="card invoice-preview-card p-sm-12 p-6">
              <div class="card-body invoice-preview-header rounded-4 p-6">
                <div class="d-flex justify-content-between flex-xl-row flex-md-column flex-sm-row flex-column text-heading align-items-xl-center align-items-md-start align-items-sm-center flex-wrap gap-6">
                  <div>
                    <div class="d-flex svg-illustration align-items-center gap-2 mb-6">
                      <span class="app-brand-logo demo">
                        <span style="color: var(--bs-primary)">
                          <img src="~/public/img/branding/andara.png" alt="logo" width="200">
                        </span>
                      </span>
                    </div>
                    <p class="mb-1">{{ salesInvoice.salesOrder?.perusahaan?.alamatPerusahaan || 'Alamat Perusahaan' }}</p>
                    <p class="mb-1">{{ salesInvoice.salesOrder?.perusahaan?.kodePerusahaan || 'Kode Perusahaan' }}</p>
                    <p class="mb-0">{{ salesInvoice.salesOrder?.perusahaan?.npwpPerusahaan || 'NPWP Perusahaan' }}</p>
                  </div>
                  <div>
                    <div class="d-flex align-items-center gap-3 mb-6">
                      <h5 class="mb-0">Invoice Number : {{ salesInvoice.noInvoice }}</h5>
                      <span :class="getStatusBadgeClass(salesInvoice.status)">
                        {{ getStatusText(salesInvoice.status) }}
                      </span>
                    </div>
                    <div class="mb-1">
                      <span>Date Issues: </span>
                      <span>{{ formatDate(salesInvoice.date) }}</span>
                    </div>
                    <div class="mb-1">
                      <span>Due Date: </span>
                      <span>{{ formatDate(salesInvoice.dueDate) }}</span>
                    </div>
                    <div>
                      <span>Sales Order: </span>
                      <span class="fw-bold">{{ salesInvoice.salesOrder?.noSo || '-' }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body py-6 px-0">
                <div class="d-flex justify-content-between flex-wrap gap-6">
                  <div>
                    <h6>Invoice To:</h6>
                    <p class="mb-1">{{ salesInvoice.salesOrder?.up || 'UP' }}</p>
                    <p class="mb-1">{{ salesInvoice.customer?.name || 'Customer Name' }}</p>
                    <p class="mb-1">{{ salesInvoice.customer?.address || 'Customer Address' }}</p>
                    <p class="mb-1">{{ salesInvoice.customer?.phone || 'Customer Phone' }}</p>
                    <p class="mb-0">{{ salesInvoice.customer?.email || 'Customer Email' }}</p>
                  </div>
                  <div>
                    <h6>Bill To:</h6>
                    <p class="mb-1">{{ salesInvoice.salesOrder?.perusahaan?.nmPerusahaan || 'Nama Perusahaan' }}</p>
                    <p class="mb-1">{{ salesInvoice.salesOrder?.perusahaan?.alamatPerusahaan || 'Alamat Perusahaan' }}</p>
                  </div>
                </div>
              </div>
              
              <!-- ✅ SALES INVOICE ITEMS TABLE -->
              <div class="table-responsive border rounded-4 border-bottom-0">
                <table class="table m-0">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Description</th>
                      <th>Unit Price</th>
                      <th>Quantity</th>
                      <th>Delivered Qty</th>
                      <th>Subtotal</th>
                      <th>Warehouse</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in salesInvoice.salesInvoiceItems" :key="item.id">
                      <td class="text-nowrap text-heading">{{ item.product?.name || 'Product Name' }}</td>
                      <td class="text-nowrap">{{ item.description || '-' }}</td>
                      <td>{{ formatRupiah(item.price) }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.deliveredQty }}</td>
                      <td>{{ formatRupiah(item.subtotal) }}</td>
                      <td>{{ item.warehouse?.name || 'Warehouse' }}</td>
                      <td>
                        <span v-if="item.isReturned" class="badge bg-danger">Returned</span>
                        <span v-else class="badge bg-success">Delivered</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- ✅ PAYMENT SUMMARY -->
              <div class="table-responsive">
                <table class="table m-0 table-borderless">
                  <tbody>
                    <tr>
                      <td class="align-top px-0 py-6">
                        <p class="mb-1">
                          <span class="me-2 fw-medium text-heading">Description:</span><br>
                          <span>{{ salesInvoice.description || '-' }}</span>
                        </p>
                        <span>Thanks for your business</span>
                      </td>
                      <td class="pe-0 py-6 align-top" style="min-width: 170px;">
                        <div class="d-flex flex-column align-items-end gap-1" style="min-width: 170px;">
                          <div class="d-flex w-100 justify-content-between">
                            <span class="text-end" style="min-width: 90px;">Subtotal</span>
                            <span class="mx-2">:</span>
                          </div>
                          <div class="d-flex w-100 justify-content-between">
                            <span class="text-end" style="min-width: 90px;">Discount</span>
                            <span class="mx-2">:</span>
                          </div>
                          <div class="d-flex w-100 justify-content-between">
                            <span class="text-end" style="min-width: 90px;">Tax</span>
                            <span class="mx-2">:</span>
                          </div>
                          <div class="d-flex w-100 justify-content-between border-bottom pb-2">
                            <span class="text-end" style="min-width: 90px;">Total</span>
                            <span class="mx-2">:</span>
                          </div>
                          <div class="d-flex w-100 justify-content-between">
                            <span class="text-end" style="min-width: 90px;">Paid Amount</span>
                            <span class="mx-2">:</span>
                          </div>
                          <div class="d-flex w-100 justify-content-between pt-2">
                            <span class="text-end" style="min-width: 90px;">Remaining</span>
                            <span class="mx-2">:</span>
                          </div>
                        </div>
                      </td>
                      <td class="text-end px-0 py-6 align-top" style="min-width: 170px;">
                        <div class="d-flex flex-column gap-1 align-items-end" style="min-width: 170px;">
                          <span class="fw-medium mb-1" style="color: #6c757d;">{{ formatRupiah(subtotalAmount) }}</span>
                          <span class="fw-medium mb-1" style="color: #6c757d;">
                            {{ (typeof salesInvoice.discountPercent === 'number' ? salesInvoice.discountPercent : Number(salesInvoice.discountPercent) || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',00','') }}% ({{ formatRupiah(discountAmount) }})
                          </span>
                          <span class="fw-medium mb-1" style="color: #6c757d;">
                            {{ (typeof salesInvoice.taxPercent === 'number' ? salesInvoice.taxPercent : Number(salesInvoice.taxPercent) || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',00','') }}% ({{ formatRupiah(taxAmount) }})
                          </span>
                          <span class="fw-medium mb-1 border-bottom pb-2" style="color: #6c757d;">{{ formatRupiah(salesInvoice.total) }}</span>
                          <span class="fw-medium mb-1 text-success" style="color: #6c757d !important;">{{ formatRupiah(salesInvoice.paidAmount) }}</span>
                          <span class="fw-medium mb-0 pt-2"
                                :class="salesInvoice.remainingAmount > 0 ? 'text-danger' : 'text-success'"
                                :style="salesInvoice.remainingAmount > 0 ? 'color:#ea5455' : 'color:#28c76f'">
                            {{ formatRupiah(salesInvoice.remainingAmount) }}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <hr class="mt-0 mb-6" />
              
              <!-- ✅ RELATED SALES ORDER INFO -->
              <div class="card-body p-0">
                <div class="row">
                  <div class="col-12">
                    <h6>Related Sales Order Information:</h6>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="d-flex mb-1">
                          <span class="fw-medium" style="min-width: 120px; display: inline-block;">Sales Order</span>
                          <span class="fw-medium me-1">:</span>
                          <span>{{ salesInvoice.salesOrder?.noSo || '-' }}</span>
                        </div>
                        <div class="d-flex mb-1">
                          <span class="fw-medium" style="min-width: 120px; display: inline-block;">Status</span>
                          <span class="fw-medium me-1">:</span>
                          <span :class="getStatusBadgeClass(salesInvoice.salesOrder?.status)" style="font-size: 0.7rem;">
                            {{ getStatusText(salesInvoice.salesOrder?.status) }}
                          </span>
                        </div>
                        <div class="d-flex mb-1">
                          <span class="fw-medium" style="min-width: 120px; display: inline-block;">Order Date</span>
                          <span class="fw-medium me-1">:</span>
                          <span>{{ formatDate(salesInvoice.salesOrder?.date) }}</span>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="d-flex mb-1">
                          <span class="fw-medium" style="min-width: 120px; display: inline-block;">Company</span>
                          <span class="fw-medium me-1">:</span>
                          <span>{{ salesInvoice.salesOrder?.perusahaan?.nmPerusahaan || '-' }}</span>
                        </div>
                        <div class="d-flex mb-1">
                          <span class="fw-medium" style="min-width: 120px; display: inline-block;">Branch</span>
                          <span class="fw-medium me-1">:</span>
                          <span>{{ salesInvoice.salesOrder?.cabang?.nmCabang || '-' }}</span>
                        </div>
                        <div class="d-flex mb-1">
                          <span class="fw-medium" style="min-width: 120px; display: inline-block;">Customer</span>
                          <span class="fw-medium me-1">:</span>
                          <span>{{ salesInvoice.customer?.name || '-' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- /Invoice -->

          <!-- Invoice Actions -->
          <div class="col-xl-3 col-md-4 col-12 invoice-actions">
            <div class="card">
              <div class="card-body">
                <button class="btn btn-primary d-grid w-100 mb-4" @click="printSalesInvoice(salesInvoice.id)">
                  <span class="d-flex align-items-center justify-content-center text-nowrap">
                    <i class="ri-printer-line ri-16px me-2"></i>Print Invoice
                  </span>
                </button>
                <button class="btn btn-outline-secondary d-grid w-100 mb-4" @click="downloadInvoice">
                  Download PDF
                </button>
                <div class="d-flex mb-4">
                  <button class="btn btn-outline-secondary d-grid w-100 me-4" @click="editInvoice">
                    Edit
                  </button>
                  <button class="btn btn-outline-primary d-grid w-100" @click="viewSalesOrder">
                    View Sales Order
                  </button>
                </div>
                <button class="btn btn-success d-grid w-100" @click="addPayment">
                  <span class="d-flex align-items-center justify-content-center text-nowrap">
                    <i class="ri-money-dollar-circle-line ri-16px me-2"></i>Add Payment
                  </span>
                </button>
              </div>
            </div>
          </div>
          <!-- /Invoice Actions -->
        </div>
      </template>
      <div v-else class="text-center">
        <p>Sales Invoice not found.</p>
      </div>
    </div>
    <!-- / Content -->
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSalesInvoiceStore } from '~/stores/sales-invoice'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import { useDynamicTitle } from '~/composables/useDynamicTitle'

// Composables
const { setDetailTitle } = useDynamicTitle()

const route = useRoute()
const router = useRouter()
const salesInvoiceStore = useSalesInvoiceStore()
const formatRupiah = useFormatRupiah()

const { loading, salesInvoice } = storeToRefs(salesInvoiceStore)

const invoiceId = route.query.id

// ✅ COMPUTED PROPERTIES untuk calculations
const subtotalAmount = computed(() => {
  if (!salesInvoice.value?.salesInvoiceItems) return 0
  return salesInvoice.value.salesInvoiceItems.reduce((sum, item) => sum + Number(item.subtotal), 0)
})

const discountAmount = computed(() => {
  const subtotal = subtotalAmount.value
  const discountPercent = Number(salesInvoice.value?.discountPercent) || 0
  return subtotal * (discountPercent / 100)
})

const taxAmount = computed(() => {
  const subtotal = subtotalAmount.value
  const discount = discountAmount.value
  const afterDiscount = subtotal - discount
  const taxPercent = Number(salesInvoice.value?.taxPercent) || 0
  return afterDiscount * (taxPercent / 100)
})

// ✅ HELPER FUNCTIONS
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'draft': return 'badge bg-secondary'
    case 'approved': return 'badge bg-primary'
    case 'partial': return 'badge bg-warning'
    case 'delivered': return 'badge bg-success'
    case 'rejected': return 'badge bg-danger'
    case 'unpaid': return 'badge bg-danger'
    case 'paid': return 'badge bg-success'
    default: return 'badge bg-light'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'draft': return 'DRAFT'
    case 'approved': return 'APPROVED'
    case 'partial': return 'PARTIAL'
    case 'delivered': return 'DELIVERED'
    case 'rejected': return 'REJECTED'
    case 'unpaid': return 'UNPAID'
    case 'paid': return 'PAID'
    default: return 'UNKNOWN'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// ✅ ACTION METHODS
const printSalesInvoice = (id) => {
  router.push({
    path: '/sales/cetak-invoice',
    query: { id: id, print: true }
  })
}

const downloadInvoice = () => {
  // Implement PDF download logic
}

const editInvoice = () => {
  // Navigate to edit page or open modal
}

const viewSalesOrder = () => {
  if (salesInvoice.value?.salesOrderId) {
    router.push({
      path: '/sales/sales-order-detail',
      query: { id: salesInvoice.value.salesOrderId }
    })
  }
}

const addPayment = () => {
  // Implement payment logic
}

// ✅ FETCH INVOICE DETAILS menggunakan store
async function fetchInvoiceDetails() {
  const invoiceIdToFetch = Array.isArray(invoiceId) ? invoiceId[0] : invoiceId
  
  if (typeof invoiceIdToFetch === 'string' && invoiceIdToFetch.trim() !== '') {
    try {
      await salesInvoiceStore.fetchInvoiceDetailWithItems(invoiceIdToFetch)
    } catch (error) {
      console.error('❌ Failed to fetch invoice details:', error)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: `Tidak dapat memuat detail Sales Invoice dengan ID: ${invoiceIdToFetch}. ${error.message || 'Silakan coba lagi.'}`,
        confirmButtonText: 'OK'
      })
    }
  } else {
    console.error('❌ Invalid invoiceId:', invoiceIdToFetch)
    Swal.fire({
      icon: 'error',
      title: 'Parameter Tidak Valid',
      text: 'ID Sales Invoice tidak valid atau kosong.',
      confirmButtonText: 'OK'
    })
  }
}

onMounted(() => {
  fetchInvoiceDetails()
  setDetailTitle('Sales Invoice', salesInvoice.value.noInvoice)
})
</script>

<style scoped>
.invoice-preview-header {
  background-color: #F2F3F4;
}

.badge {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.text-success {
  color: #28c76f !important;
}

.text-danger {
  color: #ea5455 !important;
}

.text-warning {
  color: #ff9f43 !important;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.table td {
  vertical-align: middle;
}

/* Print styles */
@media print {
  .invoice-actions {
    display: none !important;
  }
  
  .card {
    border: none !important;
    box-shadow: none !important;
  }
}
</style>