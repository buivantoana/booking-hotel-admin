import { Navigate, useLocation } from "react-router-dom";

const ROLE_ALLOW_PATHS: Record<string, string[]> = {
  accountant: ["/reconciliation"], // chỉ được vào đối soát
  admin: ["*"],
  super_admin: ["*"],
};

const PrivateRouter = ({ children }: any) => {
  const location = useLocation();

  const token = localStorage.getItem("access_token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  const role = user?.role;
  const allowPaths = ROLE_ALLOW_PATHS[role] || [];

  // admin & super_admin → vào tất
  if (allowPaths.includes("*")) {
    return <>{children}</>;
  }

  // accountant → chỉ cho /reconciliation
  const isAllowed = allowPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  if (!isAllowed) {
    return <Navigate to="/reconciliation" replace />;
  }

  return <>{children}</>;
};

export default PrivateRouter;
