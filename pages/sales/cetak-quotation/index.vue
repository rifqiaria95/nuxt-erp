<template>
    <div v-if="loading" class="text-center p-6">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger m-6">{{ error.message }}</div>
    <div v-else-if="quotation" class="p-6">
      <div class="d-flex justify-content-between align-items-start align-content-center mb-6">
        <!-- Logo Section - Left -->
        <div v-if="quotation.perusahaan" class="logo-section">
          <div class="d-flex svg-illustration align-content-center gap-2 mb-4">
            <span class="app-brand-logo demo">
              <img src="~/public/img/branding/andara.png" alt="logo" width="250">
            </span>
          </div>
          <div class="text-start text-secondary-medium mt-6 mb-0" style="font-size: 12px; width: 220px; min-width: 220px;">
            <p class="mb-0">
              Alamat: {{ quotation.perusahaan?.alamatPerusahaan || quotation.perusahaan?.alamatPerusahaan || '-' }}
            </p>
            <p class="mb-0">
              Telepon: {{ quotation.perusahaan?.tlpPerusahaan || quotation.perusahaan?.tlpPerusahaan || '-' }}
            </p>
            <p class="mb-0">
              Email: {{ quotation.perusahaan?.emailPerusahaan || quotation.perusahaan?.emailPerusahaan || '-' }}
            </p>
          </div>
        </div>
        
        <!-- Invoice Header - Right -->
        <div class="invoice-header text-end">
          <h2 class="mb-4 text-capitalize fw-bold">QUOTATION</h2>
          <p class="mb-1" style="font-size: 12px;">No. Quotation: {{ quotation.noQuotation }}</p>
          <p class="mb-1" style="font-size: 12px;">Tanggal: {{ new Date(quotation.date).toLocaleDateString('id-ID') }}</p>
        </div>
      </div>

      <hr class="my-6" />

      <!-- ✅ INFO SECTION -->
      <div v-if="quotation.quotationItems && quotation.quotationItems.length > 0" 
           class="alert alert-info d-flex align-items-center mb-4" role="alert">
        <i class="ri-information-line me-2"></i>
        <div>
          <strong>Quotation Items:</strong> Menampilkan {{ quotation.quotationItems.length }} item dari Quotation Items
        </div>
      </div>
      <div class="table-responsive rounded border border-bottom-0 mb-6">
        <table class="table m-0" style="font-size: 12px; width: 100%;">
          <thead class="table-dark table-head-white">
            <tr>
              <th class="text-nowrap">Sales Person</th>
              <th class="text-nowrap">PR Number</th>
              <th class="text-nowrap">Ship Date</th>
              <th class="text-nowrap">FOB Point</th>
              <th class="text-nowrap">Terms of Payment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ quotation.createdByUser?.fullName || '-' }}</td>
              <td>{{ quotation.prNumber || '-' }}</td>
              <td>
                {{
                  quotation.shipDate
                    ? new Date(quotation.shipDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$1/$2/$3')
                    : '-'
                }}
              </td>
              <td>{{ quotation.fobPoint || '-' }}</td>
              <td>{{ quotation.termsOfPayment || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-responsive border border-bottom-0 rounded mt-3">
        <table class="table m-0 mb-6" style="font-size: 12px;">
          <thead class="table-dark table-head-white borderless">
            <tr>
              <th>No</th>
              <th>Part Number</th>
              <th>Product</th>
              <th>Remarks</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <!-- ✅ GUNAKAN SALES INVOICE ITEMS, bukan sales order items -->
            <tr v-for="(item, index) in quotation.quotationItems" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.product?.sku || '-' }}</td>
              <td>{{ item.product?.name || '-' }}</td> 
              <td>{{ item.description || '-' }}</td>
              <td>{{ Number(item.quantity) }}</td>
              <td class="text-nowrap">{{ formatRupiah(item.price || 0) }}</td>
              <td class="text-nowrap">{{ formatRupiah(item.subtotal || 0) }}</td>
            </tr>
            <!-- ✅ FALLBACK: jika tidak ada salesInvoiceItems, tampilkan dari salesOrder -->
            <template v-if="(!quotation.quotationItems || quotation.quotationItems.length === 0) && quotation.salesOrder?.salesOrderItems">
              <tr v-for="(item, index) in quotation.salesOrder.salesOrderItems" :key="`fallback-${item.id}`">
                <td>{{ index + 1 }}</td>
                <td>{{ item.product?.sku || '-' }}</td>
                <td>{{ item.product?.name || '-' }}</td>
                <td>{{ item.description || '-' }}</td>
                <td>{{ Number(item.quantity) }}</td>
                <td>{{ Number(item.deliveredQty || item.quantity) }}</td>
                <td class="text-nowrap">{{ formatRupiah(item.price || 0) }}</td>
                <td class="text-nowrap">{{ formatRupiah(item.subtotal || 0) }}</td>
              </tr>
            </template>
            <!-- ✅ MESSAGE jika tidak ada items sama sekali -->
            <tr v-if="(!quotation.quotationItems || quotation.quotationItems.length === 0) && 
                      (!quotation.salesOrder?.salesOrderItems || quotation.salesOrder.salesOrderItems.length === 0)">
              <td colspan="8" class="text-center py-4 text-muted">
                <em>Tidak ada item untuk ditampilkan</em>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="table-responsive">
        <table class="table mt-2 table-borderless" style="font-size: 12px;">
          <tbody>
            <tr>
              <td colspan="2" class="px-0 pt-6 align-top" style="max-width: 320px; width: 320px; min-width: 220px;">
                <p class="mb-2">
                  <span class="fw-medium text-heading">Catatan:</span>
                </p>
                <p class="mb-0" style="white-space: pre-line; word-break: break-word; max-width: 320px; font-size: 12px;">
                  {{ quotation.description && quotation.description.trim() !== '' ? quotation.description : '-' }}
                </p>
              </td>
              <td colspan="4" class="px-0 pt-6 align-top">
                <div class="d-flex flex-column align-items-end">
                  <div class="mb-2 d-flex justify-content-end" style="min-width: 320px; font-size: 12px;">
                    <span class="fw-medium text-heading" style="min-width: 110px; font-size: 12px;">Subtotal</span>
                    <span class="fw-medium text-heading px-2 text-end" style="width: 30px; display: inline-block; font-size: 12px;">:</span>
                    <span class="fw-semibold text-end flex-grow-1" style="min-width: 110px; font-size: 12px;">{{ formatRupiah(calculateSubtotal()) || 0 }}</span>
                  </div>
                  <div class="mb-2 d-flex justify-content-end" style="min-width: 320px; font-size: 12px;">
                    <span class="fw-medium text-heading" style="min-width: 110px; font-size: 12px;">
                      Discount
                      <span v-if="Number(quotation.discountPercent) > 0" style="font-size: 12px;">({{ Number(quotation.discountPercent) }}%)</span>
                    </span>
                    <span class="fw-medium text-heading px-2 text-end" style="width: 30px; display: inline-block; font-size: 12px;">:</span>
                    <span v-if="Number(quotation.discountPercent) > 0" class="fw-semibold text-end flex-grow-1" style="min-width: 110px; font-size: 12px;">-{{ formatRupiah(calculateDiscount()) || 0 }}</span>
                    <span v-else class="fw-semibold text-end flex-grow-1" style="min-width: 110px; font-size: 12px;">-</span>
                  </div>
                  <div class="mb-2 d-flex justify-content-end" style="min-width: 320px; font-size: 12px;">
                    <span class="fw-medium text-heading" style="min-width: 110px; font-size: 12px;">
                      PPN
                      <span v-if="Number(quotation.taxPercent) > 0" style="font-size: 12px;">({{ Number(quotation.taxPercent) }}%)</span>
                    </span>
                    <span class="fw-medium text-heading px-2 text-end" style="width: 30px; display: inline-block; font-size: 12px;">:</span>
                    <span v-if="Number(quotation.taxPercent) > 0" class="fw-semibold text-end flex-grow-1" style="min-width: 110px; font-size: 12px;">{{ formatRupiah(calculateTax()) || 0 }}</span>
                    <span v-else class="fw-semibold text-end flex-grow-1" style="min-width: 110px; font-size: 12px;">-</span>
                  </div>
                  <div class="fw-bold border-top border-dark pt-2 d-flex justify-content-end" style="min-width: 320px; font-size: 12px;">
                    <span class="fw-medium text-heading" style="min-width: 110px; font-size: 12px;">Total</span>
                    <span class="fw-medium text-heading px-2 text-end" style="width: 30px; display: inline-block; font-size: 12px;">:</span>
                    <span class="fw-semibold text-end flex-grow-1" style="min-width: 110px; font-size: 12px;">{{ formatRupiah(calculateGrandTotal()) || 0 }}</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="align-top px-0 py-3" colspan="3" style="width: 100%;">
                <p class="mb-1 mt-5 text-center text-secondary" style="font-size: 12px;">
                  <span class="fw-medium text-heading">
                    If you have any questions concerning this quotation, please contact us at: sales@andara.co.id
                  </span>
                </p>
                <p class="mb-1 mt-5 text-center text-secondary" style="font-size: 12px;">
                    <strong>Thank you for your business</strong>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="alert alert-danger m-6" role="alert">
      Quotation tidak ditemukan.
    </div>
</template>

<script setup>
  definePageMeta({
    layout: 'cetak'
  })
  import { onMounted, computed } from 'vue';
  import { useQuotationStore } from '~/stores/quotation';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  import Swal from 'sweetalert2';
  import { useDynamicTitle } from '~/composables/useDynamicTitle'

  // Composables
  const { setDetailTitle } = useDynamicTitle()

  const config = useRuntimeConfig();
  const quotationStore = useQuotationStore();
  const route = useRoute();
  const formatRupiah = useFormatRupiah();

  const { quotation, loading, error } = storeToRefs(quotationStore);

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
    if (!quotation.value) return 0;
    
    // ✅ PRIORITAS: Gunakan salesInvoiceItems jika ada
    if (quotation.value.quotationItems && quotation.value.quotationItems.length > 0) {
      return quotation.value.quotationItems.reduce((total, item) => {
        return total + (Number(item.subtotal) || 0);
      }, 0);
    }
    
    // ✅ FALLBACK: Gunakan salesOrderItems jika salesInvoiceItems tidak ada
    if (quotation.value.salesOrder?.salesOrderItems) {
      return quotation.value.salesOrder.salesOrderItems.reduce((total, item) => {
        return total + (Number(item.subtotal) || 0);
      }, 0);
    }
    
    return 0;
  };

  const calculateDiscount = () => {
    if (!quotation.value || !quotation.value.discountPercent) return 0;
    const subtotal = calculateSubtotal();
    return subtotal * (Number(quotation.value.discountPercent) / 100);
  };

  const calculateTax = () => {
    if (!quotation.value || !quotation.value.taxPercent) return 0;
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const afterDiscount = subtotal - discount;
    return afterDiscount * (Number(quotation.value.taxPercent) / 100);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  onMounted(async () => {
    const quotationId = route.query.id;
    if (quotationId) {
      try {
        await quotationStore.getQuotationDetails(quotationId);
        setDetailTitle('Cetak Quotation - ' + quotation.value.noQuotation)
      } catch (e) {
        toast.fire('Error', e.message || 'Gagal memuat detail quotation.', 'error');
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
  }
</style> 