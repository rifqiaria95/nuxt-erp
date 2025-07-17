<template>
    <div v-if="loading" class="text-center p-6">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger m-6">{{ error.message }}</div>
    <div v-else-if="salesOrder" class="p-6">
      <div class="d-flex justify-content-between flex-row">
         <div v-if="salesOrder.perusahaan">
          <div class="d-flex svg-illustration align-items-center gap-2 mb-6">
            <span class="app-brand-logo demo">
               <img v-if="salesOrder.perusahaan.logoPerusahaan"
               :src="getLogoUrl(salesOrder.perusahaan.logoPerusahaan)"
               alt="Logo Perusahaan"
               style="width: 200px;">
            </span>
          </div>
          <h5 class="mb-2 text-primary fw-bold">{{ salesOrder.perusahaan.nmPerusahaan }}</h5>
          <p class="mb-1">{{ salesOrder.perusahaan.alamatPerusahaan }}</p>
          <p class="mb-0">{{ salesOrder.perusahaan.tlpPerusahaan }}</p>
          <p class="mb-0">{{ salesOrder.perusahaan.emailPerusahaan }}</p>
        </div>
        <div>
          <h6 class="mb-6 text-capitalize text-end fw-bold">PURCHASE ORDER #{{ salesOrder.noPo }}</h6>
          <div style="margin-left: 32px;">
            <table class="table table-borderless" style="font-size: 12px; width: auto;">
              <tr>
                <td class="text-start" style="font-size: 12px; padding-right: 60px; white-space: nowrap;">Supplier/Vendor</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ salesOrder.customer?.name || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; padding-right: 60px; white-space: nowrap;">Address</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ salesOrder.customer?.address || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; padding-right: 60px; white-space: nowrap;">NPWP</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ salesOrder.customer?.npwp || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; padding-right: 60px; white-space: nowrap;">Email</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ salesOrder.customer?.email || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; padding-right: 60px; white-space: nowrap;">Phone</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ salesOrder.customer?.phone || '-' }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <hr class="my-6" />

      <!-- ✅ INFO SECTION -->
      <div v-if="salesOrder.salesOrderItems && salesOrder.salesOrderItems.length > 0" 
           class="alert alert-info d-flex align-items-center mb-4" role="alert">
        <i class="ri-information-line me-2"></i>
        <div>
          <strong>Sales Order Items:</strong> Menampilkan {{ salesOrder.salesOrderItems.length }} item dari Sales Order Items
        </div>
      </div>
      <div v-else-if="salesOrder.salesOrderItems && salesOrder.salesOrderItems.length > 0" 
           class="alert alert-warning d-flex align-items-center mb-4" role="alert">
        <i class="ri-alert-line me-2"></i>
        <div>
          <strong>Fallback Mode:</strong> Menampilkan {{ salesOrder.salesOrderItems.length }} item dari Sales Order Items
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
            <tr v-for="(item, index) in salesOrder.salesOrderItems" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.product?.sku || '-' }}</td>
              <td>{{ item.product?.name || '-' }}</td>
              <td>{{ item.description || '-' }}</td>
              <td>{{ Number(item.quantity) }}</td>
              <td>{{ formatRupiah(item.price || 0) }}</td>
              <td>{{ formatRupiah(item.subtotal || 0) }}</td>
            </tr>
            <!-- ✅ FALLBACK: jika tidak ada salesInvoiceItems, tampilkan dari salesOrder -->
            <template v-if="(!salesOrder.salesOrderItems || salesOrder.salesOrderItems.length === 0)">
              <tr v-for="(item, index) in salesOrder.salesOrderItems" :key="`fallback-${item.id}`">
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
            <tr v-if="(!salesOrder.salesOrderItems || salesOrder.salesOrderItems.length === 0) && 
                      (!salesOrder.salesOrderItems || salesOrder.salesOrderItems.length === 0)">
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
            <tr v-if="salesOrder.description">
              <td colspan="2" class="px-0 pt-6 align-top" style="max-width: 320px; width: 320px; min-width: 220px;">
                <p class="mb-2">
                  <span class="fw-medium text-heading">Catatan:</span>
                </p>
                <p class="mb-0" style="white-space: pre-line; word-break: break-word; max-width: 320px;">
                  {{ salesOrder.description }}
                </p>
              </td>
              <td colspan="4" class="px-0 pt-6 align-top">
                <div class="d-flex flex-column align-items-end">
                  <div class="mb-2">
                    <span class="fw-medium text-heading">Subtotal: </span>
                    <span class="fw-semibold">{{ formatRupiah(calculateSubtotal()) || 0 }}</span>
                  </div>
                  <div class="mb-2">
                    <span class="fw-medium text-heading">
                      Discount ({{ Number(salesOrder.discountPercent) }}%):
                    </span>
                    <span v-if="Number(salesOrder.discountPercent) > 0" class="fw-semibold">-{{ formatRupiah(calculateDiscount()) || 0 }}</span>
                  </div>
                  <div class="mb-2">
                    <span class="fw-medium text-heading">
                      Tax ({{ Number(salesOrder.taxPercent) }}%):
                    </span>
                    <span v-if="Number(salesOrder.taxPercent) > 0" class="fw-semibold">{{ formatRupiah(calculateTax()) || 0 }}</span>
                  </div>
                  <div class="fw-bold border-top border-dark pt-2">
                    <span class="fw-medium text-heading">Total: </span>
                    <span class="fw-semibold">{{ formatRupiah(calculateGrandTotal()) || 0 }}</span>
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
                      salesOrder.date
                        ? new Date(salesOrder.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
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
              <td colspan="4" class="text-center py-6 px-0">
                Ronal Aurora
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="alert alert-danger m-6" role="alert">
        Sales Order tidak ditemukan.
    </div>
</template>

<script setup>
  definePageMeta({
    layout: 'cetak',
  })
  import { onMounted, computed } from 'vue';
  import { useSalesOrderStore } from '~/stores/sales-order';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  
  const config          = useRuntimeConfig();
  const salesOrderStore = useSalesOrderStore();
  const route           = useRoute();
  const formatRupiah    = useFormatRupiah();
  const toast           = useToast();

  const { salesOrder, loading, error } = storeToRefs(salesOrderStore);

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
    if (!salesOrder.value) return 0;
    
    // ✅ PRIORITAS: Gunakan salesInvoiceItems jika ada
    if (salesOrder.value.salesOrderItems && salesOrder.value.salesOrderItems.length > 0) {
      return salesOrder.value.salesOrderItems.reduce((total, item) => {
        return total + (Number(item.subtotal) || 0);
      }, 0);
    }
    
    // ✅ FALLBACK: Gunakan salesOrderItems jika salesInvoiceItems tidak ada
    if (salesOrder.value.salesOrderItems) {
      return salesOrder.value.salesOrderItems.reduce((total, item) => {
        return total + (Number(item.subtotal) || 0);
      }, 0);
    }
    
    return 0;
  };

  const calculateDiscount = () => {
    if (!salesOrder.value || !salesOrder.value.discountPercent) return 0;
    const subtotal = calculateSubtotal();
    return subtotal * (Number(salesOrder.value.discountPercent) / 100);
  };

  const calculateTax = () => {
    if (!salesOrder.value || !salesOrder.value.taxPercent) return 0;
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const afterDiscount = subtotal - discount;
    return afterDiscount * (Number(salesOrder.value.taxPercent) / 100);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  onMounted(async () => {
    const salesOrderId = route.query.id;
    if (salesOrderId) {
      try {
        await salesOrderStore.getSalesOrderSuratJalan(salesOrderId);
        
        // ✅ DEBUG: Log data untuk memastikan salesOrderItems dimuat
        console.log('🔍 Print Invoice Debug - Sales Order Data:', salesOrder.value);
        console.log('🔍 Print Invoice Debug - Sales Order Items:', salesOrder.value?.salesOrderItems);
        console.log('🔍 Print Invoice Debug - Items Count:', salesOrder.value?.salesOrderItems?.length || 0);
      } catch (e) {
        toast.error({
          title: 'Gagal!',
          icon: 'ri-close-line',
          message: e.message || 'Gagal memuat detail sales order.',
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