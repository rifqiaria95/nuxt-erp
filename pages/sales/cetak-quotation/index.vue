<template>
    <div v-if="loading" class="text-center p-6">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger m-6">{{ error.message }}</div>
    <div v-else-if="quotation" class="p-6">
      <div class="d-flex justify-content-between flex-row">
        <div v-if="quotation.perusahaan" class="w-60">
          <div class="d-flex svg-illustration align-items-center gap-2 mb-6">
            <span class="app-brand-logo demo">
               <img v-if="quotation.perusahaan.logoPerusahaan"
               :src="getLogoUrl(quotation.perusahaan.logoPerusahaan)"
               alt="Logo Perusahaan"
               style="width: 200px;">
            </span>
          </div>
          <h4 class="mb-2 text-primary text-nowrap">{{ quotation.perusahaan.nmPerusahaan }}</h4>
          <p class="mb-1">{{ quotation.perusahaan.alamatPerusahaan }}</p>
          <p class="mb-0">{{ quotation.perusahaan.tlpPerusahaan }}</p>
          <p class="mb-0">{{ quotation.perusahaan.emailPerusahaan }}</p>
        </div>
        <div class="w-40">
          <h5 class="mb-6 text-capitalize text-end">QUOTATION #{{ quotation.noQuotation }}</h5>
          <div style="margin-left: 100px;">
            <table class="table table-borderless" style="font-size: 12px; width: auto;">
              <tr>
                <td class="text-start" style="font-size: 12px; white-space: nowrap;">Customer</td>
                <td style="font-size: 12px; width: 10px; vertical-align: top;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ quotation.customer?.name || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; white-space: nowrap; vertical-align: top;">Alamat</td>
                <td style="font-size: 12px; width: 10px; vertical-align: top;">:</td>
                <td class="text-start" style="font-size: 12px; white-space: pre-line;">{{ quotation.customer?.address || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; white-space: nowrap;">NPWP</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ quotation.customer?.npwp || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; white-space: nowrap;">Email</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ quotation.customer?.email || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; white-space: nowrap;">No. Telp</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ quotation.customer?.phone || '-' }}</td>
              </tr>
            </table>
          </div>
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
      <div class="table-responsive border border-bottom-0 mb-5">
        <table class="table m-0" style="font-size: 12px; width: 100%;">
          <thead>
            <tr>
              <th>Sales Person</th>
              <th>PR Number</th>
              <th>Ship Date</th>
              <th>FOB Point</th>
              <th>Terms of Payment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ quotation.createdByUser?.fullName || '-' }}</td>
              <td>{{ quotation.prNumber || '-' }}</td>
              <td>{{ quotation.shipDate || '-' }}</td>
              <td>{{ quotation.fobPoint || '-' }}</td>
              <td>{{ quotation.termsOfPayment || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-responsive border border-bottom-0 rounded">
        <table class="table m-0" style="font-size: 12px;">
          <thead>
            <tr>
              <th>No</th>
              <th>Part Number</th>
              <th>Product</th>
              <th>Description</th>
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
              <td>{{ formatRupiah(item.price || 0) }}</td>
              <td>{{ formatRupiah(item.subtotal || 0) }}</td>
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
              <td>{{ formatRupiah(item.price || 0) }}</td>
              <td>{{ formatRupiah(item.subtotal || 0) }}</td>
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
            <tr v-if="quotation.description">
              <td colspan="2" class="px-0 pt-6 align-top" style="max-width: 320px; width: 320px; min-width: 220px;">
                <p class="mb-2">
                  <span class="fw-medium text-heading">Catatan:</span>
                </p>
                <p class="mb-0" style="white-space: pre-line; word-break: break-word; max-width: 320px; font-size: 12px;">
                  {{ quotation.description }}
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
                      Tax
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
    layout: 'cetak',
  })
  import { onMounted, computed } from 'vue';
  import { useQuotationStore } from '~/stores/quotation';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  import Swal from 'sweetalert2';
  
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
        
        // ✅ DEBUG: Log data untuk memastikan salesInvoiceItems dimuat
        console.log('🔍 Print Quotation Debug - Quotation Data:', quotation.value);
        console.log('🔍 Print Quotation Debug - Quotation Items:', quotation.value?.quotationItems);
        console.log('🔍 Print Quotation Debug - Items Count:', quotation.value?.quotationItems?.length || 0);
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
  }
</style> 