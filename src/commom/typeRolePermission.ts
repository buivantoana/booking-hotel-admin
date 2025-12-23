type typeRolePermission = {
    _id: string;
    role_id: string;
    permission:[string]
  };
  type typeRolePermissionValue = Omit<typeRolePermission, "_id">;