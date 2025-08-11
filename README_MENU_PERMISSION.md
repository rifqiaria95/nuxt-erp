# Implementasi Menu Permission

## Overview
Sistem ini mengimplementasikan filtering menu berdasarkan permission user. Menu Group dan Menu Detail akan ditampilkan hanya jika user memiliki permission yang sesuai.

## Cara Kerja

### 1. Permission Naming Convention
- **Menu Group Permission**: `view_{nama_menu_group}`
  - Contoh: `view_purchasing`, `view_hrd`, `view_sales`
- **Menu Detail Permission**: `view_{nama_menu_detail}`
  - Contoh: `view_purchase_order`, `view_vendor`, `view_cuti`

### 2. Filtering Logic

#### Menu Group Filtering
- Menu Group ditampilkan jika user memiliki permission `view_{nama_menu_group}`
- Menu Group "Admin" hanya ditampilkan untuk user dengan role "superadmin"
- Menu Group hanya ditampilkan jika memiliki Menu Detail yang bisa diakses

#### Menu Detail Filtering
- Menu Detail ditampilkan jika user memiliki permission `view_{nama_menu_detail}`
- Menu Detail difilter berdasarkan permission user

### 3. Contoh Implementasi

#### Contoh 1: User dengan permission `view_purchase_order`
**Menu yang ditampilkan:**
```
1. Purchasing
   - Purchase Order
```

**Menu yang TIDAK ditampilkan:**
```
2. HRD
   - Cuti
   - Absensi
3. Sales
   - Sales Order
   - Sales Invoice
```

#### Contoh 2: User dengan permission `view_purchase_order` dan `view_cuti`
**Menu yang ditampilkan:**
```
1. Purchasing
   - Purchase Order
2. HRD
   - Cuti
```

### 4. File yang Dimodifikasi

#### Frontend (Nuxt.js)
1. **`stores/user.ts`**
   - Menambahkan getters: `userPermissions`, `hasPermission`, `hasAnyPermission`

2. **`stores/menu-group.ts`**
   - Menambahkan getter: `filteredMenuGroups`
   - Mengubah `fetchAllMenuGroups()` untuk menggunakan endpoint `menu-groups-all`

3. **`components/Sidebar.vue`**
   - Menggunakan `filteredMenuGroups` dari store
   - Menambahkan watch untuk user store

#### Backend (AdonisJS)
1. **`app/controllers/menu_groups_controller.ts`**
   - Method `getAll()` mengembalikan semua menu groups dengan menu details
   - Method `index()` sudah memfilter berdasarkan permission user

2. **`start/routes.ts`**
   - Route `/menu-groups-all` untuk endpoint tanpa filter permission

### 5. API Endpoints

#### Menu Groups dengan Permission Filter
```
GET /api/menu-groups
```
- Mengembalikan menu groups yang sesuai dengan permission user
- Digunakan untuk halaman admin

#### Menu Groups tanpa Permission Filter
```
GET /api/menu-groups-all
```
- Mengembalikan semua menu groups dengan menu details
- Digunakan untuk sidebar dengan filtering di frontend

### 6. Testing

Untuk menguji implementasi:

1. **Login sebagai user dengan permission terbatas**
   - Contoh: user dengan permission `view_purchase_order` saja

2. **Periksa sidebar**
   - Hanya menu "Purchasing" dengan sub-menu "Purchase Order" yang ditampilkan

3. **Login sebagai superadmin**
   - Semua menu group dan menu detail ditampilkan

### 7. Troubleshooting

#### Menu tidak muncul
1. Periksa permission user di database
2. Pastikan permission naming convention sesuai
3. Periksa console browser untuk error

#### Menu muncul tapi tidak bisa diakses
1. Periksa route permission di backend
2. Pastikan middleware `hasPermission` sudah diterapkan

### 8. Permission Seeder

Permission otomatis dibuat oleh seeder berdasarkan nama menu group dan menu detail:

```typescript
// Menu Group Permission
const permissionName = `view_${menuGroup.name.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`

// Menu Detail Permission
const baseName = menuDetail.name.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')
permissionsToCreate.push({ name: `view_${baseName}` })
```

### 9. Contoh Permission yang Dibuat

Berdasarkan contoh menu:
- `view_purchasing`
- `view_purchase_order`
- `view_vendor`
- `view_hrd`
- `view_cuti`
- `view_absensi`
- `view_sales`
- `view_sales_order`
- `view_sales_invoice`
