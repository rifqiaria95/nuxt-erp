<template>
    <div v-if="loading" class="text-center p-6">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger m-6">{{ error.message }}</div>
    <div v-else-if="stockTransfer" class="p-6">
      <div class="d-flex justify-content-between align-items-start align-content-center mb-6">
        <!-- Logo Section - Left -->
        <div v-if="stockTransfer.perusahaan" class="logo-section">
          <div class="d-flex svg-illustration align-content-center gap-2 mb-4">
            <span class="app-brand-logo demo">
              <img src="~/public/img/branding/andara.png" alt="logo" width="250">
            </span>
          </div>
          <div class="text-start text-secondary-medium mt-6 mb-0" style="font-size: 12px; width: 220px; min-width: 220px;">
            <p class="mb-0">
              Alamat: {{ stockTransfer.perusahaan?.alamatPerusahaan || stockTransfer.perusahaan?.alamatPerusahaan || '-' }}
            </p>
            <p class="mb-0">
              Telepon: {{ stockTransfer.perusahaan?.tlpPerusahaan || stockTransfer.perusahaan?.tlpPerusahaan || '-' }}
            </p>
            <p class="mb-0">
              Email: {{ stockTransfer.perusahaan?.emailPerusahaan || stockTransfer.perusahaan?.emailPerusahaan || '-' }}
            </p>
          </div>
        </div>
        
        <!-- Invoice Header - Right -->
        <div class="invoice-header text-end">
          <h2 class="mb-4 text-capitalize fw-bold">STOCK TRANSFER</h2>
          <p class="mb-1" style="font-size: 12px;">No. Stock Transfer: {{ stockTransfer.noTransfer }}</p>
          <p class="mb-1" style="font-size: 12px;">Tanggal: {{ new Date(stockTransfer.date).toLocaleDateString('id-ID') }}</p>
        </div>
      </div>

      <hr class="my-6" />

      <div class="d-flex justify-content-between mb-6">
        <div class="col-3">
          <h5><strong>Gudang Asal:</strong></h5>
          <p class="mb-1 fw-semibold" style="font-size: 12px;">{{ stockTransfer.fromWarehouse?.name }}</p>
          <p class="mb-0" style="font-size: 12px;">{{ stockTransfer.fromWarehouse?.address }}</p>
        </div>
        <div class="text-end col-3">
          <h5><strong>Gudang Tujuan:</strong></h5>
          <p class="mb-1 fw-semibold" style="font-size: 12px;">{{ stockTransfer.toWarehouse?.name }}</p>
          <p class="mb-0" style="font-size: 12px;">{{ stockTransfer.toWarehouse?.address }}</p>
        </div>
      </div>

      <div class="table-responsive border border-bottom-0 rounded">
        <table class="table m-0">
          <thead class="table-dark table-head-white">
            <tr>
              <th>No</th>
              <th>Produk</th>
              <th>Jumlah</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in stockTransfer.stockTransferDetails" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.product?.name }}</td>
              <td>{{ item.quantity }} {{ item.product?.unit?.name }}</td>
              <td>{{ item.description || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-responsive">
        <table class="table m-0 table-borderless">
          <tbody>
            <tr>
              <td class="align-top px-0 py-6">
                <p class="mb-1 mt-5">
                  <span class="me-2 fw-medium text-heading">TTD Pengirim</span>
                </p>
              </td>
              <td colspan="2"></td>
              <td class="align-top px-0 py-6">
                <p class="mb-1 mt-5 text-end">
                  <span class="me-2 fw-medium text-heading">TTD Penerima</span>
                </p>
              </td>
            </tr>
            <tr>
              <td colspan="2">
              </td>
            </tr>
            <tr>
              <td colspan="2">
              </td>
            </tr>
            <tr>
              <td colspan="2">
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <span>{{ stockTransfer.transferByUser?.fullName || '-' }}</span>
              </td>
              <td colspan="2" class="text-end p-5" style="padding-right: 1em !important;">
                <span style="margin-right: 1em;">{{ stockTransfer.transferByUser?.fullName || '-' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="alert alert-danger m-6" role="alert">
      Stock Transfer tidak ditemukan.
    </div>
</template>


<script setup>
  definePageMeta({
    layout: 'cetak',
    title: 'Cetak Stock Transfer',
    description: 'Cetak Stock Transfer',
    keywords: 'Cetak Stock Transfer, Kainnova Digital Solutions',
    author: 'Kainnova Digital Solutions',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0'
  })
  import { onMounted } from 'vue';
  import { useStockTransferStore } from '~/stores/stock-transfer';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  import Swal from 'sweetalert2';
  import { useDynamicTitle } from '~/composables/useDynamicTitle'

  // Composables
  const { setListTitle, setFormTitle } = useDynamicTitle()

  const config = useRuntimeConfig();
  const stockTransferStore = useStockTransferStore();
  const route = useRoute();

  const { selectedStockTransfer: stockTransfer, loading, error } = storeToRefs(stockTransferStore);

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
    const stockTransferId = route.query.id;
    if (stockTransferId) {
      try {
        await stockTransferStore.fetchStockTransferById(stockTransferId);
      } catch (e) {
        toast('Error', e.message || 'Gagal memuat detail stock transfer.', 'error');
      }
    }
    setListTitle('Stock Transfer', stockTransfer.value.length)
  });
</script>

<style>
  /* No changes to style section */
</style> 