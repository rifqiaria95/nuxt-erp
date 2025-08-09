<template>
    <div v-if="loading" class="text-center p-6">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger m-6">{{ error.message }}</div>
    <div v-else-if="suratJalan" class="p-6">
      <div class="d-flex justify-content-between flex-row">
        <div v-if="suratJalan.salesOrder.perusahaan" class="w-60">
          <div class="d-flex svg-illustration align-items-center gap-2 mb-6">
            <span class="app-brand-logo demo">
               <img v-if="suratJalan.salesOrder.perusahaan.logoPerusahaan"
               :src="getLogoUrl(suratJalan.salesOrder.perusahaan.logoPerusahaan)"
               alt="Logo Perusahaan"
               style="width: 200px;">
            </span>
          </div>
          <h5 class="mb-2 text-primary fw-bold text-nowrap">{{ suratJalan.salesOrder.perusahaan.nmPerusahaan }}</h5>
          <p class="mb-1">{{ suratJalan.salesOrder.perusahaan.alamatPerusahaan }}</p>
          <p class="mb-0">{{ suratJalan.salesOrder.perusahaan.tlpPerusahaan }}</p>
          <p class="mb-0">{{ suratJalan.salesOrder.perusahaan.emailPerusahaan }}</p>
        </div>
        <div class="w-40">
          <h6 class="mb-2 text-capitalize text-end fw-bold">SURAT JALAN #{{ suratJalan.noSuratJalan }}</h6>
          <p class="text-end mb-6" style="font-size: 14px;"> Tanggal:
            {{ suratJalan.createdAt ? new Date(suratJalan.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' }}
          </p>
          <!-- Geser tabel info customer ke kanan dengan margin-left lebih besar -->
          <div style="margin-left: 100px;">
            <table class="table table-borderless" style="font-size: 12px; width: auto;">
              <tr>
                <td class="text-start" style="font-size: 12px; padding-right: 60px; white-space: nowrap;">Kepada Yth</td>
                <td style="font-size: 12px; width: 10px; vertical-align: top;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ suratJalan.customer?.name || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; padding-right: 60px; white-space: nowrap; vertical-align: top;">Alamat</td>
                <td style="font-size: 12px; width: 10px; vertical-align: top;">:</td>
                <td class="text-start" style="font-size: 12px; white-space: pre-line;">{{ suratJalan.alamatPengiriman || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; padding-right: 60px; white-space: nowrap;">U.P</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ suratJalan.picName || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; padding-right: 60px; white-space: nowrap;">No. Telp</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ suratJalan.customer?.phone || '-' }}</td>
              </tr>
              <tr>
                <td class="text-start" style="font-size: 12px; padding-right: 60px; white-space: nowrap;">No. PO</td>
                <td style="font-size: 12px; width: 10px;">:</td>
                <td class="text-start" style="font-size: 12px;">{{ suratJalan.salesOrder?.noPo || '-' }}</td>
              </tr>
            </table>
          </div>
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

      <div class="table-responsive border border-bottom-0 rounded">
        <table class="table m-0" style="font-size: 12px;">
          <thead>
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
                    {{ suratJalan.picName || '-' }}
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
        
        // ✅ DEBUG: Log data untuk memastikan suratJalanItems dimuat
        console.log('🔍 Print Invoice Debug - Surat Jalan Data:', suratJalan.value);
        console.log('🔍 Print Invoice Debug - Surat Jalan Items:', suratJalan.value?.suratJalanItems);
        console.log('🔍 Print Invoice Debug - Items Count:', suratJalan.value?.suratJalanItems?.length || 0);
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