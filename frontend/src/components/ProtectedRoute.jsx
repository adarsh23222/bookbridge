import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-[#A1A1AA]">
      <div className="text-center">
        <div className="font-serif text-3xl mb-2">Loading…</div>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
