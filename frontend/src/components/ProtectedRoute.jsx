import { Navigate, Outlet } from "react-router-dom";
import { ROLE_CONFIG } from "../config/roleConfig.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ allowedRoles, children }) {
	const { user } = useAuth();

	if (!user) return <Navigate to="/" replace />;
	if (allowedRoles && !allowedRoles.includes(user.role)) {
		return <Navigate to={ROLE_CONFIG[user.role]?.dashboardPath ?? "/"} replace />;
	}

	return children ?? <Outlet />;
}
