import { storeToRefs } from 'pinia';
import { useUserStore } from '~/stores/user';

export const usePermissions = () => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const userHasPermission = (permissionName: string): boolean => {
    if (!user.value || !user.value.roles) {
      return false;
    }
    // Dapatkan semua nama permission dari semua role
    const permissions = user.value.roles.flatMap(role => role.permissions?.map((p: { name: string }) => p.name) || []);
    return permissions.includes(permissionName);
  };

  const userHasRole = (roleName: string): boolean => {
    return user.value?.roles?.some(role => role.name === roleName) || false;
  };

  return {
    userHasPermission,
    userHasRole,
  };
}; 