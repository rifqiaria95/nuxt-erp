import { storeToRefs } from 'pinia';
import { useUserStore } from '~/stores/user';

export const usePermissions = () => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const userHasPermission = (permissionName: string): boolean => {
    if (!user.value || !user.value.roles) {
      return false;
    }
    for (const role of user.value.roles as any[]) {
      if (role.permissions && Array.isArray(role.permissions)) {
        if (role.permissions.some((p: any) => p.name === permissionName)) {
          return true;
        }
      }
    }

    return false;
  };

  return {
    userHasPermission,
  };
}; 