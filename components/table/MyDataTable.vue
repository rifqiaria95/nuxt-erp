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
    @selection-change="emit('selection-change', $event)"
  >
    <slot></slot>
  </DataTable>
</template>

<script setup>
import { defineProps, defineExpose, ref, defineEmits } from 'vue'
import DataTable from 'primevue/datatable'

// Fungsi formatRupiah
const formatRupiah = (amount) => {
    if (!amount && amount !== 0) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

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

const emit = defineEmits(['page', 'sort', 'selection-change'])

const dt = ref()

const exportCSV = (options = {}) => {
    // Jika ada options dengan title dan border, gunakan custom export
    if (options.title || options.border) {
        exportCSVWithTitle(options);
    } else {
        // Gunakan export default PrimeVue
        dt.value.exportCSV(options);
    }
}

const exportCSVWithTitle = (options) => {
    const { title, border = true, data = props.data, includeItems = false } = options;
    
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Ambil kolom yang bisa diexport (exclude attachment)
    const exportableColumns = dt.value.columns.filter(col => 
        col.props.exportable !== false && 
        col.props.field && 
        col.props.field !== 'attachment'
    );

    // Siapkan data untuk export
    const exportData = [];
    
    // Tambahkan title jika ada
    if (title) {
        exportData.push([title]);
        exportData.push([]); // Baris kosong
    }
    
    // Tambahkan header
    const headers = exportableColumns.map(col => col.props.header);
    exportData.push(headers);
    
    // Tambahkan garis pemisah header jika border diaktifkan
    if (border) {
        const separatorRow = headers.map(() => '-'.repeat(10));
        exportData.push(separatorRow);
    }
    
    // Tambahkan data
    data.forEach(row => {
        const rowData = exportableColumns.map(col => {
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
            
            return value.toString();
        });
        exportData.push(rowData);
        
        // Jika includeItems diaktifkan dan ada purchaseOrderItems, tambahkan detail items
        if (includeItems && row.purchaseOrderItems && row.purchaseOrderItems.length > 0) {
            // Tambahkan header untuk items
            exportData.push([]);
            exportData.push(['Detail Items:']);
            exportData.push(['No. PO', 'SKU', 'Nama Produk', 'Qty', 'Harga Beli', 'Harga Jual Customer', 'Total Harga', 'Deskripsi']);
            exportData.push(['-'.repeat(10), '-'.repeat(15), '-'.repeat(30), '-'.repeat(5), '-'.repeat(15), '-'.repeat(20), '-'.repeat(15), '-'.repeat(20)]);
            
            row.purchaseOrderItems.forEach(item => {
                const product = item.product;
                // Ambil priceSell dari productCustomer (jika ada) atau dari product default
                let priceSellCustomer = product?.priceSell || 0;
                if (product?.productCustomer && product.productCustomer.length > 0) {
                    // Ambil priceSell dari productCustomer pertama (atau bisa disesuaikan dengan customer tertentu)
                    priceSellCustomer = product.productCustomer[0].priceSell || product.priceSell || 0;
                }
                const totalHarga = (item.quantity || 0) * (priceSellCustomer || 0);
                
                exportData.push([
                    row.noPo || '-',
                    product?.sku || '-',
                    product?.name || '-',
                    item.quantity || 0,
                    formatRupiah(product?.priceBuy || 0),
                    formatRupiah(priceSellCustomer),
                    formatRupiah(totalHarga),
                    item.description || '-'
                ]);
            });
            
            exportData.push([]); // Baris kosong setelah items
        }
    });
    
    // Tambahkan informasi tambahan jika border diaktifkan
    if (border) {
        exportData.push([]); // Baris kosong
        exportData.push(['='.repeat(100)]); // Garis pemisah
        exportData.push([`Total Data: ${data.length} records`]);
        exportData.push([`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`]);
        exportData.push([`Waktu Export: ${new Date().toLocaleTimeString('id-ID')}`]);
    }
    
    // Buat file CSV dengan border dan styling
    let csvContent = '';
    
    // Tambahkan BOM untuk UTF-8
    csvContent += '\uFEFF';
    
    // Proses setiap baris dengan border
    exportData.forEach((row, index) => {
        if (index === 0 && title) {
            // Title - center align dengan border
            csvContent += `"${row[0]}"\n`;
        } else if (row.length === 0) {
            // Baris kosong
            csvContent += '\n';
        } else if (index === (title ? 2 : 0)) {
            // Header - dengan border dan styling
            csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
        } else if (border && index === (title ? 3 : 1)) {
            // Garis pemisah header
            csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
        } else if (row.length === 1) {
            // Informasi tambahan atau garis pemisah (single cell)
            if (row[0].includes('=')) {
                // Garis pemisah
                csvContent += `"${row[0]}"\n`;
            } else {
                // Informasi tambahan
                csvContent += `"${row[0]}"\n`;
            }
        } else {
            // Data rows - dengan border
            csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
        }
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${title ? title.replace(/[^a-zA-Z0-9]/g, '_') : 'export'}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
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
