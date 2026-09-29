import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Guards routes that require an authenticated user.
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="container">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
