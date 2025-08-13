<template>
    <div v-if="loading" class="text-center p-6">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger m-6">{{ error.message }}</div>
    <div v-else-if="salesInvoice" class="p-6">
      <div class="d-flex justify-content-between flex-row">
        <div v-if="salesInvoice.salesOrder?.perusahaan" class="w-60">
          <div class="d-flex svg-illustration align-items-center gap-2 mb-6">
            <span class="app-brand-logo demo">
              <img src="~/public/img/branding/andara.png" alt="logo" width="200">
            </span>
          </div>
          <h4 class="mb-2 text-primary text-nowrap">{{ salesInvoice.salesOrder.perusahaan.nmPerusahaan }}</h4>
          <p class="mb-1">{{ salesInvoice.salesOrder.perusahaan.alamatPerusahaan }}</p>
          <p class="mb-0">{{ salesInvoice.salesOrder.perusahaan.tlpPerusahaan }}</p>
          <p class="mb-0">{{ salesInvoice.salesOrder.perusahaan.emailPerusahaan }}</p>
        </div>
        <div class="w-40">
          <h5 class="mb-6 text-capitalize text-end">INVOICE NO: {{ salesInvoice.noInvoice }}</h5>
          <div style="margin-left: 100px;">
            <table class="table table-borderless" style="font-size: 12px; width: auto;">
              <tr>
                <td class="text-start" style="font-size: 12px; white-space: nowrap;">Customer</td>
                <td style="font-size: 12px; width: 10px; vertical-align: top;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ salesInvoice.customer?.name || salesInvoice.salesOrder?.customer?.name || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; white-space: nowrap; vertical-align: top;">Alamat</td>
                <td style="font-size: 12px; width: 10px; vertical-align: top;">:</td>
                <td class="text-start" style="font-size: 12px; white-space: pre-line;">{{ salesInvoice.customer?.address || salesInvoice.salesOrder?.customer?.address || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; white-space: nowrap;">NPWP</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ salesInvoice.customer?.npwp || salesInvoice.salesOrder?.customer?.npwp || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; white-space: nowrap;">Attention</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ salesInvoice.up || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; white-space: nowrap;">Order Number</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ salesInvoice.salesOrder?.noSo || '-' }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <hr class="my-6" />

      <!-- ✅ INFO SECTION -->
      <div v-if="salesInvoice.salesInvoiceItems && salesInvoice.salesInvoiceItems.length > 0" 
           class="alert alert-info d-flex align-items-center mb-4" role="alert">
        <i class="ri-information-line me-2"></i>
        <div>
          <strong>Invoice Items:</strong> Menampilkan {{ salesInvoice.salesInvoiceItems.length }} item dari Sales Invoice Items
        </div>
      </div>
      <div v-else-if="salesInvoice.salesOrder?.salesOrderItems && salesInvoice.salesOrder.salesOrderItems.length > 0" 
           class="alert alert-warning d-flex align-items-center mb-4" role="alert">
        <i class="ri-alert-line me-2"></i>
        <div>
          <strong>Fallback Mode:</strong> Menampilkan {{ salesInvoice.salesOrder.salesOrderItems.length }} item dari Sales Order (Invoice Items belum dibuat)
        </div>
      </div>

      <div class="table-responsive border border-bottom-0 rounded">
        <table class="table m-0" style="font-size: 12px;">
          <thead>
            <tr>
              <th>No</th>
              <th>Part Number</th>
              <th>Produk</th>
              <th>Deskripsi</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <!-- ✅ GUNAKAN SALES INVOICE ITEMS, bukan sales order items -->
            <tr v-for="(item, index) in salesInvoice.salesInvoiceItems" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.product?.sku || '-' }}</td>
              <td>{{ item.product?.name || '-' }}</td>
              <td>{{ item.description || '-' }}</td>
              <td>{{ Number(item.quantity) }}</td>
              <td>{{ formatRupiah(item.price || 0) }}</td>
              <td>{{ formatRupiah(item.subtotal || 0) }}</td>
            </tr>
            <!-- ✅ FALLBACK: jika tidak ada salesInvoiceItems, tampilkan dari salesOrder -->
            <template v-if="(!salesInvoice.salesInvoiceItems || salesInvoice.salesInvoiceItems.length === 0) && salesInvoice.salesOrder?.salesOrderItems">
              <tr v-for="(item, index) in salesInvoice.salesOrder.salesOrderItems" :key="`fallback-${item.id}`">
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
            <tr v-if="(!salesInvoice.salesInvoiceItems || salesInvoice.salesInvoiceItems.length === 0) && 
                      (!salesInvoice.salesOrder?.salesOrderItems || salesInvoice.salesOrder.salesOrderItems.length === 0)">
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
            <tr v-if="salesInvoice.description">
              <td colspan="2" class="px-0 pt-6 align-top" style="max-width: 320px; width: 320px; min-width: 220px;">
                <p class="mb-2">
                  <span class="fw-medium text-heading">Catatan:</span>
                </p>
                <p class="mb-0" style="white-space: pre-line; word-break: break-word; max-width: 320px; font-size: 12px;">
                  {{ salesInvoice.description }}
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
                    <span class="fw-medium text-heading" style="min-width: 110px; font-size: 12px;">DPP</span>
                    <span class="fw-medium text-heading px-2 text-end" style="width: 30px; display: inline-block; font-size: 12px;">:</span>
                    <span class="fw-semibold text-end flex-grow-1" style="min-width: 110px; font-size: 12px;">{{ formatRupiah(Number(salesInvoice.dpp) || 0) }}</span>
                  </div>
                  <div class="mb-2 d-flex justify-content-end" style="min-width: 320px; font-size: 12px;">
                    <span class="fw-medium text-heading" style="min-width: 110px; font-size: 12px;">
                      Discount
                      <span v-if="Number(salesInvoice.discountPercent) > 0" style="font-size: 12px;">({{ Number(salesInvoice.discountPercent) }}%)</span>
                    </span>
                    <span class="fw-medium text-heading px-2 text-end" style="width: 30px; display: inline-block; font-size: 12px;">:</span>
                    <span v-if="Number(salesInvoice.discountPercent) > 0" class="fw-semibold text-end flex-grow-1" style="min-width: 110px; font-size: 12px;">-{{ formatRupiah(calculateDiscount()) || 0 }}</span>
                    <span v-else class="fw-semibold text-end flex-grow-1" style="min-width: 110px; font-size: 12px;">-</span>
                  </div>
                  <div class="mb-2 d-flex justify-content-end" style="min-width: 320px; font-size: 12px;">
                    <span class="fw-medium text-heading" style="min-width: 110px; font-size: 12px;">
                      Tax
                      <span v-if="Number(salesInvoice.taxPercent) > 0" style="font-size: 12px;">({{ Number(salesInvoice.taxPercent) }}%)</span>
                    </span>
                    <span class="fw-medium text-heading px-2 text-end" style="width: 30px; display: inline-block; font-size: 12px;">:</span>
                    <span v-if="Number(salesInvoice.taxPercent) > 0" class="fw-semibold text-end flex-grow-1" style="min-width: 110px; font-size: 12px;">{{ formatRupiah(calculateTax()) || 0 }}</span>
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
              <td class="align-top px-0 py-6">
              </td>
              <td></td>
              <td></td>
              <td class="align-top px-0 py-6" colspan="2">
                <p class="mb-1 mt-5 text-center" style="font-size: 12px;">
                  <span class="fw-medium text-heading">
                    Jakarta, 
                    {{
                      salesInvoice.date
                        ? new Date(salesInvoice.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
                        : '-'
                    }}
                  </span>
                </p>
              </td>
            </tr>
            <tr>
              <td colspan="2"></td>
            </tr>
            <tr>
              <td colspan="2"></td>
            </tr>
            <tr>
              <td colspan="2"></td>
            </tr>
            <tr>
              <td colspan="2">
              </td>
              <td></td>
              <td colspan="4" class="text-center py-6 px-0" style="font-size: 12px;">
                Ronal Aurora
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="alert alert-danger m-6" role="alert">
      Sales Invoice tidak ditemukan.
    </div>
</template>

<script setup>
  definePageMeta({
    layout: 'cetak',
  })
  import { onMounted, computed } from 'vue';
  import { useSalesInvoiceStore } from '~/stores/sales-invoice';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  import Swal from 'sweetalert2';
  import { useDynamicTitle } from '~/composables/useDynamicTitle'

  // Composables
  const { setDetailTitle } = useDynamicTitle()

  const config = useRuntimeConfig();
  const salesInvoiceStore = useSalesInvoiceStore();
  const route = useRoute();
  const formatRupiah = useFormatRupiah();

  const { selectedSalesInvoice: salesInvoice, loading, error } = storeToRefs(salesInvoiceStore);

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
    if (!salesInvoice.value) return 0;
    
    // ✅ PRIORITAS: Gunakan salesInvoiceItems jika ada
    if (salesInvoice.value.salesInvoiceItems && salesInvoice.value.salesInvoiceItems.length > 0) {
      return salesInvoice.value.salesInvoiceItems.reduce((total, item) => {
        return total + (Number(item.subtotal) || 0);
      }, 0);
    }
    
    // ✅ FALLBACK: Gunakan salesOrderItems jika salesInvoiceItems tidak ada
    if (salesInvoice.value.salesOrder?.salesOrderItems) {
      return salesInvoice.value.salesOrder.salesOrderItems.reduce((total, item) => {
        return total + (Number(item.subtotal) || 0);
      }, 0);
    }
    
    return 0;
  };

  const calculateDiscount = () => {
    if (!salesInvoice.value || !salesInvoice.value.discountPercent) return 0;
    const subtotal = calculateSubtotal();
    return subtotal * (Number(salesInvoice.value.discountPercent) / 100);
  };

  const calculateTax = () => {
    if (!salesInvoice.value || !salesInvoice.value.taxPercent) return 0;
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const afterDiscount = subtotal - discount;
    return afterDiscount * (Number(salesInvoice.value.taxPercent) / 100);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  onMounted(async () => {
    const salesInvoiceId = route.query.id;
    if (salesInvoiceId) {
      try {
        await salesInvoiceStore.fetchSalesInvoiceById(salesInvoiceId);
        setDetailTitle('Sales Invoice', salesInvoice.value.noInvoice)
      } catch (e) {
        toast.fire('Error', e.message || 'Gagal memuat detail sales invoice.', 'error');
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