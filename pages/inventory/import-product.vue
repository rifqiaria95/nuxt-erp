<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title">Import Product & Stock</h4>
                            <p class="card-text">
                                Upload file Excel untuk mengimpor data product dan stock sekaligus.
                            </p>
                        </div>
                        <div class="card-body mt-5">
                            <!-- Download Template Section -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <div class="alert alert-info">
                                        <div class="d-flex align-items-center">
                                            <i class="ri-information-line me-2"></i>
                                                                                         <div>
                                                 <h6 class="alert-heading">Panduan Import</h6>
                                                 <p class="mb-0">
                                                     1. Download template Excel terlebih dahulu<br>
                                                     2. Isi data sesuai format yang ada di template<br>
                                                     3. Upload file Excel yang sudah diisi<br>
                                                     4. Pastikan data Unit, Kategori, dan Warehouse sudah ada di sistem<br>
                                                     5. <strong>Catatan:</strong> Template menggunakan contoh data. Sesuaikan dengan data yang ada di sistem Anda.
                                                 </p>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Download Template -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <div class="card border-secondary">
                                        <div class="card-header bg-secondary">
                                            <h5 class="card-title mb-0 text-white">
                                                <i class="ri-download-line me-2"></i>
                                                Download Template Excel
                                            </h5>
                                        </div>
                                        <div class="card-body mt-5">
                                            <p class="card-text">
                                                Template Excel berisi 2 sheet: <strong>Products</strong> dan <strong>Stocks</strong>.
                                                Silakan download template terlebih dahulu untuk melihat format data yang diperlukan.
                                            </p>
                                            <button 
                                                @click="downloadTemplate" 
                                                class="btn btn-secondary"
                                                :disabled="downloadingTemplate"
                                            >
                                                <span v-if="downloadingTemplate" class="spinner-border spinner-border-sm me-2" role="status"></span>
                                                <i v-else class="ri-download-line me-2"></i>
                                                {{ downloadingTemplate ? 'Mengunduh...' : 'Download Template Excel' }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Upload File Section -->
                            <div class="row">
                                <div class="col-12">
                                    <div class="card border-success">
                                        <div class="card-header bg-success text-white">
                                            <h5 class="card-title mb-0">
                                                <i class="ri-upload-line me-2"></i>
                                                Upload File Excel
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <form @submit.prevent="uploadFile">
                                                <div class="mb-3 mt-5">
                                                    <label for="excelFile" class="form-label">Pilih File Excel (.xlsx atau .xls)</label>
                                                    <input 
                                                        type="file" 
                                                        class="form-control" 
                                                        id="excelFile"
                                                        ref="fileInput"
                                                        @change="handleFileChange"
                                                        accept=".xlsx,.xls"
                                                        :disabled="uploading"
                                                    >
                                                    <div class="form-text">
                                                        Maksimal ukuran file: 10MB. File harus berisi sheet "Products" dan "Stocks".
                                                    </div>
                                                </div>

                                                <div v-if="selectedFile" class="mb-3">
                                                    <div class="alert alert-info">
                                                        <strong>File yang dipilih:</strong> {{ selectedFile.name }} 
                                                        ({{ formatFileSize(selectedFile.size) }})
                                                    </div>
                                                </div>

                                                <div v-if="uploadError" class="mb-3">
                                                    <div class="alert alert-danger">
                                                        <i class="ri-error-warning-line me-2"></i>
                                                        {{ uploadError }}
                                                    </div>
                                                </div>

                                                <div v-if="uploadSuccess" class="mb-3">
                                                    <div class="alert alert-success">
                                                        <i class="ri-check-line me-2"></i>
                                                        {{ uploadSuccess }}
                                                    </div>
                                                </div>

                                                <button 
                                                    type="submit" 
                                                    class="btn btn-success"
                                                    :disabled="!selectedFile || uploading"
                                                >
                                                    <span v-if="uploading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    <i v-else class="ri-upload-line me-2"></i>
                                                    {{ uploading ? 'Mengupload...' : 'Upload & Import Data' }}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Import Results -->
                            <div v-if="importResults" class="row mt-4">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-header">
                                            <h5 class="card-title">Hasil Import</h5>
                                        </div>
                                        <div class="card-body">
                                            <!-- Products Results -->
                                            <div class="row mb-4">
                                                <div class="col-md-6">
                                                    <div class="card border-primary">
                                                        <div class="card-header bg-primary text-white">
                                                            <h6 class="card-title mb-0">Products</h6>
                                                        </div>
                                                        <div class="card-body">
                                                            <div class="d-flex justify-content-between mb-2">
                                                                <span>Berhasil:</span>
                                                                <span class="badge bg-success">{{ importResults.products.success }}</span>
                                                            </div>
                                                            <div class="d-flex justify-content-between">
                                                                <span>Gagal:</span>
                                                                <span class="badge bg-danger">{{ importResults.products.failed }}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="card border-success">
                                                        <div class="card-header bg-success text-white">
                                                            <h6 class="card-title mb-0">Stocks</h6>
                                                        </div>
                                                        <div class="card-body">
                                                            <div class="d-flex justify-content-between mb-2">
                                                                <span>Berhasil:</span>
                                                                <span class="badge bg-success">{{ importResults.stocks.success }}</span>
                                                            </div>
                                                            <div class="d-flex justify-content-between">
                                                                <span>Gagal:</span>
                                                                <span class="badge bg-danger">{{ importResults.stocks.failed }}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Error Details -->
                                            <div v-if="importResults.products.errors.length > 0 || importResults.stocks.errors.length > 0" class="row">
                                                <div class="col-12">
                                                    <div class="card border-warning">
                                                        <div class="card-header bg-warning text-dark">
                                                            <h6 class="card-title mb-0">Detail Error</h6>
                                                        </div>
                                                        <div class="card-body">
                                                            <div v-if="importResults.products.errors.length > 0" class="mb-3">
                                                                <h6>Error Products:</h6>
                                                                <div class="table-responsive">
                                                                    <table class="table table-sm">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Baris</th>
                                                                                <th>Error</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr v-for="error in importResults.products.errors" :key="`product-${error.row}`">
                                                                                <td>{{ error.row }}</td>
                                                                                <td>{{ error.message }}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>

                                                            <div v-if="importResults.stocks.errors.length > 0">
                                                                <h6>Error Stocks:</h6>
                                                                <div class="table-responsive">
                                                                    <table class="table table-sm">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Baris</th>
                                                                                <th>Error</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr v-for="error in importResults.stocks.errors" :key="`stock-${error.row}`">
                                                                                <td>{{ error.row }}</td>
                                                                                <td>{{ error.message }}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- / Content -->
        <div class="content-backdrop fade"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDynamicTitle } from '~/composables/useDynamicTitle'
import { usePermissions } from '~/composables/usePermissions'

// Composables
const { setListTitle } = useDynamicTitle()
const { userHasPermission } = usePermissions()

// Refs
const fileInput = ref(null)
const selectedFile = ref(null)
const uploading = ref(false)
const downloadingTemplate = ref(false)
const uploadError = ref('')
const uploadSuccess = ref('')
const importResults = ref(null)

// API
const { $api } = useNuxtApp()

onMounted(() => {
    setListTitle('Import Product & Stock')
})

const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedFile.value = file
        uploadError.value = ''
        uploadSuccess.value = ''
        importResults.value = null
    }
}

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadTemplate = async () => {
    const toast     = useToast();
    try {
        downloadingTemplate.value = true
        const token = localStorage.getItem('token')
        
        const response = await fetch(`${$api.import()}/template`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error('Gagal mengunduh template')
        }

        // Create blob and download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'template_import_product_stock.xlsx'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast.success({
            title: 'Berhasil!',
            message: 'Template Excel berhasil diunduh.',
            color: 'green',
            position: 'topRight',
            layout: 2,
        })
    } catch (error) {
        console.error('Download template error:', error)
        toast.error({
            title: 'Error',
            message: 'Gagal mengunduh template: ' + error.message,
            color: 'red',
            position: 'topRight',
            layout: 2,
        })
    } finally {
        downloadingTemplate.value = false
    }
}

const uploadFile = async () => {
    const toast     = useToast();
    if (!selectedFile.value) {
        toast.error({
            title: 'Error',
            message: 'Silakan pilih file Excel terlebih dahulu.',
            color: 'red',
            position: 'topRight',
            layout: 2,
        })
        return
    }

    try {
        uploading.value = true
        uploadError.value = ''
        uploadSuccess.value = ''
        importResults.value = null

        const token = localStorage.getItem('token')
        const formData = new FormData()
        formData.append('excel_file', selectedFile.value)

        const response = await fetch(`${$api.import()}/products-stocks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData,
            credentials: 'include'
        })

        const result = await response.json()

        if (!response.ok) {
            if (result.errors && result.errors.excel_file) {
                uploadError.value = result.errors.excel_file.join(', ')
            } else {
                uploadError.value = result.message || 'Gagal mengupload file'
            }
            return
        }

        // Handle response dengan error partial
        if (response.status === 422) {
            uploadError.value = result.message || 'Import selesai dengan beberapa error'
            if (result.results) {
                importResults.value = result.results
            }
            return
        }

        uploadSuccess.value = result.message || 'File berhasil diupload'
        
        if (result.results) {
            importResults.value = result.results
        }

        // Reset file input
        if (fileInput.value) {
            fileInput.value.value = ''
        }
        selectedFile.value = null

        toast.success({
            title: 'Berhasil!',
            message: 'Import data berhasil diproses.',
            color: 'green',
            position: 'topRight',
            layout: 2,
        })
    } catch (error) {
        console.error('Upload error:', error)
        uploadError.value = 'Terjadi kesalahan saat mengupload file: ' + error.message
        toast.error({
            title: 'Error',
            message: 'Gagal mengupload file: ' + error.message,
            color: 'red',
            position: 'topRight',
            layout: 2,
        })
    } finally {
        uploading.value = false
    }
}
</script>

<style scoped>
.card {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    border: 1px solid rgba(0, 0, 0, 0.125);
}

.card-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.alert {
    border-radius: 0.375rem;
}

.table-sm th,
.table-sm td {
    padding: 0.5rem;
    font-size: 0.875rem;
}

.badge {
    font-size: 0.75rem;
}

.btn {
    border-radius: 0.375rem;
}

.form-control {
    border-radius: 0.375rem;
}

.form-control:focus {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
