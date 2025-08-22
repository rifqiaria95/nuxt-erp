<template>
    <div class="content-wrapper">
      <!-- Content -->
      <div class="container-xxl flex-grow-1 container-p-y">
        <div v-if="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <template v-else-if="suratJalan">
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
                      <p class="mb-1">{{ suratJalan.salesOrder?.perusahaan?.alamatPerusahaan || 'Alamat Perusahaan' }}</p>
                      <p class="mb-1">{{ suratJalan.salesOrder?.perusahaan?.kodePerusahaan || 'Kode Perusahaan' }}</p>
                      <p class="mb-0">{{ suratJalan.salesOrder?.perusahaan?.npwpPerusahaan || 'NPWP Perusahaan' }}</p>
                    </div>
                    <div>
                      <div class="d-flex align-items-center gap-3 mb-6">
                        <h5 class="mb-0">No. SJ : {{ suratJalan?.noSuratJalan || '-' }}</h5>
                      </div>
                      <div class="mb-1">
                        <span>Date Issues: </span>
                        <span>{{ formatDate(suratJalan?.date) }}</span>
                      </div>
                      <div>
                        <span>Sales Order: </span>
                        <span class="fw-bold">{{ suratJalan.salesOrder?.noSo || '-' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-body py-6 px-0">
                  <div class="d-flex justify-content-between flex-wrap gap-6">
                    <div>
                      <h6>Invoice To:</h6>
                      <p class="mb-1">{{ suratJalan.salesOrder?.up || 'UP' }}</p>
                      <p class="mb-1">{{ suratJalan.customer?.name || 'Customer Name' }}</p>
                      <p class="mb-1">{{ suratJalan.customer?.address || 'Customer Address' }}</p>
                      <p class="mb-1">{{ suratJalan.customer?.phone || 'Customer Phone' }}</p>
                      <p class="mb-0">{{ suratJalan.customer?.email || 'Customer Email' }}</p>
                    </div>
                    <div>
                      <h6>Bill To:</h6>
                      <p class="mb-1">{{ suratJalan.salesOrder?.perusahaan?.nmPerusahaan || 'Nama Perusahaan' }}</p>
                      <p class="mb-1">{{ suratJalan.salesOrder?.perusahaan?.alamatPerusahaan || 'Alamat Perusahaan' }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- ✅ SALES INVOICE ITEMS TABLE -->
                <div class="table-responsive border rounded-4 border-bottom-0">
                  <table class="table m-0">
                    <thead>
                      <tr>
                        <th>Part Number</th>
                        <th>Product</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Warehouse</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in suratJalan?.suratJalanItems || []" :key="item.id">
                        <td class="text-nowrap text-heading">{{ item.product?.sku || 'Part Number' }}</td>
                        <td class="text-nowrap text-heading">{{ item.product?.name || 'Product Name' }}</td>
                        <td class="text-nowrap">{{ item.description || '-' }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.warehouse?.name || 'Warehouse' }}</td>
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
                            <span>{{ suratJalan?.description || '-' }}</span>
                          </p>
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
                            <span>{{ suratJalan.salesOrder?.noSo || '-' }}</span>
                          </div>
                          <div class="d-flex mb-1">
                            <span class="fw-medium" style="min-width: 120px; display: inline-block;">Order Date</span>
                            <span class="fw-medium me-1">:</span>
                            <span>{{ formatDate(suratJalan.salesOrder?.date) }}</span>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="d-flex mb-1">
                            <span class="fw-medium" style="min-width: 120px; display: inline-block;">Company</span>
                            <span class="fw-medium me-1">:</span>
                            <span>{{ suratJalan.salesOrder?.perusahaan?.nmPerusahaan || '-' }}</span>
                          </div>
                          <div class="d-flex mb-1">
                            <span class="fw-medium" style="min-width: 120px; display: inline-block;">Branch</span>
                            <span class="fw-medium me-1">:</span>
                            <span>{{ suratJalan.salesOrder?.cabang?.nmCabang || '-' }}</span>
                          </div>
                          <div class="d-flex mb-1">
                            <span class="fw-medium" style="min-width: 120px; display: inline-block;">Customer</span>
                            <span class="fw-medium me-1">:</span>
                            <span>{{ suratJalan.customer?.name || '-' }}</span>
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
                  <button class="btn btn-primary d-grid w-100 mb-4" @click="printSuratJalan(suratJalan?.id)" :disabled="!suratJalan?.id">
                    <span class="d-flex align-items-center justify-content-center text-nowrap">
                      <i class="ri-printer-line ri-16px me-2"></i>Print Surat Jalan
                    </span>
                  </button>
                  <button class="btn btn-outline-secondary d-grid w-100 mb-4" @click="downloadSuratJalan" :disabled="!suratJalan?.id">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
            <!-- /Invoice Actions -->
          </div>
        </template>
        <div v-else class="text-center">
          <p>Surat Jalan not found.</p>
        </div>
      </div>
      <!-- / Content -->
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSuratJalanStore } from '~/stores/surat-jalan'
  import { storeToRefs } from 'pinia'
  import Swal from 'sweetalert2'
  import { useDynamicTitle } from '~/composables/useDynamicTitle'
  
  // Composables
  const { setDetailTitle } = useDynamicTitle()

  const route = useRoute()
  const router = useRouter()
  const suratJalanStore = useSuratJalanStore()
  const formatRupiah = useFormatRupiah()
  
  const { loading, suratJalan } = storeToRefs(suratJalanStore)
  
  const suratJalanId = route.query.id
  
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }
  
  // ✅ ACTION METHODS
  const printSuratJalan = (id) => {
    if (!id) {
      console.error('❌ No surat jalan ID provided for printing')
      return
    }
    router.push({
      path: '/sales/cetak-surat-jalan',
      query: { id: id, print: true }
    })
  }

  const downloadSuratJalan = () => {
    if (!suratJalan.value?.id) {
      console.error('❌ No surat jalan ID provided for download')
      return
    }
    // TODO: Implement PDF download functionality
    console.log('Download PDF for surat jalan:', suratJalan.value.id)
  }
  
  // ✅ FETCH SURAT JALAN DETAILS menggunakan store
  async function fetchSuratJalanDetails() {
    const suratJalanIdToFetch = Array.isArray(suratJalanId) ? suratJalanId[0] : suratJalanId
    
    if (typeof suratJalanIdToFetch === 'string' && suratJalanIdToFetch.trim() !== '') {
      try {
        await suratJalanStore.fetchSuratJalanDetailWithItems(suratJalanIdToFetch)
      } catch (error) {
        console.error('❌ Failed to fetch surat jalan details:', error)
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: `Tidak dapat memuat detail Surat Jalan dengan ID: ${suratJalanIdToFetch}. ${error.message || 'Silakan coba lagi.'}`,
          confirmButtonText: 'OK'
        })
      }
    } else {
      console.error('❌ Invalid suratJalanId:', suratJalanIdToFetch)
      Swal.fire({
        icon: 'error',
        title: 'Parameter Tidak Valid',
        text: 'ID Surat Jalan tidak valid atau kosong.',
        confirmButtonText: 'OK'
      })
    }
  }
  
  onMounted(() => {
    fetchSuratJalanDetails()
  })

  // Watch untuk update title ketika data sudah ter-load
  watch(suratJalan, (newSuratJalan) => {
    if (newSuratJalan) {
      setDetailTitle('Surat Jalan', newSuratJalan.noSuratJalan)
    }
  }, { immediate: true })
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