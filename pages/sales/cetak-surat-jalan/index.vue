<template>
    <div v-if="loading" class="text-center p-6">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger m-6">{{ error.message }}</div>
    <div v-else-if="suratJalan" class="p-6">
      <div class="d-flex justify-content-between align-items-start align-content-center mb-6">
        <!-- Logo Section - Left -->
        <div v-if="suratJalan.salesOrder.perusahaan" class="logo-section">
          <div class="d-flex svg-illustration align-content-center gap-2 mb-4">
            <span class="app-brand-logo demo">
              <img src="~/public/img/branding/andara.png" alt="logo" width="250">
            </span>
          </div>
          <div class="text-start text-secondary-medium mt-6 mb-0" style="font-size: 12px; width: 220px; min-width: 220px;">
            <p class="mb-0">
              Alamat: {{ suratJalan.salesOrder.perusahaan?.alamatPerusahaan || suratJalan.salesOrder.perusahaan?.alamatPerusahaan || '-' }}
            </p>
            <p class="mb-0">
              Telepon: {{ suratJalan.salesOrder.perusahaan?.tlpPerusahaan || suratJalan.salesOrder.perusahaan?.tlpPerusahaan || '-' }}
            </p>
            <p class="mb-0">
              Email: {{ suratJalan.salesOrder.perusahaan?.emailPerusahaan || suratJalan.salesOrder.perusahaan?.emailPerusahaan || '-' }}
            </p>
          </div>
        </div>
        
        <!-- Invoice Header - Right -->
        <div class="invoice-header text-end">
          <h2 class="mb-4 text-capitalize fw-bold">SURAT JALAN</h2>
          <table style="font-size: 12px; width: 100%;">
            <tr>
              <td style="text-align: right;">No. Surat Jalan</td>
              <td style="width: 20px;">:</td>
              <td style="width: 40%;">{{ suratJalan.noSuratJalan }}</td>
            </tr>
            <tr>
              <td style="text-align: right;">Tanggal</td>
              <td style="width: 20px;">:</td>
              <td style="width: 40%;">{{ new Date(suratJalan.date).toLocaleDateString('id-ID') }}</td>
            </tr>
            <tr>
              <td style="text-align: right;">No. Purchase Order</td>
              <td style="width: 20px;">:</td>
              <td style="width: 40%;">{{ suratJalan.salesOrder.noPo || '-' }}</td>
            </tr>
          </table>
        </div>
      </div>

      <hr class="my-6" />

      <!-- ✅ INFO SECTION -->
      <div v-if="suratJalan.suratJalanItems && suratJalan.suratJalanItems.length > 0" 
           class="alert alert-info d-flex align-items-center mb-4" role="alert">
        <i class="ri-information-line me-2"></i>
        <div>
          <strong>Surat Jalan Items:</strong> Menampilkan {{ suratJalan.suratJalanItems.filter(item => item.statusPartial === true).length }} item dari Surat Jalan Items (status partial)
        </div>
      </div>

      <div class="table-responsive table-striped rounded">
        <table class="table m-0" style="font-size: 12px;">
          <thead class="table-dark table-head-white borderless">
            <tr>
              <th>No</th>
              <th>Part Number</th>
              <th>Produk</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            <!-- ✅ GUNAKAN SALES ORDER ITEMS dengan filter statusPartial = true -->
            <tr v-for="(item, index) in suratJalan.suratJalanItems.filter(item => item.salesOrderItem?.statusPartial === true)" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td class="text-nowrap text-heading">{{ item.product?.sku || 'Part Number' }}</td>
              <td class="text-nowrap text-heading">{{ item.product?.name || 'Product Name' }}</td>
              <td class="text-nowrap">{{ item.quantity || '0' }}</td>
            </tr>
            <!-- ✅ MESSAGE jika tidak ada items sama sekali -->
            <tr v-if="!suratJalan.suratJalanItems || suratJalan.suratJalanItems.filter(item => item.salesOrderItem?.statusPartial === true).length === 0">
              <td colspan="8" class="text-center py-4 text-muted">
                <em>Tidak ada item dengan status partial untuk ditampilkan</em>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="table-responsive">
        <table class="table mt-2 table-borderless" style="font-size: 12px;">
          <tbody>
            <tr v-if="suratJalan.description">
              <td colspan="2" class="px-0 pt-6 align-top" style="max-width: 320px; width: 320px; min-width: 220px;">
                <p class="mb-2">
                  <span class="fw-medium text-heading">Catatan:</span>
                </p>
                <p class="mb-0" style="white-space: pre-line; word-break: break-word; max-width: 320px;">
                  {{ suratJalan.description }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="align-top py-6" style="width: 20%; min-width: 200px;">
                <div class="d-flex flex-column align-items-center justify-content-center h-100" style="margin-left: 24px;">
                  <p class="mb-1 mt-5 text-start">
                    <span class="fw-medium text-heading">
                      Yang menerima:
                    </span>
                  </p>
                  <p class="mt-10 text-start pt-10">
                    ....................
                  </p>
                </div>
              </td>
              <td style="width: 80%;"></td>
              <td class="align-top py-6" style="width: 20%; min-width: 200px;">
                <div class="d-flex flex-column align-items-center justify-content-center h-100" style="margin-right: 24px;">
                  <p class="mb-1 mt-5 text-end">
                    <span class="fw-medium text-heading">
                      Yang menyerahkan:
                    </span>
                  </p>
                  <p class="mt-10 text-end pt-10">
                    {{ suratJalan.createdByUser?.fullName || '-' }}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="alert alert-danger m-6" role="alert">
        Surat Jalan tidak ditemukan.
    </div>
</template>

<script setup>
  definePageMeta({
    layout: 'cetak',
  })
  import { onMounted, computed } from 'vue';
  import { useSuratJalanStore } from '~/stores/surat-jalan';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  import { useDynamicTitle } from '~/composables/useDynamicTitle'
  
  // Composables
  const { setDetailTitle } = useDynamicTitle()

  const config          = useRuntimeConfig();
  const suratJalanStore = useSuratJalanStore();
  const route           = useRoute();
  const formatRupiah    = useFormatRupiah();
  const toast           = useToast();

  const { suratJalan, loading, error } = storeToRefs(suratJalanStore);

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

  onMounted(async () => {
    const suratJalanId = route.query.id;
    if (suratJalanId) {
      try {
        await suratJalanStore.fetchSuratJalanDetailWithItems(suratJalanId);
        setDetailTitle('Surat Jalan', suratJalan.value.noSuratJalan)
      } catch (e) {
        toast.fire('Error', e.message || 'Gagal memuat detail surat jalan.', 'error');
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