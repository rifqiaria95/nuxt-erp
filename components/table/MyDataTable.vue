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

const exportPDF = async (exportData = null) => {
     const { default: jsPDF } = await import('jspdf');
     const { default: autoTable } = await import('jspdf-autotable');
 
     const exportableColumns = dt.value.columns.filter(col => col.props.exportable !== false && col.props.field);
 
     const head = [exportableColumns.map(col => col.props.header)];
     const dataToExport = exportData || props.data;
     
     if (!dataToExport || dataToExport.length === 0) {
         console.warn('No data to export');
         // Create empty PDF with message
         const doc = new jsPDF('landscape');
         doc.setFontSize(16);
         doc.text('Sales Orders Report', 14, 15);
         doc.setFontSize(12);
         doc.text('No data available for export', 14, 50);
         doc.save('sales-orders-empty.pdf');
         return;
     }
     
     const body = dataToExport.map(row => exportableColumns.map(col => {
         const field = col.props.field;
         let value = '';
         
         if (field.includes('.')) {
             value = field.split('.').reduce((o, i) => (o ? o[i] : ''), row) || '';
         } else {
             value = row[field] || '';
         }
         
         // Handle special formatting for dates
         if (field === 'date' || field === 'dueDate' || field === 'createdAt' || field === 'updatedAt') {
             if (value) {
                 try {
                     value = new Date(value).toLocaleDateString('id-ID');
                 } catch (e) {
                     value = value.toString();
                 }
             }
         }
         
         // Truncate long text for better fit in landscape mode
         const maxLength = 30;
         if (value && value.length > maxLength) {
             value = value.substring(0, maxLength) + '...';
         }
         
         return value.toString();
     }));
 
     // Create PDF in landscape orientation
     const doc = new jsPDF('landscape');
     
     // Add title
     doc.setFontSize(16);
     doc.text('Sales Orders Report', 14, 15);
     
     // Add timestamp
     doc.setFontSize(10);
     doc.text(`Generated on: ${new Date().toLocaleString('id-ID')}`, 14, 25);
     
     // Add filter information if any
     const filterInfo = [];
     if (dataToExport.length > 0) {
         const sampleRow = dataToExport[0];
         if (sampleRow.customer?.name) filterInfo.push('Customer: ' + sampleRow.customer.name);
         if (sampleRow.source) filterInfo.push('Source: ' + sampleRow.source);
         if (sampleRow.status) filterInfo.push('Status: ' + sampleRow.status);
     }
     
     if (filterInfo.length > 0) {
         doc.setFontSize(8);
         doc.text(`Filters: ${filterInfo.join(' | ')}`, 14, 35);
     }
     
     // Calculate dynamic column widths based on number of columns
     const columnCount = exportableColumns.length;
     const availableWidth = doc.internal.pageSize.width - 20; // Account for margins
     const baseColumnWidth = availableWidth / columnCount;
     
     // Create dynamic column styles
     const columnStyles = {};
     exportableColumns.forEach((col, index) => {
       let cellWidth = baseColumnWidth;
       
       // Adjust width for specific columns
       if (col.props.field === 'noSo' || col.props.field === 'noPo') {
         cellWidth = 25;
       } else if (col.props.field === 'customer.name') {
         cellWidth = 35;
       } else if (col.props.field === 'paymentMethod' || col.props.field === 'status') {
         cellWidth = 20;
       } else if (col.props.field === 'source') {
         cellWidth = 15;
       } else if (col.props.field === 'createdByUser.fullName' || col.props.field === 'approvedByUser.fullName') {
         cellWidth = 25;
       } else if (col.props.field === 'date' || col.props.field === 'dueDate') {
         cellWidth = 20;
       } else if (col.props.field === 'perusahaan.nmPerusahaan' || col.props.field === 'cabang.nmCabang') {
         cellWidth = 25;
       } else if (col.props.field === 'attachment') {
         cellWidth = 30;
       }
       
       columnStyles[index] = { cellWidth };
     });
     
     autoTable(doc, {
       head: head,
       body: body,
       startY: filterInfo.length > 0 ? 40 : 30,
       styles: {
         fontSize: 7,
         cellPadding: 2,
         overflow: 'linebreak',
         halign: 'left',
       },
       headStyles: {
         fillColor: [41, 128, 185],
         textColor: 255,
         fontStyle: 'bold',
         halign: 'center',
       },
       alternateRowStyles: {
         fillColor: [245, 245, 245],
       },
       margin: { top: 30, right: 10, bottom: 10, left: 10 },
       tableWidth: 'auto',
       columnStyles: columnStyles,
       didDrawPage: function (data) {
         // Add page number
         const pageCount = doc.internal.getNumberOfPages();
         doc.setFontSize(8);
         doc.text(`Page ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
       },
     });
     
     doc.save('sales-orders.pdf');
}

defineExpose({
    exportCSV,
    exportPDF
})
</script>
<style scoped>
  

</style>
