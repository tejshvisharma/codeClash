import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { Loader } from "lucide-react"; // 

const AdminRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  // While checking auth, show loader
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // If not authenticated OR not admin → redirect
  if (!authUser || authUser.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render protected content
  return <Outlet />;
};

export default AdminRoute;
