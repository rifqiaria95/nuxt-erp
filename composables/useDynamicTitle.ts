import { computed } from 'vue'

export const useDynamicTitle = () => {
    const defaultSuffix = 'Kainnova Digital Solutions'

    /**
     * Set title statis
     * @param title - Judul halaman
     * @param suffix - Suffix untuk brand (opsional)
     */
    const setTitle = (title: string, suffix = defaultSuffix) => {
        useHead({
            title: `${title} - ${suffix}`
        })
    }

    /**
     * Set title dinamis berdasarkan data
     * @param baseTitle - Judul dasar
     * @param data - Data yang akan ditampilkan di title
     * @param suffix - Suffix untuk brand (opsional)
     */
    const setTitleWithData = (baseTitle: string, data: any, suffix = defaultSuffix) => {
        useHead({
            title: computed(() => `${baseTitle} ${data} - ${suffix}`)
        })
    }

    /**
     * Set title dinamis berdasarkan kondisi
     * @param titleFn - Fungsi yang mengembalikan title berdasarkan kondisi
     * @param suffix - Suffix untuk brand (opsional)
     */
    const setTitleWithCondition = (titleFn: () => string, suffix = defaultSuffix) => {
        useHead({
            title: computed(() => `${titleFn()} - ${suffix}`)
        })
    }

    /**
     * Set title untuk halaman list dengan jumlah data
     * @param pageName - Nama halaman
     * @param dataCount - Jumlah data
     * @param suffix - Suffix untuk brand (opsional)
     */
    const setListTitle = (pageName: string, dataCount: number, suffix = defaultSuffix) => {
        useHead({
            title: computed(() => `${pageName} - ${suffix}`),
            meta: [
                { name: 'description', content: computed(() => `Daftar ${pageName.toLowerCase()} dengan total ${dataCount} data`) }
            ]
        })
    }

    /**
     * Set title untuk halaman detail/edit
     * @param pageName - Nama halaman
     * @param itemName - Nama item yang sedang diedit/dilihat
     * @param isEdit - Apakah mode edit (opsional)
     * @param suffix - Suffix untuk brand (opsional)
     */
    const setDetailTitle = (pageName: string, itemName: string, isEdit = false, suffix = defaultSuffix) => {
        const action = isEdit ? 'Edit' : 'Detail'
        useHead({
            title: computed(() => `${action} ${pageName} ${itemName} - ${suffix}`),
            meta: [
                { name: 'description', content: computed(() => `Halaman ${action.toLowerCase()} ${pageName.toLowerCase()} ${itemName}`) }
            ]
        })
    }

    /**
     * Set title untuk halaman form (tambah/edit)
     * @param pageName - Nama halaman
     * @param isEdit - Apakah mode edit
     * @param itemName - Nama item (opsional, untuk mode edit)
     * @param suffix - Suffix untuk brand (opsional)
     */
    const setFormTitle = (pageName: string, isEdit = false, itemName = '', suffix = defaultSuffix) => {
        const action = isEdit ? 'Edit' : 'Tambah'
        const title = isEdit && itemName ? `${action} ${pageName} ${itemName}` : `${action} ${pageName}`
        
        useHead({
            title: computed(() => `${title} - ${suffix}`),
            meta: [
                { name: 'description', content: computed(() => `Form ${action.toLowerCase()} ${pageName.toLowerCase()}`) }
            ]
        })
    }

    /**
     * Set title dengan loading state
     * @param pageName - Nama halaman
     * @param loading - State loading
     * @param suffix - Suffix untuk brand (opsional)
     */
    const setTitleWithLoading = (pageName: string, loading: boolean, suffix = defaultSuffix) => {
        useHead({
            title: computed(() => {
                if (loading) {
                    return `Loading ${pageName}... - ${suffix}`
                }
                return `${pageName} - ${suffix}`
            })
        })
    }

    /**
     * Set title dengan SEO meta yang lengkap
     * @param title - Judul halaman
     * @param description - Deskripsi halaman
     * @param keywords - Keywords (opsional)
     * @param suffix - Suffix untuk brand (opsional)
     */
    const setTitleWithSEO = (title: string, description: string, keywords?: string, suffix = defaultSuffix) => {
        const fullTitle = `${title} - ${suffix}`
        
        useSeoMeta({
            title: fullTitle,
            description: description,
            keywords: keywords || `${title.toLowerCase()}, kainnova`,
            ogTitle: fullTitle,
            ogDescription: description,
            ogImage: '/img/og-image.jpg',
            twitterCard: 'summary_large_image',
        })
    }

    return {
        setTitle,
        setTitleWithData,
        setTitleWithCondition,
        setListTitle,
        setDetailTitle,
        setFormTitle,
        setTitleWithLoading,
        setTitleWithSEO
    }
}
