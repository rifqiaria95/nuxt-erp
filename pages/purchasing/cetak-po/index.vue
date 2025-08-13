<template>
    <div v-if="loading" class="text-center p-6">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger m-6">{{ error.message }}</div>
    <div v-else-if="purchaseOrder" class="p-6">
      <div class="d-flex justify-content-between flex-row">
         <div v-if="purchaseOrder.perusahaan" class="w-60">
          <div class="d-flex svg-illustration align-items-center gap-2 mb-6">
            <span class="app-brand-logo demo">
              <img src="~/public/img/branding/andara.png" alt="logo" width="200">
            </span>
          </div>
          <h5 class="mb-2 text-primary fw-bold">{{ purchaseOrder.perusahaan.nmPerusahaan }}</h5>
          <p class="mb-1">{{ purchaseOrder.perusahaan.alamatPerusahaan }}</p>
          <p class="mb-0">{{ purchaseOrder.perusahaan.tlpPerusahaan }}</p>
          <p class="mb-0">{{ purchaseOrder.perusahaan.emailPerusahaan }}</p>
        </div>
        <div class="w-40">
          <h6 class="mb-6 text-capitalize text-end fw-bold">PURCHASE ORDER NUMBER: {{ purchaseOrder.noPo }}</h6>
          <div class="d-flex justify-content-end">
            <table class="table table-borderless" style="font-size: 12px; width: auto;">
              <tr>
                <td class="text-start" style="font-size: 12px; min-width: 110px; white-space: nowrap;">Supplier/Vendor</td>
                <td class="text-start" style="font-size: 12px; min-width: 12px; padding: 0 8px 0 0; text-align: left;">:</td>
                <td class="text-end" style="font-size: 12px; white-space: pre-line;">{{ purchaseOrder.vendor?.name || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; min-width: 110px; white-space: nowrap;">Address</td>
                <td class="text-start" style="font-size: 12px; min-width: 12px; padding: 0 8px 0 0; text-align: left;">:</td>
                <td class="text-end" style="font-size: 12px; white-space: pre-line;">{{ purchaseOrder.vendor?.address || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; min-width: 110px; white-space: nowrap;">NPWP</td>
                <td class="text-start" style="font-size: 12px; min-width: 12px; padding: 0 8px 0 0; text-align: left;">:</td>
                <td class="text-end" style="font-size: 12px; white-space: pre-line;">{{ purchaseOrder.vendor?.npwp || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; min-width: 110px; white-space: nowrap;">Email</td>
                <td class="text-start" style="font-size: 12px; min-width: 12px; padding: 0 8px 0 0; text-align: left;">:</td>
                <td class="text-end" style="font-size: 12px; white-space: pre-line;">{{ purchaseOrder.vendor?.email || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; min-width: 110px; white-space: nowrap;">Phone</td>
                <td class="text-start" style="font-size: 12px; min-width: 12px; padding: 0 8px 0 0; text-align: left;">:</td>
                <td class="text-end" style="font-size: 12px; white-space: pre-line;">{{ purchaseOrder.vendor?.phone || '-' }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <hr class="my-6" />

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
      
      <div class="table-responsive">
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
              <td class="align-top px-0 py-6">
              </td>
              <td></td>
              <td></td>
              <td class="align-top px-0 py-6" colspan="2">
                <p class="mb-1 mt-5 text-center">
                  <span class="fw-medium text-heading">
                    Jakarta, 
                    {{
                      purchaseOrder.date
                        ? new Date(purchaseOrder.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
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
              <td colspan="2">
              </td>
              <td></td>
              <td colspan="4" class="text-center py-6 px-0">
                Ronal Aurora
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

  // Composables
  const { setDetailTitle } = useDynamicTitle()

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
  }
</style> 