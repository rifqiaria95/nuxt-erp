<template>
    <div class="content-wrapper">
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">Detail Stock Transfer</h4>
            <p class="mb-6">
            Berikut di bawah ini data detail stock transfer
            </p>
            <div v-if="loading" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div v-else-if="error" class="alert alert-danger">{{ error.message }}</div>
            <div v-else-if="stockTransfer" class="row g-6">
                <div class="col-4">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 class="mb-1">
                                        Detail Stock Transfer
                                    </h5>
                                </div>
                            </div>
                             <div class="row mt-4">
                                <div class="col-12">
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><strong>Perusahaan:</strong> {{ stockTransfer.perusahaan?.nmPerusahaan }}</li>
                                        <li class="mb-2"><strong>Cabang:</strong> {{ stockTransfer.cabang?.nmCabang }}</li>
                                        <li class="mb-2"><strong>Tanggal:</strong> {{ new Date(stockTransfer.date).toLocaleDateString() }}</li>
                                        <li class="mb-2"><strong>Gudang Asal:</strong> {{ stockTransfer.fromWarehouse?.name }}</li>
                                        <li class="mb-2"><strong>Gudang Tujuan:</strong> {{ stockTransfer.toWarehouse?.name }}</li>
                                        <li class="mb-2"><strong>Status:</strong> <span :class="['badge', getStatusClass(stockTransfer.status)]">{{ stockTransfer.status }}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-8">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 class="mb-1">Nomor Stock Transfer: {{ stockTransfer.noTransfer }}</h5>
                                    <p class="text-muted mb-0" style="font-size: 0.95em;">
                                        Berikut adalah informasi singkat mengenai dokumen Stock Transfer ini, termasuk nomor ST, tanggal, gudang asal, gudang tujuan, dan status terkini. Pastikan data sudah sesuai sebelum melakukan proses lebih lanjut.
                                    </p>
                                </div>
                                <NuxtLink to="/inventory/stock-transfer" class="btn btn-sm btn-primary">
                                    <i class="ri-arrow-left-line me-1"></i>
                                </NuxtLink>
                            </div>
                             <div class="row mt-4">
                                <div class="col-md-6">
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><strong>Transfer by:</strong> {{ stockTransfer.transferByUser?.fullName || '-' }}</li>
                                        <li class="mb-2"><strong>Description:</strong> {{ stockTransfer.description || '-' }}</li>
                                        <li class="mb-2"><strong>Transfer At:</strong> {{ new Date(stockTransfer.createdAt).toLocaleDateString() }}</li>
                                    </ul>
                                    <a href="javascript:void(0)" @click="cetakStockTransfer(stockTransfer.id)" class="btn btn-sm btn-secondary mt-2">
                                        <i class="ri-printer-line me-1"></i> Cetak Berita Acara
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Daftar Produk</h5>
                        </div>
                         <div class="card-datatable table-responsive py-3 px-3">
                            <MyDataTable :data="stockTransfer.stockTransferDetails || []" :loading="loading">
                                <Column field="product.name" header="Produk" :sortable="true"></Column>
                                <Column field="description" header="Deskripsi" :sortable="true"></Column>
                                <Column header="Jumlah" :sortable="false">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.quantity !== null) ? String(slotProps.data.quantity).replace(/\.00$/, '') : 0 }}
                                    </template>
                                </Column>
                            </MyDataTable>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="alert alert-danger" role="alert">
                Stock Transfer tidak ditemukan.
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Column from 'primevue/column'
import { useStockTransferStore } from '~/stores/stock-transfer'
import Swal from 'sweetalert2'

const { $api } = useNuxtApp();

const route = useRoute()
const stockTransferStore = useStockTransferStore()
const { selectedStockTransfer: stockTransfer, loading, error } = storeToRefs(stockTransferStore)

onMounted(async () => {
  const stockTransferId = route.query.id;
  if (stockTransferId) {
    try {
      await stockTransferStore.fetchStockTransferById(stockTransferId);
    } catch (e) {
      Swal.fire('Error', e.message || 'Gagal memuat detail stock transfer.', 'error');
    }
  } else {
    Swal.fire('Error', 'ID Stock Transfer tidak ditemukan di URL.', 'error');
  }
});

onBeforeUnmount(() => {
    stockTransferStore.resetStockTransfer();
});

const getStatusClass = (status) => {
    const statusMap = {
        draft: 'bg-label-secondary',
        approved: 'bg-label-success',
        rejected: 'bg-label-danger',
    }
    return statusMap[status] || 'bg-label-info'
}

const cetakStockTransfer = (stockTransferId) => {
    if (stockTransferId) {
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/inventory/cetak-stock-transfer?id=${stockTransferId}`;
        window.open(url, '_blank');
    } else {
        Swal.fire('Error', 'ID Stock Transfer tidak ditemukan.', 'error');
    }
}
</script> 