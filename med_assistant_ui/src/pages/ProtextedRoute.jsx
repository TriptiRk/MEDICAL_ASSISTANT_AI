import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, children }) {
  if (!user?.is_staff) {
    return <Navigate to="/not-authorized" replace />;
  }
  return children;
}
