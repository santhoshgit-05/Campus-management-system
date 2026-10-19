import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import "./Navbar.css";

export default function Navbar({ onMenuClick }) {
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	function handleLogout() {
		logout();
		navigate("/", { replace: true });
	}

	return (
		<header className="admin-topbar">
			<div className="admin-topbar-leading">
				<button className="admin-menu-button" onClick={onMenuClick} type="button" aria-label="Open navigation menu">
					<Menu size={19} />
				</button>
				<div className="admin-topbar-heading">
					<span>Campus Management</span>
					<strong>Administration</strong>
				</div>
			</div>

			<div className="admin-topbar-actions">
				<ThemeToggle className="admin-theme-toggle" />
				<button
					className="admin-icon-button admin-notifications-button"
					onClick={() => navigate("/notifications")}
					type="button"
					aria-label="Open notifications"
				>
					<Bell size={18} />
					<span aria-hidden="true" />
				</button>
				<div className="admin-profile">
					<div className="admin-profile-avatar" aria-hidden="true">AD</div>
					<div className="admin-profile-copy">
						<strong>{user?.id ?? "Admin"}</strong>
						<span>Administrator · Demo</span>
					</div>
				</div>
				<button className="admin-icon-button admin-logout-button" onClick={handleLogout} type="button" aria-label="Log out">
					<LogOut size={17} />
				</button>
			</div>
		</header>
	);
}
