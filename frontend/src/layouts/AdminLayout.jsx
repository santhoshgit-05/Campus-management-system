import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "./AdminLayout.css";

export default function AdminLayout() {
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

	function closeMobileNav() {
		setIsMobileNavOpen(false);
	}

	return (
		<div className="admin-shell">
			<Sidebar isOpen={isMobileNavOpen} onClose={closeMobileNav} />
			<div className="admin-shell-main">
				<Navbar onMenuClick={() => setIsMobileNavOpen((isOpen) => !isOpen)} />
				<div className="admin-shell-content">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
