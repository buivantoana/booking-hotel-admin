type typePermission = {
    _id: string;
    name: string;
  };
  type typePermissionValue = Omit<typePermission, "_id">;