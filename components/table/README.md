# TableControls Component

Komponen `TableControls` adalah komponen yang dapat digunakan kembali untuk menampilkan kontrol tabel (sort, search, export) dengan layout responsive yang optimal untuk mobile dan desktop.

## Fitur

- **Responsive Design**: Otomatis menyesuaikan layout untuk mobile dan desktop
- **Mobile Layout**: Menampilkan kontrol dalam 3 baris sejajar (Sort, Search, Export)
- **Desktop Layout**: Menampilkan kontrol dalam satu baris horizontal
- **Reusable**: Dapat digunakan di berbagai halaman tabel

## Penggunaan

### Import Komponen

```vue
import TableControls from '~/components/table/TableControls.vue'
```

### Basic Usage

```vue
<template>
  <div class="card">
    <div class="card-header">
      <TableControls
        v-model="tableControls"
        :rows-per-page-options="[10, 25, 50, 100]"
        search-placeholder="Cari data..."
        @rows-change="handleRowsChange"
        @search="handleSearch"
        @export="handleExport"
      />
    </div>
    <!-- Table content -->
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import TableControls from '~/components/table/TableControls.vue'

// Data untuk table controls
const tableControls = ref({
  rows: 10,
  search: ''
})

// Fungsi handlers
const handleRowsChange = (value) => {
  params.value.rows = value
  params.value.first = 0
  fetchData()
}

const handleSearch = (value) => {
  globalFilterValue.value = value
  params.value.first = 0
  fetchData()
}

const handleExport = (type) => {
  if (type === 'csv') {
    exportCSV()
  } else if (type === 'pdf') {
    exportPDF()
  }
}

// Sinkronisasi data
watch(() => params.value.rows, (newValue) => {
  tableControls.value.rows = newValue
})

watch(() => globalFilterValue.value, (newValue) => {
  tableControls.value.search = newValue
})

// Initialize
onMounted(() => {
  tableControls.value.rows = params.value.rows
  tableControls.value.search = globalFilterValue.value
})
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | Object | `{ rows: 10, search: '' }` | Data untuk rows dan search |
| `rowsPerPageOptions` | Array | `[10, 25, 50, 100]` | Opsi untuk dropdown rows per page |
| `searchPlaceholder` | String | `'Cari...'` | Placeholder untuk input search |

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `update:modelValue` | `{ rows, search }` | Emitted ketika nilai berubah |
| `rows-change` | `value` | Emitted ketika rows per page berubah |
| `search` | `value` | Emitted ketika search value berubah |
| `export` | `type` | Emitted ketika export button diklik (`'csv'` atau `'pdf'`) |

## Layout

### Desktop (≥768px)
```
[Baris: [Dropdown]] [Export Button] [Search Input]
```

### Mobile (<768px)
```
Baris: [Dropdown]
[Search Input]
[Export Button]
```

## Styling

Komponen menggunakan CSS responsive dengan breakpoints:
- `@media (max-width: 767.98px)`: Mobile layout
- `@media (max-width: 575.98px)`: Small mobile adjustments

## Contoh Implementasi Lengkap

Lihat file `nuxt-erp/pages/sales/sales-order.vue` untuk contoh implementasi lengkap dengan store dan data fetching.
