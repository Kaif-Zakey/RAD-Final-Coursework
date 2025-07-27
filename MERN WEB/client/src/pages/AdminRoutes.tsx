import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.tsx";
import { useAuth } from "../context/useAuth.ts";

const AdminRoutes = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/" />;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 text-gray-100 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminRoutes;
