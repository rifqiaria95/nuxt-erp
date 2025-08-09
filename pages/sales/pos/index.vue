<template>
    <div>
        <nav class="navbar navbar-custom d-flex flex-wrap justify-content-between align-items-center">
            <a class="navbar-brand text-white fw-semibold fs-5 mb-0">Kainnova Digital Solutions</a>
            <form class="d-flex align-items-center gap-3 mt-3 mt-md-0">
                <div class="position-relative">
                    <input class="form-control" type="search" placeholder="Find Products" aria-label="Search" v-model="productSearchQuery" />
                    <i class="fas fa-search position-absolute"
                        style="left: 12px; top: 50%; transform: translateY(-50%); font-size: 0.75rem; color: white;"></i>
                </div>
                <button type="button" class="icon-btn" aria-label="Notifications">
                    <i class="fas fa-bell"></i>
                    <span class="notification-dot"></span>
                </button>
                <button type="button" class="icon-btn" aria-label="User Profile">
                    <i class="fas fa-user"></i>
                </button>
                <button type="button" class="icon-btn" aria-label="Toggle Theme">
                    <i class="fas fa-sun"></i>
                </button>
                <button type="button" class="btn btn-primary px-3 py-2 fw-semibold">
                    New Goal
                </button>
            </form>
        </nav>

        <main class="container my-4 d-flex flex-lg-row flex-column px-20 gap-4">
            <section class="flex-grow-1">
                <div class="d-flex flex-column align-items-center w-100">
                    <nav class="category-nav d-flex mb-4 flex-wrap justify-content-center" style="width: 100%;">
                        <button class="category-btn active" type="button">
                            <img src="https://storage.googleapis.com/a1aa/image/bf1b63b5-ca10-495f-45e5-30feb47fa60b.jpg"
                                alt="Plate of spaghetti with fork icon" />
                            <div>Lunch</div>
                            <div class="category-subtext">8 Options</div>
                        </button>
                        <button class="category-btn" type="button">
                            <img src="https://storage.googleapis.com/a1aa/image/967eaac6-3bc2-49d9-30da-55bbaced9692.jpg"
                                alt="Bowl of salad icon" />
                            <div>Salad</div>
                            <div class="category-subtext">14 Salads</div>
                        </button>
                        <button class="category-btn" type="button">
                            <img src="https://storage.googleapis.com/a1aa/image/67a2564b-e29a-4fd9-0dab-08bfa4f8ee37.jpg"
                                alt="Burger icon" />
                            <div>Burger</div>
                            <div class="category-subtext">5 Burgers</div>
                        </button>
                        <button class="category-btn" type="button">
                            <img src="https://storage.googleapis.com/a1aa/image/04505586-79e5-4b7f-d082-e1af7819676d.jpg"
                                alt="Coffee cup icon" />
                            <div>Coffee</div>
                            <div class="category-subtext">7 Beverages</div>
                        </button>
                        <button class="category-btn" type="button">
                            <img src="https://storage.googleapis.com/a1aa/image/54949dd3-ee31-455a-8c18-c1842dd646f8.jpg"
                                alt="Slice of cake icon" />
                            <div>Dessert</div>
                            <div class="category-subtext">8 Desserts</div>
                        </button>
                        <button class="category-btn" type="button">
                            <img src="https://storage.googleapis.com/a1aa/image/54949dd3-ee31-455a-8c18-c1842dd646f8.jpg"
                                alt="Slice of cake icon" />
                            <div>Dessert</div>
                            <div class="category-subtext">8 Desserts</div>
                        </button>
                    </nav>

                    <div class="article-row row g-4 justify-content-center" style="width: 100%;">
                        <div class="card mt-5 mb-5 col-12" style="max-width: 1200px;">
                            <div class="card-header">
                                <h2 class="fw-bold" style="font-size: 1.1rem;">Pilih Perusahaan, Cabang, Gudang, dan Pelanggan</h2>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <input type="hidden" v-model="form.up" class="form-control">
                                    <input type="hidden" v-model="form.date" class="form-control">
                                    <input type="hidden" v-model="form.dueDate" class="form-control">
                                    <div class="col-md-4">
                                        <v-select v-model="form.perusahaanId" :options="perusahaans" label="nmPerusahaan" :reduce="p => p.id" placeholder="Pilih Perusahaan" class="v-select-style"/>
                                    </div>
                                    <div class="col-md-4">
                                        <v-select v-model="form.cabangId" :options="filteredCabangs" label="nmCabang" :reduce="c => c.id" placeholder="Pilih Cabang" class="v-select-style"/>
                                    </div>
                                    <div class="col-md-4">
                                        <v-select v-model="form.warehouseId" :options="warehouses"
                                        :get-option-label="w => `${w.name} (${w.code})`" :reduce="w => w.id" placeholder="Pilih Gudang" class="v-select-style"/>
                                    </div>
                                </div>
                                <div class="row mt-5">
                                    <div class="col-md-4">
                                        <v-select v-model="form.customerId" :options="customers" label="name" :reduce="c => c.id" placeholder="Pilih Pelanggan" class="v-select-style"/>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-floating form-floating-outline">
                                            <input type="number" v-model="form.discountPercent" class="form-control" placeholder="Discount (%)">
                                            <label>Discount(%)</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-floating form-floating-outline">
                                            <input type="number" v-model="form.taxPercent" class="form-control" placeholder="Tax (%)">
                                            <label>Tax(%)</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="row flex-column justify-content-center align-items-center mt-10">
                                    <h2 class="fw-bold" style="font-size: 1.1rem;">Daftar Produk</h2>
                                    <div class="product-slider-container">
                                        <button @click="prevPage" :disabled="isFirstPage" class="slider-arrow prev-arrow">‹</button>
                                        <div class="article-row row g-4 g-lg-3 px-5">
                                            <article class="product-card col-6 col-sm-4 col-lg-3 col-md-3 mb-5" v-for="product in products" :key="product.id">
                                                <div class="card-custom" @click="toggleProductInOrder(product)" :class="{ 'selected': isProductInOrder(product.id) }" style="margin-bottom: 0;">
                                                    <div class="img-wrapper">
                                                        <img 
                                                            :src="getProductImage(product.image) || '/img/branding/logo.png'" 
                                                            alt="Product Image" 
                                                            style="height: 120px; max-width: 120px; object-fit: contain;" 
                                                            @error="event => event.target.src = '/img/branding/logo.png'"
                                                        />
                                                    </div>
                                                    <h6>{{ product.name }}</h6>
                                                    <p class="kategori">{{ product.category.name }}</p>
                                                    <p class="price">{{ formatRupiah(product.priceSell) }}</p>
                                                    <p class="stock">Stock: {{ getProductStock(product) }}</p>
                                                    <div v-if="isProductInOrder(product.id)" class="selected-indicator">
                                                        <i class="fas fa-check-circle"></i>
                                                    </div>
                                                </div>
                                            </article>
                                        </div>
                                        <button @click="nextPage" :disabled="isLastPage" class="slider-arrow next-arrow">›</button>
                                    </div>

                                    <div v-if="!productLoading && !products.length" class="col-12 text-center mt-5">
                                        <p>Tidak ada produk yang tersedia di gudang ini.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-center mt-4" v-if="!productLoading && products.length > 0">
                        <Paginator
                            :rows="productParams.rows"
                            :totalRecords="totalProducts"
                            :rowsPerPageOptions="[9, 18, 27]"
                            @page="onProductPage"
                            :first="productParams.first"
                        ></Paginator>
                    </div>
                </div>
            </section>

            <aside>
                <div class="order-card">
                    <div class="order-header d-flex justify-content-between align-items-center">
                        <h2>Current Order</h2>
                        <button class="btn-clear" @click="clearOrder">Clear All</button>
                    </div>
                    <ul class="order-list mt-5 mb-5">
                        <li class="d-flex justify-content-between align-items-center mb-3 mt-3" v-for="(item, index) in currentOrderItems" :key="item.productId">
                            <div class="item-info">
                                <img 
                                    :src="item.product && item.product.image ? `${config.public.baseURL}/${item.product.image}` : '/img/branding/logo.png'" 
                                    :alt="item.product && item.product.name ? item.product.name : 'Logo'" 
                                    @error="event => event.target.src = '/img/branding/logo.png'"
                                    class="img-fluid"
                                />
                                <div class="item-details">
                                    <span class="item-name">{{ item.product?.name }}</span><br>
                                    <span class="item-price">{{ formatRupiah(item.quantity * item.price) }}</span>
                                </div>
                            </div>
                            <div class="quantity-controls d-flex justify-content-center align-items-center">
                                <button @click="decreaseQuantity(index)" aria-label="Decrease quantity">−</button>
                                <span>{{ item.quantity }}</span>
                                <button @click="increaseQuantity(index)" aria-label="Increase quantity">+</button>
                            </div>
                        </li>
                        <li v-if="currentOrderItems.length === 0" class="text-center w-100">
                            <p>No items in order.</p>
                        </li>
                    </ul>
                    <div class="order-summary mt-5 mb-5">
                        <div>
                            <span>Subtotal</span>
                            <span>{{ formatRupiah(subtotal) }}</span>
                        </div>
                        <div>
                            <span>Discounts</span>
                            <span>-{{ formatRupiah(discountAmount) }}</span>
                        </div>
                        <div>
                            <span>Tax({{ form.taxPercent || 0 }}%)</span>
                            <span>{{ formatRupiah(taxAmount) }}</span>
                        </div>
                        <div class="total">
                            <span>Total</span>
                            <span>{{ formatRupiah(total) }}</span>
                        </div>
                    </div>
                    <div class="payment-methods">
                        <h5>Payment Method</h5>
                        <div class="d-flex 2 justify-content-center gap-2">
                            <button class="payment-btn" @click="form.paymentMethod = 'cash'" :class="{ active: form.paymentMethod === 'cash' }">
                                <i class="ri-cash-line"></i>
                                <span>Cash</span>
                            </button>
                            <button class="payment-btn" @click="form.paymentMethod = 'card'" :class="{ active: form.paymentMethod === 'card' }">
                                <i class="ri-bank-card-line"></i>
                                <span>Card</span>
                            </button>
                            <button class="payment-btn" @click="form.paymentMethod = 'transfer'" :class="{ active: form.paymentMethod === 'transfer' }">
                                <i class="ri-exchange-dollar-line"></i>
                                <span>Transfer</span>
                            </button>
                        </div>
                    </div>
                    <button class="btn-print" type="button" @click="saveBills" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        {{ loading ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                </div>
            </aside>
        </main>
    </div>
</template>

<script setup>
    definePageMeta({
        layout: 'pos',
    })

    import { ref, computed, onMounted, watch } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useSalesOrderStore } from '~/stores/sales-order'
    import { useCustomerStore } from '~/stores/customer'
    import { usePerusahaanStore } from '~/stores/perusahaan'
    import { useCabangStore } from '~/stores/cabang'
    import { useProductStore } from '~/stores/product'
    import { useWarehouseStore } from '~/stores/warehouse'
    import { useStocksStore } from '~/stores/stocks'
    import { useUserStore } from '~/stores/user'
    import vSelect from 'vue-select'
    import Dropdown from 'primevue/dropdown'
    import Paginator from 'primevue/paginator';
    import Column from 'primevue/column'
    import InputText from 'primevue/inputtext'
    import 'vue-select/dist/vue-select.css'
    import { useDebounceFn } from '@vueuse/core'
    import { useRouter } from 'vue-router'
    import Swal from 'sweetalert2'

    const config = useRuntimeConfig();
    const router = useRouter();

    // Store
    const myDataTableRef                     = ref(null)
    const salesOrderStore                    = useSalesOrderStore()
    const customerStore                      = useCustomerStore()
    const perusahaanStore                    = usePerusahaanStore()
    const warehouseStore                     = useWarehouseStore()
    const cabangStore                        = useCabangStore()
    const productStore                       = useProductStore()
    const stockStore                         = useStocksStore()
    const userStore                          = useUserStore()
    const formatRupiah                       = useFormatRupiah()

    const { salesOrders, loading, totalRecords, params, form, isEditMode, showModal, validationErrors, customerProducts } = storeToRefs(salesOrderStore)
    const { customers }   = storeToRefs(customerStore)
    const { perusahaans } = storeToRefs(perusahaanStore)
    const { cabangs }     = storeToRefs(cabangStore)
    const { warehouses }  = storeToRefs(warehouseStore)
    const { products, loading: productLoading, totalRecords: totalProducts, params: productParams }    = storeToRefs(productStore)
    const { user }        = storeToRefs(userStore)

    // State
    const productSearchQuery = ref('');
    const globalFilterValue = ref('');
    const attachmentPreview = ref(null);

    const getProductImage = (imagePath) => {
        if (!imagePath || typeof imagePath !== 'string') {
            return null;
        }
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        if (!config.public.apiBase) {
            return imagePath;
        }
        const origin = new URL(config.public.apiBase).origin;
        const imageUrl = `${origin}/${imagePath}`;
        return imageUrl;
    };

    const getProductStock = (product) => {
        if (!product.stocks || product.stocks.length === 0) {
            return 0;
        }
        
        // Jika ada warehouse yang dipilih, tampilkan stok untuk warehouse tersebut
        if (form.value.warehouseId) {
            const warehouseStock = product.stocks.find(stock => stock.warehouseId === form.value.warehouseId);
            return warehouseStock ? Math.floor(warehouseStock.quantity) : 0;
        }
        
        // Jika tidak ada warehouse yang dipilih, tampilkan total stok dari semua warehouse
        const totalStock = product.stocks.reduce((total, stock) => total + Number(stock.quantity), 0);
        return Math.floor(totalStock);
    };

    const isProductInOrder = (productId) => {
        return form.value.salesOrderItems && form.value.salesOrderItems.some(item => item.productId === productId);
    };

    const toggleProductInOrder = (product) => {
        if (!form.value.salesOrderItems) {
            form.value.salesOrderItems = [];
        }
        const itemIndex = form.value.salesOrderItems.findIndex(item => item.productId === product.id);

        if (itemIndex > -1) {
            salesOrderStore.removeItem(itemIndex);
        } else {
            const stockQty = getProductStock(product);
            if (stockQty > 0) {
                form.value.salesOrderItems.push({
                    productId: product.id,
                    quantity: 1,
                    price: product.priceSell || 0,
                    description: '',
                    subtotal: product.priceSell || 0,
                });
            } else {
                toast.fire({
                    icon: 'warning',
                    title: 'Produk ini kehabisan stok.',
                });
            }
        }
    };

    const increaseQuantity = (index) => {
        const item = form.value.salesOrderItems[index];
        const product = products.value.find(p => p.id === item.productId);

        if (product) {
            const stockQty = getProductStock(product);
            if (item.quantity < stockQty) {
                item.quantity++;
            } else {
                toast.fire({
                    icon: 'warning',
                    title: 'Jumlah melebihi stok yang tersedia.',
                });
            }
        } else {
            item.quantity++; // Fallback if stock info is not available
        }
        calculateSubtotal(index);
    };

    const decreaseQuantity = (index) => {
        const item = form.value.salesOrderItems[index];
        item.quantity--;
        if (item.quantity <= 0) {
            salesOrderStore.removeItem(index);
        } else {
            calculateSubtotal(index);
        }
    };

    const currentOrderItems = computed(() => {
        if (!form.value.salesOrderItems) return [];
        return form.value.salesOrderItems.map(item => {
            const product = products.value.find(p => p.id === item.productId);
            return {
                ...item,
                product: product,
            };
        }).filter(item => item.product);
    });
    
    const subtotal = computed(() => {
        return currentOrderItems.value.reduce((total, item) => total + (item.quantity * item.price), 0);
    });

    const discountAmount = computed(() => {
        const discountPercent = Number(form.value.discountPercent) || 0;
        return subtotal.value * (discountPercent / 100);
    });

    const taxAmount = computed(() => {
        const taxPercent = Number(form.value.taxPercent) || 0;
        return (subtotal.value - discountAmount.value) * (taxPercent / 100);
    });

    const total = computed(() => {
        return subtotal.value - discountAmount.value + taxAmount.value;
    });

    const clearOrder = () => {
        form.value.salesOrderItems = [];
    };

    const saveBills = async () => {
        

        if (!form.value.perusahaanId || !form.value.cabangId || !form.value.warehouseId || !form.value.customerId) {
            toast.fire({
                icon: 'error',
                title: 'Harap lengkapi pilihan Perusahaan, Cabang, Gudang, dan Pelanggan.',
            });
            return;
        }

        if (!form.value.salesOrderItems || form.value.salesOrderItems.length === 0) {
            toast.fire({
                icon: 'error',
                title: 'Tidak ada item dalam pesanan.',
            });
            return;
        }
        
        if (!form.value.paymentMethod) {
            toast.fire({
                icon: 'error',
                title: 'Harap pilih metode pembayaran.',
            });
            return;
        }

        // Add warehouseId to each item before saving
        const warehouseId = form.value.warehouseId;
        form.value.salesOrderItems.forEach(item => {
            item.warehouseId = warehouseId;
        });

        await salesOrderStore.saveSalesOrder();

        if (salesOrderStore.validationErrors.length === 0) {
            clearOrder();
            form.value.perusahaanId = null;
            form.value.cabangId = null;
            form.value.warehouseId = null;
            form.value.customerId = null;
            form.value.paymentMethod = '';
            toast.fire({
                icon: 'success',
                title: 'Pesanan berhasil disimpan.',
            });
        } else {
            toast.fire({
                icon: 'error',
                title: 'Terjadi kesalahan saat menyimpan pesanan.',
            });
        }
    };

    const grandTotal = computed(() => {
    if (!form.value || !form.value.salesOrderItems) return 0;
    
    const totalItems = form.value.salesOrderItems.reduce((total, item) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.price) || 0;
        return total + (quantity * unitPrice);
    }, 0);

    const discountPercent = Number(form.value.discountPercent) || 0;
    const taxPercent = Number(form.value.taxPercent) || 0;

    const discountAmount = totalItems * (discountPercent / 100);
    const totalAfterDiscount = totalItems - discountAmount;
    const taxAmount = totalAfterDiscount * (taxPercent / 100);

    return totalAfterDiscount + taxAmount;
    });

    const paymentMethodOptions = [
        { label: 'Cash', value: 'cash' }, { label: 'Transfer', value: 'transfer' },
        { label: 'QRIS', value: 'qris' }, { label: 'Card', value: 'card' }
    ];

    let modalInstance = null;
    onMounted(() => {
        salesOrderStore.resetForm('pos');
        const today = new Date().toISOString().split('T')[0];
        form.value.date = today;
        form.value.dueDate = today;

        

        salesOrderStore.fetchSalesOrders();
        customerStore.fetchCustomers();
        perusahaanStore.fetchPerusahaans();
        cabangStore.fetchCabangs();
        productStore.params.rows = 9;
        productStore.fetchProducts();
        warehouseStore.fetchWarehouses();
        userStore.loadUser();

        const modalElement = document.getElementById('SalesOrderModal')
        if (modalElement) {
            modalInstance = new bootstrap.Modal(modalElement)
        }
    });

    watch(() => form.value.perusahaanId, (newPerusahaanId) => {
        if (newPerusahaanId) {
            const selectedCompany = perusahaans.value.find(p => p.id === newPerusahaanId);
            if (selectedCompany) {
                form.value.up = selectedCompany.nmPerusahaan;
            }
            if(!isEditMode.value) {
                form.value.cabangId = null;
            }
        } else {
            form.value.up = '';
        }
    });

    watch(() => form.value.customerId, (newCustomerId, oldCustomerId) => {
    if (newCustomerId && oldCustomerId && newCustomerId !== oldCustomerId) {
        salesOrderStore.fetchProductsForCustomer(newCustomerId);
        
        form.value.salesOrderItems = [];
        salesOrderStore.addItem();
    } else if (newCustomerId && !oldCustomerId) {
        salesOrderStore.fetchProductsForCustomer(newCustomerId);
    } else if (!newCustomerId) {
        salesOrderStore.customerProducts = [];
        form.value.salesOrderItems = [];
        salesOrderStore.addItem();
    }
    });

    watch(() => salesOrderStore.customerProducts, (newProducts) => {
    if (form.value.salesOrderItems && newProducts) {
        form.value.salesOrderItems.forEach(item => {
        const productExists = newProducts.some(p => p.id === item.productId);
        if (!productExists) {
            item.productId = null;
            item.price = 0;
            item.quantity = 1;
            item.subtotal = 0;
        }
        });
    }
    }, { deep: true });

    watch(() => form.value.warehouseId, (newWarehouseId) => {
        if (newWarehouseId) {
            productStore.setWarehouseFilter(newWarehouseId);
        } else {
            productStore.setWarehouseFilter(null);
        }
    });

    const filteredCabangs = computed(() => {
        if (!form.value.perusahaanId || !cabangs.value) return [];
        return cabangs.value.filter(c => c.perusahaanId === form.value.perusahaanId);
    });

    const debouncedProductSearch = useDebounceFn(() => {
        productStore.setSearch(productSearchQuery.value);
    }, 500);
    watch(productSearchQuery, debouncedProductSearch);

    const debouncedSearch = useDebounceFn(() => {
        salesOrderStore.setSearch(globalFilterValue.value)
    }, 500)
    watch(globalFilterValue, debouncedSearch);

    const onPage = (event) => salesOrderStore.setPagination(event);
    const handleRowsChange = () => {
        params.value.first = 0;
        salesOrderStore.fetchSalesOrders();
    };

    const onProductPage = (event) => {
        productParams.value.first = event.first;
        productParams.value.rows = event.rows;
        productStore.fetchProducts();
    };

    const isFirstPage = computed(() => productParams.value.first === 0);

    const isLastPage = computed(() => {
        const total = totalProducts.value;
        const { first, rows } = productParams.value;
        return first + rows >= total;
    });

    const nextPage = () => {
        if (!isLastPage.value) {
            productParams.value.first += productParams.value.rows;
            productStore.fetchProducts();
        }
    };

    const prevPage = () => {
        if (!isFirstPage.value) {
            productParams.value.first -= productParams.value.rows;
            productStore.fetchProducts();
        }
    };

    const exportData = (format) => {
        if (format === 'csv') myDataTableRef.value.exportCSV();
    };

    function onFileChange(e) {
    const file = e.target.files[0];
    if (file) {
        form.value.attachment = file;
        attachmentPreview.value = URL.createObjectURL(file);
    } else {
        form.value.attachment = null;
        attachmentPreview.value = null;
    }
    }

    const onProductChange = (index) => {
    const selectedProductId = form.value.salesOrderItems[index].productId;
    const selectedProduct = customerProducts.value.find(p => p.id === selectedProductId);

    if (selectedProduct) {
        const item = form.value.salesOrderItems[index];
        item.price = Number(selectedProduct.priceSell) || 0;
        calculateSubtotal(index);
        updateStockInfo(index)
    }
    };

    const onQuantityChange = (index) => {
    calculateSubtotal(index);
    };

    const calculateSubtotal = (index) => {
    const item = form.value.salesOrderItems[index];
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.price) || 0;
    item.subtotal = quantity * unitPrice;
    };

    const updateStockInfo = async (index) => {
        const item = form.value.salesOrderItems[index]
        if (item.productId && item.warehouseId) {
            try {
                stockStore.params.search = '' // Reset search if any
                stockStore.params.rows = 1 // We only need one record
                const response = await stockStore.fetchStocksPaginated({
                    productId: item.productId,
                    warehouseId: item.warehouseId,
                })
                if (response && response.data && response.data.length > 0) {
                    item.stock = response.data[0]
                } else {
                    item.stock = { quantity: 0 }
                }
            } catch (error) {
                console.error('Failed to fetch stock info:', error)
                item.stock = { quantity: 0 }
            }
        } else {
            item.stock = { quantity: 0 }
        }
    }
</script>