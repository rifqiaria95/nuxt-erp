import { useFormatRupiah } from '~/composables/formatRupiah'

export const useExcelExport = () => {
  const formatRupiah = useFormatRupiah()
  
  const exportToExcel = async (data: any[], columns: any[], options: {
    title?: string
    filename?: string
  } = {}) => {
    try {
      // Import xlsx dengan cara yang lebih eksplisit
      const XLSXModule = await import('xlsx')
      
      // Coba berbagai cara untuk mengakses XLSX
      let XLSX
      if (XLSXModule.utils) {
        XLSX = XLSXModule
      } else {
        throw new Error('XLSX utils tidak ditemukan dalam module')
      }
      
      // Validasi XLSX object
      if (!XLSX || !XLSX.utils) {
        throw new Error('XLSX utils tidak tersedia')
      }

      // Filter kolom yang bisa diexport
      const exportableColumns = columns.filter(col => 
        col.exportable !== false && 
        col.field && 
        col.field !== 'attachment' &&
        col.field !== 'actions'
      )

      // Siapkan data untuk export
      const exportData = []
      
      // Tambahkan title jika ada
      if (options.title) {
        exportData.push([options.title])
        exportData.push([]) // Baris kosong
      }
      
      // Tambahkan header
      const headers = exportableColumns.map(col => col.header)
      exportData.push(headers)
      
      // Tambahkan data
      data.forEach((row, index) => {
        const rowData = exportableColumns.map(col => {
          const field = col.field
          let value = ''
          
          if (field.includes('.')) {
            value = field.split('.').reduce((o: any, i: string) => (o ? o[i] : ''), row) || ''
          } else {
            value = row[field] || ''
          }
          
          // Handle special formatting for dates
          if (field === 'date' || field === 'dueDate' || field === 'createdAt' || field === 'updatedAt') {
            if (value) {
              try {
                value = new Date(value).toLocaleDateString('id-ID')
              } catch (e) {
                value = value.toString()
              }
            }
          }
          
          // Handle special formatting for currency
          if (field === 'priceBuy' || field === 'priceSell' || field === 'total' || field === 'subtotal') {
            if (value && !isNaN(Number(value))) {
              value = formatRupiah(Number(value))
            }
          }
          
          // Handle boolean values
          if (field === 'isService') {
            const boolValue = Boolean(value)
            value = boolValue ? 'Ya' : 'Tidak'
          }
          
          return value.toString()
        })
        exportData.push(rowData)
      })
      
      // Buat workbook dan worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(exportData)
      
      // Set column widths
      const colWidths = exportableColumns.map(col => {
        const field = col.field
        if (field === 'name' || field === 'product.name' || field === 'customer.name') {
          return { wch: 30 }
        } else if (field === 'sku' || field === 'noInterchange') {
          return { wch: 20 }
        } else if (field === 'priceBuy' || field === 'priceSell' || field === 'total') {
          return { wch: 15 }
        } else if (field === 'date' || field === 'dueDate' || field === 'createdAt') {
          return { wch: 12 }
        } else {
          return { wch: 15 }
        }
      })
      
      ws['!cols'] = colWidths
      
      // Tambahkan border untuk semua cell dengan pendekatan yang lebih sederhana
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = XLSX.utils.encode_cell({ r: R, c: C })
          if (!ws[cell_address]) {
            ws[cell_address] = { v: '' }
          }
          
          // Pastikan style object ada
          if (!ws[cell_address].s) {
            ws[cell_address].s = {}
          }
          
          // Set border
          ws[cell_address].s.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          }
        }
      }
      
      // Tambahkan worksheet ke workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Data')
      
      // Generate filename
      const filename = options.filename || `${options.title ? options.title.replace(/[^a-zA-Z0-9]/g, '_') : 'export'}_${new Date().toISOString().split('T')[0]}.xlsx`
      
      // Download file
      XLSX.writeFile(wb, filename)
      
      return { success: true, filename }
    } catch (error: any) {
      console.error('Error exporting Excel:', error)
      throw new Error('Gagal mengekspor file Excel: ' + (error?.message || 'Unknown error'))
    }
  }

  return {
    exportToExcel
  }
}
