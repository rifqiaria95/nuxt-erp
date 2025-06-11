<template>
  <DataTable
    ref="dt"
    :value="data"
    :paginator="true"
    :rows="rows"
    :rowsPerPageOptions="rowsPerPageOptions"
    :loading="loading"
    stripedRows
    :lazy="lazy"
    :totalRecords="totalRecords"
    responsiveLayout="scroll"
    v-bind="$attrs"
    v-model:filters="internalFilters"
    :globalFilterFields="globalFilterFields"
    @page="$emit('page', $event)"
    @sort="$emit('sort', $event)"
  >
    <slot></slot>

    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </DataTable>
</template>

<script setup>
import { defineEmits, defineProps, useAttrs, ref, watch } from 'vue'
const emit = defineEmits(['update:filters', 'page', 'sort'])

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  paginator: {
    type: Boolean,
    default: true
  },
  rows: {
    type: Number,
    default: 10
  },
  rowsPerPageOptions: {
    type: Array,
    default: () => [5, 10, 20, 50]
  },
  loading: {
    type: Boolean,
    default: false
  },
  lazy: {
    type: Boolean,
    default: false
  },
  totalRecords: {
    type: Number,
    default: 0
  },
  filters: Object,
  globalFilterFields: {
    type: Array,
    default: () => []
  }
})

const internalFilters = ref({ ...props.filters })

watch(
  () => props.filters,
  (val) => {
    internalFilters.value = { ...val }
  }
)

watch(
  () => internalFilters.value,
  (val) => {
    emit('update:filters', val)
  },
  { deep: true }
)


const attrs = useAttrs();
const dt = ref();
const exportCSV = () => {
    dt.value.exportCSV();
};

const exportPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const exportableColumns = dt.value.columns.filter(col => col.props.exportable !== false && col.props.field);

    const head = [exportableColumns.map(col => col.props.header)];
    const body = props.data.map(row => exportableColumns.map(col => {
        const field = col.props.field;
        // Handle nested properties if field contains dot notation
        if (field.includes('.')) {
            return field.split('.').reduce((o, i) => (o ? o[i] : ''), row);
        }
        return row[field];
    }));

    const doc = new jsPDF();
    autoTable(doc, {
      head: head,
      body: body,
    });
    doc.save('data.pdf');
}

defineExpose({
  exportCSV,
  exportPDF
});
</script>

<style scoped>
  

</style>