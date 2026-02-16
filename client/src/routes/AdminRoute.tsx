import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { LoadingPage } from "../components/common/LoadingPage";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    if (user) {
      // If user exists but is not admin, logout and redirect to login
      logout();
    }
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
