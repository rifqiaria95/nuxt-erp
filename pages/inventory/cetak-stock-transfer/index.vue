<template>
    <div v-if="loading" class="text-center p-6">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger m-6">{{ error.message }}</div>
    <div v-else-if="stockTransfer" class="p-6">
      <div class="d-flex justify-content-between flex-row">
        <div v-if="stockTransfer.perusahaan">
          <div class="d-flex svg-illustration align-items-center gap-2 mb-6">
            <span class="app-brand-logo demo">
               <img v-if="stockTransfer.perusahaan.logoPerusahaan"
               :src="getLogoUrl(stockTransfer.perusahaan.logoPerusahaan)"
               alt="Logo Perusahaan"
               style="width: 200px;">
            </span>
          </div>
          <p class="mb-1">{{ stockTransfer.perusahaan.alamatPerusahaan }}</p>
          <p class="mb-0">{{ stockTransfer.perusahaan.tlpPerusahaan }}</p>
          <p class="mb-0">{{ stockTransfer.perusahaan.emailPerusahaan }}</p>
        </div>
        <div>
          <h5 class="mb-6 text-capitalize">NO. BERITA ACARA #{{ stockTransfer.noTransfer }}</h5>
          <div class="mb-1 text-end">
            <span class="me-2">Tanggal:</span>
            <span>{{ new Date(stockTransfer.date).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>

      <hr class="my-6" />

      <div class="d-flex justify-content-between mb-6">
        <div class="col-3">
          <h6><strong>Gudang Asal:</strong></h6>
          <p class="mb-1">{{ stockTransfer.fromWarehouse?.name }}</p>
          <p class="mb-0">{{ stockTransfer.fromWarehouse?.address }}</p>
        </div>
        <div class="text-end col-3">
          <h6><strong>Gudang Tujuan:</strong></h6>
          <p class="mb-1">{{ stockTransfer.toWarehouse?.name }}</p>
          <p class="mb-0">{{ stockTransfer.toWarehouse?.address }}</p>
        </div>
      </div>

      <div class="table-responsive border border-bottom-0 rounded">
        <table class="table m-0">
          <thead>
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
  })
  import { onMounted } from 'vue';
  import { useStockTransferStore } from '~/stores/stock-transfer';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  import Swal from 'sweetalert2';
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
  });
</script>

<style>
  /* No changes to style section */
</style> 