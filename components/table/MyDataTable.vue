<template>
  <DataTable
    ref="dt"
    :value="props.data"
    :rows="props.rows"
    :loading="props.loading"
    :totalRecords="props.totalRecords"
    paginator
    lazy
    dataKey="id"
    tableStyle="min-width: 50rem"
    v-bind="$attrs"
    @page="emit('page', $event)"
    @sort="emit('sort', $event)"
  >
    <slot></slot>
  </DataTable>
</template>

<script setup>
import { defineProps, defineExpose, ref, defineEmits } from 'vue'
import DataTable from 'primevue/datatable'

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
    rows: {
        type: Number,
        default: 10,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    totalRecords: {
        type: Number,
        default: 0,
    },
})

const emit = defineEmits(['page', 'sort'])

const dt = ref()

const exportCSV = (options) => {
    dt.value.exportCSV(options)
}

const exportPDF = async () => {
     const { default: jsPDF } = await import('jspdf');
     const { default: autoTable } = await import('jspdf-autotable');
 
     const exportableColumns = dt.value.columns.filter(col => col.props.exportable !== false && col.props.field);
 
     const head = [exportableColumns.map(col => col.props.header)];
     const body = props.data.map(row => exportableColumns.map(col => {
         const field = col.props.field;
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
})
</script>

<style scoped>
  

</style>