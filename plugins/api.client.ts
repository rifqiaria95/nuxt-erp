// plugins/api.client.ts

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Sinkronkan dengan .env dan nuxt.config.ts
  const apiBase = config.public.apiBase || '';
  const authBase = config.public.authBase || '';

  

  // Endpoint helper
  const api = {
    // Auth
    csrfToken   : () => `${authBase}/csrf-token`,
    login       : () => `${authBase}/login`,
    register    : () => `${authBase}/register`,
    logout      : () => `${authBase}/logout`,
    me          : () => `${authBase}/me`,
    refreshToken: () => `${authBase}/refresh-token`,

    // Dashboard
    associations: () => `${apiBase}/associations`,

    // Roles & Permissions
    roles             : () => `${apiBase}/roles`,
    roleStore         : () => `${apiBase}/roles/store`,
    roleUpdate        : (id: number | string) => `${apiBase}/roles/update/${id}`,
    roleShow          : (id: number | string) => `${apiBase}/roles/${id}`,
    roleDelete        : (id: number | string) => `${apiBase}/roles/delete/${id}`,
    getPermissions    : () => `${apiBase}/getPermissions`,
    permissions       : () => `${apiBase}/permissions`,
    permissionOptions : () => `${apiBase}/permissions/options`,
    permissionsBatch  : () => `${apiBase}/permissions/batch`,
    permissionStore   : () => `${apiBase}/permissions`,
    permissionUpdate  : (id: number | string) => `${apiBase}/permissions/${id}`,
    permissionShow    : (id: number | string) => `${apiBase}/permissions/${id}`,
    permissionDelete  : (id: number | string) => `${apiBase}/permissions/${id}`,
    getMenuDetails    : (id: number | string) => `${apiBase}/permissions/getMenuGroupDetails/${id}`,
    getTotalPermission: () => `${apiBase}/permissions/getTotalPermission`,

    // Users
    users          : () => `${apiBase}/users`,
    countTotalUsers: () => `${apiBase}/users/countTotalUsers`,

    // Menu
    menuGroups : () => `${apiBase}/menu-groups`,
    menuGroupsAll: () => `${apiBase}/menu-groups-all`,
    menuDetails: () => `${apiBase}/menu-details`,

    // Jabatan, Perusahaan, Cabang, Divisi, Departemen, Cuti, Pegawai
    jabatan              : () => `${apiBase}/jabatan`,
    countPegawaiByJabatan: () => `${apiBase}/jabatan/countPegawaiByJabatan`,
    perusahaan           : () => `${apiBase}/perusahaan`,
    cabang               : () => `${apiBase}/cabang`,
    divisi               : () => `${apiBase}/divisi`,
    departemen           : () => `${apiBase}/departemen`,
    cuti                 : () => `${apiBase}/cuti`,
    pegawai              : () => `${apiBase}/pegawai`,
    pegawaiUpdate        : (id: number | string) => `${apiBase}/pegawai/update/${id}`,
    pegawaiDelete        : (id: number | string) => `${apiBase}/pegawai/delete/${id}`,
    pegawaiCountByStatus : () => `${apiBase}/pegawai/countByStatus`,

    // Purchase Order
    purchaseOrder          : () => `${apiBase}/purchase-order`,
    approvePurchaseOrder   : (id: number | string) => `${apiBase}/purchase-order/approvePurchaseOrder/${id}`,
    rejectPurchaseOrder    : (id: number | string) => `${apiBase}/purchase-order/rejectPurchaseOrder/${id}`,
    purchaseOrderUpdate    : (id: number | string) => `${apiBase}/purchase-order/update/${id}`,
    getPurchaseOrderDetails: (id: number | string) => `${apiBase}/purchase-order/getPurchaseOrderDetails/${id}`,

    // Purchase Order Item
    purchaseOrderItemUpdateStatusPartial: (id: number | string) => `${apiBase}/purchase-order-item/updateStatusPartial/${id}`,

    // Sales Order
    salesOrder             : () => `${apiBase}/sales-order`,
    countSalesOrderByStatus: () => `${apiBase}/sales-order/countByStatus`,
    approveSalesOrder      : (id: number | string) => `${apiBase}/sales-order/approveSalesOrder/${id}`,
    rejectSalesOrder       : (id: number | string) => `${apiBase}/sales-order/rejectSalesOrder/${id}`,
    salesOrderUpdate       : (id: number | string) => `${apiBase}/sales-order/update/${id}`,
    getSalesOrderDetails   : (id: number | string) => `${apiBase}/sales-order/getSalesOrderDetails/${id}`,

    // Sales Invoice
    salesInvoice          : () => `${apiBase}/sales-invoices`,
    salesInvoiceShow      : (id: number | string) => `${apiBase}/sales-invoices/${id}`,

    // Surat Jalan
    suratJalan          : () => `${apiBase}/surat-jalan`,
    suratJalanShow      : (id: number | string) => `${apiBase}/surat-jalan/${id}`,

    // Sales Order Item
    salesOrderItemUpdateStatusPartial: (id: number | string) => `${apiBase}/sales-order-item/updateStatusPartial/${id}`,

    // Sales Return
    salesReturn          : () => `${apiBase}/sales-return`,
    approveSalesReturn   : (id: number | string) => `${apiBase}/sales-return/approveSalesReturn/${id}`,
    rejectSalesReturn    : (id: number | string) => `${apiBase}/sales-return/rejectSalesReturn/${id}`,
    salesReturnUpdate    : (id: number | string) => `${apiBase}/sales-return/update/${id}`,
    getSalesReturnDetails: (id: number | string) => `${apiBase}/sales-return/getSalesReturnDetails/${id}`,
    getSalesOrderForSalesReturn: (id: number | string) => `${apiBase}/sales-return/get-sales-order/${id}`,

    // Sales Report
    salesReport: () => `${apiBase}/sales-report`,

    // Product
    product: () => `${apiBase}/product`,

    // Stock In & Stock Out
    stockIn                : () => `${apiBase}/stock-in`,
    stock                  : () => `${apiBase}/stock`,
    validateStockBatch     : () => `${apiBase}/stock/validate-batch`,
    getTotalStock          : () => `${apiBase}/stock/getTotalStock`,
    getStockInDetails      : (id: number | string) => `${apiBase}/stock-in/getStockInDetails/${id}`,
    postStockIn            : (id: number | string) => `${apiBase}/stock-in/postStockIn/${id}`,
    countStockIn           : () => `${apiBase}/stock-in/getTotalStockIn`,
    stockOut               : () => `${apiBase}/stock-out`,
    getStockOutDetails     : (id: number | string) => `${apiBase}/stock-out/getStockOutDetails/${id}`,
    postStockOut           : (id: number | string) => `${apiBase}/stock-out/postStockOut/${id}`,
    countStockOut          : () => `${apiBase}/stock-out/getTotalStockOut`,
    stockInDetail          : () => `${apiBase}/stock-in-detail`,
    stockOutDetail         : () => `${apiBase}/stock-out-detail`,
    stockTransfer          : () => `${apiBase}/stock-transfer`,
    countStockTransfer     : () => `${apiBase}/stock-transfer/getTotalStockTransfer`,
    getStockTransferDetails: (id: number | string) => `${apiBase}/stock-transfer/getStockTransferDetails/${id}`,
    cetakStockTransfer     : (id: number | string) => `${apiBase}/stock-transfer/getStockTransferDetails/${id}`,
    postStockTransfer      : (id: number | string) => `${apiBase}/stock-transfer/postStockTransfer/${id}`,
    approveStockTransfer   : (id: number | string) => `${apiBase}/stock-transfer/approveStockTransfer/${id}`,
    rejectStockTransfer    : (id: number | string) => `${apiBase}/stock-transfer/rejectStockTransfer/${id}`,

    // Kategori
    categories            : () => `${apiBase}/categories`,
    countProductByCategory: () => `${apiBase}/categories/countProductByCategory`,

    // Unit
    unit: () => `${apiBase}/unit`,

    // Customer
    customer          : () => `${apiBase}/customer`,
    getCustomerDetails: (id: number | string) => `${apiBase}/customer/getCustomerDetails/${id}`,

    // Warehouse
    warehouse        : () => `${apiBase}/warehouse`,
    getTotalWarehouse: () => `${apiBase}/warehouse/getTotalWarehouse`,

    // Vendor
    vendor: () => `${apiBase}/vendor`,

    // Quotation
    quotation: () => `${apiBase}/quotation`,
    approveQuotation: (id: number | string) => `${apiBase}/quotation/approveQuotation/${id}`,
    rejectQuotation: (id: number | string) => `${apiBase}/quotation/rejectQuotation/${id}`,
    getQuotationDetails: (id: number | string) => `${apiBase}/quotation/getQuotationDetails/${id}`,
  };

  // Inject ke context Nuxt
  return {
    provide: {
      api,
    },
  };
});
