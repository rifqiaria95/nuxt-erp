export const useImageUrl = () => {
  const config = useRuntimeConfig()
  
  /**
   * Get image URL dengan fallback ke default image
   */
  const getImageUrl = (path: string | null | undefined, defaultImage: string = '/img/default-avatar.png') => {
    if (!path) return defaultImage
    
    // Jika path sudah berupa full URL (S3), gunakan langsung
    if (path.startsWith('http')) {
      return path
    }
    
    // Jika local storage, gabungkan dengan API base
    const apiBase = config.public.apiBase || ''
    const baseUrl = apiBase.replace('/api', '')
    
    return `${baseUrl}/${path}`
  }

  /**
   * Get image URL untuk customer logo
   */
  const getCustomerLogo = (logoPath: string | null | undefined) => {
    return getImageUrl(logoPath, '/img/default-customer-logo.png')
  }

  /**
   * Get image URL untuk product image
   */
  const getProductImage = (imagePath: string | null | undefined) => {
    return getImageUrl(imagePath, '/img/default-product-image.png')
  }

  /**
   * Get image URL untuk user avatar
   */
  const getUserAvatar = (avatarPath: string | null | undefined) => {
    return getImageUrl(avatarPath, '/img/default-avatar.png')
  }

  /**
   * Get image URL untuk company logo
   */
  const getCompanyLogo = (logoPath: string | null | undefined) => {
    return getImageUrl(logoPath, '/img/default-company-logo.png')
  }

  /**
   * Get image URL untuk vendor logo
   */
  const getVendorLogo = (logoPath: string | null | undefined) => {
    return getImageUrl(logoPath, '/img/default-vendor-logo.png')
  }

  /**
   * Get file URL untuk attachment (PDF, Excel, Image)
   */
  const getAttachmentUrl = (filePath: string | null | undefined) => {
    return getImageUrl(filePath, '/img/default-file.png')
  }

  /**
   * Get file icon berdasarkan extension
   */
  const getFileIcon = (fileName: string | null | undefined): string => {
    if (!fileName) return 'ri-file-line'
    
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    
    switch (extension) {
      case 'pdf':
        return 'ri-file-pdf-line'
      case 'xlsx':
      case 'xls':
        return 'ri-file-excel-line'
      case 'docx':
      case 'doc':
        return 'ri-file-word-line'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg':
        return 'ri-image-line'
      default:
        return 'ri-file-line'
    }
  }

  /**
   * Check apakah file adalah image
   */
  const isImageFile = (fileName: string | null | undefined): boolean => {
    if (!fileName) return false
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)
  }

  /**
   * Check apakah file adalah PDF
   */
  const isPdfFile = (fileName: string | null | undefined): boolean => {
    if (!fileName) return false
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    return extension === 'pdf'
  }

  /**
   * Check apakah file adalah Excel
   */
  const isExcelFile = (fileName: string | null | undefined): boolean => {
    if (!fileName) return false
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    return ['xlsx', 'xls'].includes(extension)
  }

  /**
   * Handle image error dengan fallback
   */
  const handleImageError = (event: Event, fallbackSrc: string = '/img/default-avatar.png') => {
    const target = event.target as HTMLImageElement
    if (target.src !== fallbackSrc) {
      target.src = fallbackSrc
    }
  }

  /**
   * Check apakah URL adalah S3 URL
   */
  const isS3Url = (url: string): boolean => {
    return url.includes('s3.amazonaws.com') || url.includes('s3.')
  }

  /**
   * Get file extension dari URL
   */
  const getFileExtension = (url: string): string => {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      return pathname.split('.').pop()?.toLowerCase() || ''
    } catch {
      return ''
    }
  }



  /**
   * Test image URL accessibility
   */
  const testImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      console.error('Image URL test failed:', error)
      return false
    }
  }

  return {
    getImageUrl,
    getCustomerLogo,
    getProductImage,
    getUserAvatar,
    getCompanyLogo,
    getVendorLogo,
    getAttachmentUrl,
    getFileIcon,
    handleImageError,
    isS3Url,
    getFileExtension,
    isImageFile,
    isPdfFile,
    isExcelFile,
    testImageUrl
  }
}