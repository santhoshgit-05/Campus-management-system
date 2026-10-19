import { Outlet, useNavigate } from "react-router-dom";
import {
	Bell,
	BookOpenCheck,
	Bus,
	CalendarDays,
	ClipboardCheck,
	GraduationCap,
	House,
	LayoutDashboard,
	LogOut,
	UserRound,
	WalletCards,
} from "lucide-react";
import { ROLE_CONFIG } from "../config/roleConfig.js";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import "./RolePortalLayout.css";

const navigationByRole = {
	student: [
		["Overview", "#overview", LayoutDashboard], ["My profile", "#profile", UserRound],
		["Attendance", "#attendance", ClipboardCheck], ["Timetable", "#timetable", CalendarDays],
		["Results", "#results", BookOpenCheck], ["Fees", "#fees", WalletCards],
		["Notices", "#announcements", Bell], ["Campus", "#campus", Bus], ["Housing", "#campus", House],
	],
	faculty: [
		["Overview", "#overview", LayoutDashboard], ["My profile", "#profile", UserRound],
		["My classes", "#classes", GraduationCap], ["Timetable", "#timetable", CalendarDays],
		["Attendance", "#attendance", ClipboardCheck],
	],
	collegeAdmin: [["Overview", "#overview", LayoutDashboard]],
	otherStaff: [["Overview", "#overview", LayoutDashboard]],
};

export default function RolePortalLayout({ role }) {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const roleConfig = ROLE_CONFIG[role];

	function handleLogout() {
		logout();
		navigate("/", { replace: true });
	}

	return (
		<div className={`role-portal role-portal-${role}`}>
			<a className="role-portal-skip" href="#portal-content">Skip to content</a>
			<header className="role-portal-header">
				<div className="role-portal-brand"><span className="role-portal-brand-mark">C</span><span><strong>Campus</strong><small>{roleConfig.label} portal</small></span></div>
				<nav className="role-portal-nav" aria-label={`${roleConfig.label} navigation`}>
					{navigationByRole[role].map(([label, href, Icon]) => <a href={href} key={label}><Icon size={15} aria-hidden="true" /><span>{label}</span></a>)}
				</nav>
				<div className="role-portal-account"><ThemeToggle className="role-portal-theme-toggle" /><span className="role-portal-user"><strong>{roleConfig.label}</strong><small>{user?.id}</small></span><button aria-label="Log out" onClick={handleLogout} type="button"><LogOut size={17} /><span>Log out</span></button></div>
			</header>
			<div className="role-portal-content" id="portal-content"><Outlet /></div>
		</div>
	);
}