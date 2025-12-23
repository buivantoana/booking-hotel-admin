type typeRole = {
    _id: string;
    name: string;
  };
  type typeRoleValue = Omit<typeRole, "_id">;