// plugins/api.client.ts

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Base URLs
  const apiBaseUrl = config.public.apiBaseUrl || '';
  const authBaseUrl = config.public.authBaseUrl || '';

  // Endpoint helper
  const api = {
    // Auth
    csrfToken: () => `${apiBaseUrl}${authBaseUrl}/csrf-token`,
    login: () => `${apiBaseUrl}${authBaseUrl}/login`,
    register: () => `${apiBaseUrl}${authBaseUrl}/register`,
    logout: () => `${apiBaseUrl}${authBaseUrl}/logout`,
    me: () => `${apiBaseUrl}${authBaseUrl}/me`,

    // Roles & Permissions
    roles: () => `${apiBaseUrl}/api/roles`,
    roleStore: () => `${apiBaseUrl}/api/roles/store`,
    roleUpdate: (id: number | string) => `${apiBaseUrl}/api/roles/update/${id}`,
    roleShow: (id: number | string) => `${apiBaseUrl}/api/roles/${id}`,
    roleDelete: (id: number | string) => `${apiBaseUrl}/api/roles/${id}`,
    getPermissions: () => `${apiBaseUrl}/api/getPermissions`,
    permissions: () => `${apiBaseUrl}/api/permissions`,
    permissionsBatch: () => `${apiBaseUrl}/api/permissions/batch`,

    // Users
    users: () => `${apiBaseUrl}/api/users`,

    // Menu
    menuGroups: () => `${apiBaseUrl}/api/menu-groups`,
    menuDetails: () => `${apiBaseUrl}/api/menu-details`,

    // Jabatan, Perusahaan, Cabang, Divisi, Departemen, Cuti, Pegawai
    jabatan: () => `${apiBaseUrl}/api/jabatan`,
    perusahaan: () => `${apiBaseUrl}/api/perusahaan`,
    cabang: () => `${apiBaseUrl}/api/cabang`,
    divisi: () => `${apiBaseUrl}/api/divisi`,
    departemen: () => `${apiBaseUrl}/api/departemen`,
    cuti: () => `${apiBaseUrl}/api/cuti`,
    pegawai: () => `${apiBaseUrl}/api/pegawai`,
  };

  // Inject ke context Nuxt
  return {
    provide: {
      api,
    },
  };
});
