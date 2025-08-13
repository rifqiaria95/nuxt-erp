<template>
  <div class="table-controls">
    <!-- Desktop Layout -->
    <div class="table-controls-desktop d-none d-md-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center me-3">
        <span class="me-2">Baris:</span>
        <Dropdown 
          v-model="rowsPerPage" 
          :options="rowsPerPageOptions" 
          @change="handleRowsChange" 
          placeholder="Jumlah" 
          style="width: 8rem;"
          :showClear="false"
        />
      </div>
      <div class="d-flex align-items-center">
        <div class="btn-group me-2">
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="ri-upload-2-line me-1"></i> Export
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="javascript:void(0)" @click="handleExport('csv')">CSV</a></li>
            <li><a class="dropdown-item" href="javascript:void(0)" @click="handleExport('pdf')">PDF</a></li>
          </ul>
        </div>
        <div class="input-group">
          <span class="p-input-icon-left">
            <InputText
              v-model="searchValue"
              :placeholder="searchPlaceholder"
              class="w-full md:w-20rem"
              @input="handleSearch"
            />
          </span>
        </div>
      </div>
    </div>
    
    <!-- Mobile Layout -->
    <div class="table-controls-mobile d-md-none">
      <div class="mobile-control-row">
        <div class="mobile-control-item">
          <span class="mobile-label">Baris:</span>
          <Dropdown 
            v-model="rowsPerPage" 
            :options="rowsPerPageOptions" 
            @change="handleRowsChange" 
            placeholder="Jumlah" 
            class="mobile-dropdown"
            :showClear="false"
          />
        </div>
      </div>
      <div class="mobile-control-row">
        <div class="mobile-control-item">
          <div class="input-group">
            <span class="p-input-icon-left">
              <InputText
                v-model="searchValue"
                :placeholder="searchPlaceholder"
                class="mobile-search"
                @input="handleSearch"
              />
            </span>
          </div>
        </div>
      </div>
      <div class="mobile-control-row">
        <div class="mobile-control-item">
          <div class="btn-group w-100">
            <button class="btn btn-secondary dropdown-toggle w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="ri-upload-2-line me-1"></i> Export
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="javascript:void(0)" @click="handleExport('csv')">CSV</a></li>
              <li><a class="dropdown-item" href="javascript:void(0)" @click="handleExport('pdf')">PDF</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      rows: 10,
      search: ''
    })
  },
  rowsPerPageOptions: {
    type: Array,
    default: () => [10, 25, 50, 100]
  },
  searchPlaceholder: {
    type: String,
    default: 'Cari...'
  }
})

const emit = defineEmits(['update:modelValue', 'rows-change', 'search', 'export'])

const rowsPerPage = ref(Number(props.modelValue.rows) || 10)
const searchValue = ref(props.modelValue.search || '')

const handleRowsChange = (value) => {
  rowsPerPage.value = value
  emit('rows-change', value)
  emit('update:modelValue', { ...props.modelValue, rows: value })
}

const handleSearch = (event) => {
  searchValue.value = event.target.value
  emit('search', event.target.value)
  emit('update:modelValue', { ...props.modelValue, search: event.target.value })
}

const handleExport = (type) => {
  emit('export', type)
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue.rows !== undefined) rowsPerPage.value = Number(newValue.rows) || 10
  if (newValue.search !== undefined) searchValue.value = newValue.search
}, { deep: true })
</script>

<style scoped>
/* Mobile Responsive Table Controls */
.table-controls {
  padding: 1rem;
}

.table-controls-mobile {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mobile-control-row {
  display: flex;
  width: 100%;
}

.mobile-control-item {
  width: 100%;
  display: flex;
  align-items: center;
}

.mobile-label {
  font-weight: 500;
  margin-right: 0.5rem;
  white-space: nowrap;
  color: #6c757d;
}

.mobile-dropdown {
  flex: 1;
  min-width: 0;
}

.mobile-search {
  width: 16.875rem !important;
  height: 38px;
  border-radius: 6px;
  border: 1px solid #ced4da;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.mobile-search:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  outline: 0;
}

/* Desktop styles */
.table-controls-desktop {
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .table-controls {
    padding: 0.75rem;
  }
  
  .mobile-control-row {
    margin-bottom: 0.5rem;
  }
  
  .mobile-control-row:last-child {
    margin-bottom: 0;
  }
  
  .btn-group .dropdown-toggle {
    text-align: left;
    justify-content: space-between;
  }
  
  .btn-group .dropdown-toggle::after {
    margin-left: auto;
  }
}

/* Ensure proper spacing on very small screens */
@media (max-width: 575.98px) {
  .table-controls {
    padding: 0.5rem;
  }
  
  .mobile-control-row {
    margin-bottom: 0.75rem;
  }
  
  .mobile-label {
    font-size: 0.875rem;
  }
}
</style>
