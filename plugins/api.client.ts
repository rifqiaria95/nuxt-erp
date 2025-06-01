// plugins/api.client.ts

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Sinkronkan dengan .env dan nuxt.config.ts
  const apiBase = config.public.apiBase || '';
  const authBase = config.public.authBase || '';

  // Endpoint helper
  const api = {
    // Auth
    csrfToken: () => `${authBase}/csrf-token`,
    login: () => `${authBase}/login`,
    register: () => `${authBase}/register`,
    logout: () => `${authBase}/logout`,
    me: () => `${authBase}/me`,
    refreshToken: () => `${authBase}/refresh-token`,

    // Roles & Permissions
    roles: () => `${apiBase}/roles`,
    roleStore: () => `${apiBase}/roles/store`,
    roleUpdate: (id: number | string) => `${apiBase}/roles/update/${id}`,
    roleShow: (id: number | string) => `${apiBase}/roles/${id}`,
    roleDelete: (id: number | string) => `${apiBase}/roles/delete/${id}`,
    getPermissions: () => `${apiBase}/getPermissions`,
    permissions: () => `${apiBase}/permissions`,
    permissionOptions: () => `${apiBase}/permissions/options`,
    permissionsBatch: () => `${apiBase}/permissions/batch`,
    permissionStore: () => `${apiBase}/permissions`,
    permissionUpdate: (id: number | string) => `${apiBase}/permissions/${id}`,
    permissionShow: (id: number | string) => `${apiBase}/permissions/${id}`,
    permissionDelete: (id: number | string) => `${apiBase}/permissions/${id}`,
    getMenuDetails: (id: number | string) => `${apiBase}/permissions/getMenuGroupDetails/${id}`,

    // Users
    users: () => `${apiBase}/users`,

    // Menu
    menuGroups: () => `${apiBase}/menu-groups`,
    menuDetails: () => `${apiBase}/menu-details`,

    // Jabatan, Perusahaan, Cabang, Divisi, Departemen, Cuti, Pegawai
    jabatan: () => `${apiBase}/jabatan`,
    perusahaan: () => `${apiBase}/perusahaan`,
    cabang: () => `${apiBase}/cabang`,
    divisi: () => `${apiBase}/divisi`,
    departemen: () => `${apiBase}/departemen`,
    cuti: () => `${apiBase}/cuti`,
    pegawai: () => `${apiBase}/pegawai`,
    pegawaiUpdate: (id: number | string) => `${apiBase}/pegawai/update/${id}`,
    pegawaiDelete: (id: number | string) => `${apiBase}/pegawai/delete/${id}`,
  };

  // Inject ke context Nuxt
  return {
    provide: {
      api,
    },
  };
});
