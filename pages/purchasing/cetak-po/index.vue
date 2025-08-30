<template>
    <div v-if="loading" class="text-center p-6">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger m-6">{{ error.message }}</div>
    <div v-else-if="purchaseOrder" class="p-6">
      <!-- Header Section -->
      <div class="d-flex justify-content-between align-items-start align-content-center mb-6">
        <!-- Logo Section - Left -->
        <div v-if="purchaseOrder.perusahaan" class="logo-section">
          <div class="d-flex svg-illustration align-content-center gap-2 mb-4">
            <span class="app-brand-logo demo">
              <img src="~/public/img/branding/andara.png" alt="logo" width="250">
            </span>
          </div>
          <div class="text-start text-secondary-medium mt-6 mb-0" style="font-size: 12px; width: 220px; min-width: 220px;">
            <p class="mb-0">
              Alamat: {{ purchaseOrder.perusahaan?.alamatPerusahaan || purchaseOrder.perusahaan?.alamatPerusahaan || '-' }}
            </p>
            <p class="mb-0">
              Telepon: {{ purchaseOrder.perusahaan?.tlpPerusahaan || purchaseOrder.perusahaan?.tlpPerusahaan || '-' }}
            </p>
            <p class="mb-0">
              Email: {{ purchaseOrder.perusahaan?.emailPerusahaan || purchaseOrder.perusahaan?.emailPerusahaan || '-' }}
            </p>
          </div>
        </div>
        
        <!-- Invoice Header - Right -->
        <div class="invoice-header text-end">
          <h2 class="mb-4 text-capitalize fw-bold">PURCHASE ORDER</h2>
          <table style="font-size: 12px; width: 100%;">
            <tr>
              <td style="text-align: right;">No. PO</td>
              <td style="width: 20px;">:</td>
              <td style="width: 50%;">{{ purchaseOrder.noPo }}</td>
            </tr>
            <tr>
              <td style="text-align: right;">Tanggal</td>
              <td style="width: 20px;">:</td>
              <td style="width: 50%;">{{ new Date(purchaseOrder.date).toLocaleDateString('id-ID') }}</td>
            </tr>
            <tr>
              <td style="text-align: right;">Term Of Payment</td>
              <td style="width: 20px;">:</td>
              <td style="width: 50%;">{{ purchaseOrder.termOfPayment || '30 Hari' }}</td>
            </tr>
          </table>
        </div>
      </div>

      <hr class="my-6" />

             <!-- vendor Information Section -->
       <div class="vendor-info-section mb-6">
         <div class="row">
           <div class="col-6">
             <table class="table table-borderless vendor-info-table" style="font-size: 12px;">
               <tr>
                 <td class="text-start" style="font-size: 12px; white-space: nowrap; width: 80px;">Vendor</td>
                 <td style="font-size: 12px; width: 10px; vertical-align: top;">:</td>
                 <td class="text-start" style="font-size: 12px;">{{ purchaseOrder.vendor?.name || purchaseOrder.salesOrder?.vendor?.name || '-' }}</td>
               </tr>
               <tr>
                 <td class="text-start" style="font-size: 12px; white-space: nowrap; vertical-align: top;">NPWP</td>
                 <td style="font-size: 12px; width: 10px; vertical-align: top;">:</td>
                 <td class="text-start" style="font-size: 12px;">{{ purchaseOrder.vendor?.npwp || purchaseOrder.salesOrder?.vendor?.npwp || '-' }}</td>
               </tr>
             </table>
           </div>
           <div class="col-6">
             <table class="table table-borderless vendor-info-table" style="font-size: 12px;">
               <tr>
                 <td class="text-start" style="font-size: 12px; vertical-align: top; white-space: nowrap; width: 80px;">Alamat</td>
                 <td style="font-size: 12px; width: 10px; vertical-align: top;">:</td>
                 <td class="text-start" style="font-size: 12px; white-space: pre-line;">{{ purchaseOrder.vendor?.address || purchaseOrder.salesOrder?.vendor?.address || '-' }}</td>
               </tr>
               <tr>
                 <td class="text-start" style="font-size: 12px; white-space: nowrap;">Attention</td>
                 <td style="font-size: 12px; width: 10px;">:</td>
                 <td class="text-start" style="font-size: 12px;">{{ purchaseOrder.up || '-' }}</td>
               </tr>
             </table>
           </div>
         </div>
       </div>

      <!-- ✅ INFO SECTION -->
      <div v-if="purchaseOrder.purchaseOrderItems && purchaseOrder.purchaseOrderItems.length > 0"
           class="alert alert-info d-flex align-items-center mb-4" role="alert">
        <i class="ri-information-line me-2"></i>
        <div>
          <strong>Purchase Order Items:</strong> Menampilkan {{ purchaseOrder.purchaseOrderItems.length }} item dari Purchase Order Items
        </div>
      </div>
      <div v-else
           class="alert alert-warning d-flex align-items-center mb-4" role="alert">
        <i class="ri-alert-line me-2"></i>
        <div>
          <strong>Tidak ada item:</strong> Tidak ada item Purchase Order yang dapat ditampilkan.
        </div>
      </div>

      <div class="table-responsive table-striped rounded mb-6">
        <table class="table m-0" style="font-size: 12px;">
          <thead class="table-dark table-head-white">
            <tr>
              <th>No</th>
              <th>Part Number</th>
              <th>Produk</th>
              <th>Deskripsi</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <!-- ✅ GUNAKAN SALES INVOICE ITEMS, bukan sales order items -->
            <tr v-for="(item, index) in purchaseOrder.purchaseOrderItems" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.product?.sku || '-' }}</td>
              <td>{{ item.product?.name || '-' }}</td>
              <td>{{ item.description || '-' }}</td>
              <td>{{ Number(item.quantity) }}</td>
              <td>{{ formatRupiah(item.price || 0) }}</td>
              <td>{{ formatRupiah(item.subtotal || 0) }}</td>
            </tr>
            <!-- ✅ FALLBACK: jika tidak ada salesInvoiceItems, tampilkan dari salesOrder -->
            <template v-if="(!purchaseOrder.purchaseOrderItems || purchaseOrder.purchaseOrderItems.length === 0)">
              <tr v-for="(item, index) in purchaseOrder.purchaseOrderItems" :key="`fallback-${item.id}`">
                <td>{{ index + 1 }}</td>
                <td>{{ item.product?.sku || '-' }}</td>
                <td>{{ item.product?.name || '-' }}</td>
                <td>{{ item.description || '-' }}</td>
                <td>{{ Number(item.quantity) }}</td>
              <td>{{ formatRupiah(item.price || 0) }}</td>
              <td>{{ formatRupiah(item.subtotal || 0) }}</td>
            </tr>
            </template>
            <!-- ✅ MESSAGE jika tidak ada items sama sekali -->
            <tr v-if="(!purchaseOrder.purchaseOrderItems || purchaseOrder.purchaseOrderItems.length === 0) && 
                      (!purchaseOrder.purchaseOrderItems || purchaseOrder.purchaseOrderItems.length === 0)">
              <td colspan="8" class="text-center py-4 text-muted">
                <em>Tidak ada item untuk ditampilkan</em>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="table-responsive table-striped">
        <table class="table mt-2 table-borderless" style="font-size: 12px;">
          <tbody>
            <tr v-if="purchaseOrder.description">
              <td colspan="2" class="px-0 pt-6 align-top" style="max-width: 320px; width: 320px; min-width: 220px;">
                <p class="mb-2">
                  <span class="fw-medium text-heading">Catatan:</span>
                </p>
                <p class="mb-0" style="white-space: pre-line; word-break: break-word; max-width: 320px;">
                  {{ purchaseOrder.description }}
                </p>
              </td>
              <td colspan="4" class="px-0 pt-6 align-top">
                <div class="d-flex flex-column align-items-end">
                  <div class="mb-2 d-flex" style="min-width: 270px;">
                    <span class="fw-medium text-heading" style="min-width: 90px;">Subtotal</span>
                    <span class="fw-medium text-heading px-2" style="min-width: 10px; text-align: right;">:</span>
                    <span class="fw-semibold text-end flex-grow-1">{{ formatRupiah(calculateSubtotal()) || 0 }}</span>
                  </div>
                  <div class="mb-2 d-flex" style="min-width: 270px;">
                    <span class="fw-medium text-heading" style="min-width: 90px;">
                      Discount
                      <span v-if="Number(purchaseOrder.discountPercent) > 0">({{ Number(purchaseOrder.discountPercent) }}%)</span>
                    </span>
                    <span class="fw-medium text-heading px-2" style="min-width: 10px; text-align: right;">:</span>
                    <span v-if="Number(purchaseOrder.discountPercent) > 0" class="fw-semibold text-end flex-grow-1">-{{ formatRupiah(calculateDiscount()) || 0 }}</span>
                    <span v-else class="fw-semibold text-end flex-grow-1">-</span>
                  </div>
                  <div class="mb-2 d-flex" style="min-width: 270px;">
                    <span class="fw-medium text-heading" style="min-width: 90px;">
                      Tax
                      <span v-if="Number(purchaseOrder.taxPercent) > 0">({{ Number(purchaseOrder.taxPercent) }}%)</span>
                    </span>
                    <span class="fw-medium text-heading px-2" style="min-width: 10px; text-align: right;">:</span>
                    <span v-if="Number(purchaseOrder.taxPercent) > 0" class="fw-semibold text-end flex-grow-1">{{ formatRupiah(calculateTax()) || 0 }}</span>
                    <span v-else class="fw-semibold text-end flex-grow-1">-</span>
                  </div>
                  <div class="fw-bold border-top border-dark pt-2 d-flex" style="min-width: 270px;">
                    <span class="fw-medium text-heading" style="min-width: 90px;">Total</span>
                    <span class="fw-medium text-heading px-2" style="min-width: 10px; text-align: right;">:</span>
                    <span class="fw-semibold text-end flex-grow-1">{{ formatRupiah(calculateGrandTotal()) || 0 }}</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="6" class="px-0 py-6">
                <div class="d-flex justify-content-between align-items-start" style="min-height: 120px;">
                  <!-- Left Column - Prepared By -->
                  <div class="text-center" style="width: 45%;">
                    <p class="mb-6 fw-medium text-heading" style="font-size: 12px;">
                      Prepared By:
                    </p>
                    <div class="mt-8 pt-6" style="border-top: 1px solid #000; display: inline-block; min-width: 150px;">
                      <p class="mb-0 fw-medium" style="font-size: 12px;">
                        {{
                          purchaseOrder.createdByUser.fullName
                            ? purchaseOrder.createdByUser.fullName
                            : '-'
                        }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Right Column - Date -->
                  <div class="text-center" style="width: 45%;">
                    <p class="mb-6 fw-medium text-heading" style="font-size: 12px;">
                      Approved By:
                    </p>
                    <div class="mt-8 pt-6" style="border-top: 1px solid #000; display: inline-block; min-width: 150px;">
                      <p class="mb-0 fw-medium" style="font-size: 12px;">
                        Ronal Aurora
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="alert alert-danger m-6" role="alert">
        Purchase Order tidak ditemukan.
    </div>
</template>

<script setup>
  definePageMeta({
    layout: 'cetak',
  })
  import { onMounted, computed } from 'vue';
  import { usePurchaseOrderStore } from '~/stores/purchaseOrder';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  import { useDynamicTitle } from '~/composables/useDynamicTitle'
  import { useImageUrl } from '~/composables/useImageUrl'
  
  // Composables
  const { setDetailTitle } = useDynamicTitle()
  const { getCompanyLogo, handleImageError } = useImageUrl()

  const config             = useRuntimeConfig();
  const purchaseOrderStore = usePurchaseOrderStore();
  const route              = useRoute();
  const formatRupiah       = useFormatRupiah();
  const toast              = useToast();

  const { purchaseOrder, loading, error } = storeToRefs(purchaseOrderStore);

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

  const calculateSubtotal = () => {
    if (!purchaseOrder.value) return 0;
    
    // ✅ PRIORITAS: Gunakan salesInvoiceItems jika ada
    if (purchaseOrder.value.purchaseOrderItems && purchaseOrder.value.purchaseOrderItems.length > 0) {
      return purchaseOrder.value.purchaseOrderItems.reduce((total, item) => {
        return total + (Number(item.subtotal) || 0);
      }, 0);
    }
    
    // ✅ FALLBACK: Gunakan salesOrderItems jika salesInvoiceItems tidak ada
    if (purchaseOrder.value.salesOrder?.salesOrderItems) {
      return purchaseOrder.value.salesOrder.salesOrderItems.reduce((total, item) => {
        return total + (Number(item.subtotal) || 0);
      }, 0);
    }
    
    return 0;
  };

  const calculateDiscount = () => {
    if (!purchaseOrder.value || !purchaseOrder.value.discountPercent) return 0;
    const subtotal = calculateSubtotal();
    return subtotal * (Number(purchaseOrder.value.discountPercent) / 100);
  };

  const calculateTax = () => {
    if (!purchaseOrder.value || !purchaseOrder.value.taxPercent) return 0;
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const afterDiscount = subtotal - discount;
    return afterDiscount * (Number(purchaseOrder.value.taxPercent) / 100);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  onMounted(async () => {
    const purchaseOrderId = route.query.id;
    if (purchaseOrderId) {
      try {
        await purchaseOrderStore.getPurchaseOrderDetails(purchaseOrderId);
        setDetailTitle('Purchase Order', purchaseOrder.value.noPo)
      } catch (e) {
        toast.error({
          title: 'Gagal!',
          icon: 'ri-close-line',
          message: e.message || 'Gagal memuat detail purchase order.',
          timeout: 3000,
          position: 'topRight',
          layout: 2,
        })
      }
    }
  });
</script>

<style>
  /* Custom styles for print */
  @media print {
    .no-print {
      display: none !important;
    }
    
    /* Hide alert info when printing */
    .alert {
      display: none !important;
    }
    
    /* Remove borders from customer info table */
    .table-borderless td, 
    .table-borderless th,
    .customer-info-table td,
    .customer-info-table th {
      border: none !important;
    }

    /* Remove borders from subtotal section */
    .table-borderless .d-flex {
      border: none !important;
    }

    /* Remove borders from catatan section */
    .table-borderless p {
      border: none !important;
    }

    /* Ensure only the main items table has borders */
    .table-responsive.border table td,
    .table-responsive.border table th {
      border: 1px solid #ddd !important;
    }

    /* Remove borders from all other tables */
    .table-responsive:not(.border) table td,
    .table-responsive:not(.border) table th,
    .summary-table td,
    .summary-table th {
      border: none !important;
    }

    /* Override the general table border rule for specific sections */
    .table-borderless,
    .table-borderless * {
      border: none !important;
    }

    /* Ensure proper layout in print */
    .logo-section,
    .invoice-header {
      max-width: 50% !important;
    }

    /* Signature section print styles */
    .d-flex.justify-content-between {
      page-break-inside: avoid !important;
      margin-top: 40px !important;
    }

    /* Ensure signature columns are properly spaced */
    .d-flex.justify-content-between > div {
      width: 45% !important;
      min-width: 200px !important;
    }

    /* Signature line styling for print */
    .d-flex.justify-content-between .border-top {
      border-top: 1px solid #000 !important;
      min-width: 150px !important;
    }

    /* Ensure proper font sizes in print */
    .d-flex.justify-content-between p {
      font-size: 12px !important;
      line-height: 1.4 !important;
    }

    /* Enhanced spacing for signature section in print */
    .d-flex.justify-content-between .mb-6 {
      margin-bottom: 2rem !important;
    }

    .d-flex.justify-content-between .mt-8 {
      margin-top: 3rem !important;
    }

    .d-flex.justify-content-between .pt-6 {
      padding-top: 2rem !important;
    }
  }
</style> 