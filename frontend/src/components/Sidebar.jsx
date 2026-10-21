import { NavLink } from "react-router-dom";
import {
	Bell,
	BookOpen,
	BriefcaseBusiness,
	Building2,
	Bus,
	CalendarClock,
	CalendarDays,
	ChartNoAxesCombined,
	ClipboardCheck,
	CreditCard,
	FileText,
	GraduationCap,
	House,
	LayoutDashboard,
	Library,
	MessageSquare,
	PartyPopper,
	Settings,
	Utensils,
	Users,
	UserRoundCheck,
	X,
} from "lucide-react";
import "./Sidebar.css";

const navigationSections = [
	{
		label: "Workspace",
		items: [{ label: "Dashboard", path: "/dashboard", icon: LayoutDashboard }],
	},
	{
		label: "Academics",
		items: [
			{ label: "Students", path: "/students", icon: GraduationCap },
			{ label: "Faculty", path: "/faculty", icon: Users },
			{ label: "Departments", path: "/departments", icon: Building2 },
			{ label: "Subjects", path: "/subjects", icon: BookOpen },
			{ label: "Timetable", path: "/timetable", icon: CalendarDays },
			{ label: "Attendance", path: "/attendance", icon: ClipboardCheck },
			{ label: "Faculty Attendance", path: "/faculty-attendance", icon: UserRoundCheck },
			{ label: "Attendance Reports", path: "/attendance-reports", icon: ChartNoAxesCombined },
			{ label: "Leave Management", path: "/leave", icon: CalendarClock },
		],
	},
	{
		label: "Campus Life",
		items: [
			{ label: "Transport / Find My Bus", path: "/transport/find-my-bus", icon: Bus },
			{ label: "Hostel", path: "/hostel", icon: House },
			{ label: "Canteen", path: "/canteen", icon: Utensils },
			{ label: "Events & Culturals", path: "/events", icon: PartyPopper },
			{ label: "Library", path: "/library", icon: Library },
		],
	},
	{
		label: "Administration",
		items: [
			{ label: "Examinations", path: "/examinations", icon: FileText },
			{ label: "Results", path: "/results", icon: FileText },
			{ label: "Fees", path: "/fees", icon: CreditCard },
			{ label: "Placements", path: "/placements", icon: BriefcaseBusiness },
			{ label: "Complaints", path: "/complaints", icon: MessageSquare },
			{ label: "Notifications", path: "/notifications", icon: Bell },
			{ label: "Reports", path: "/reports", icon: ChartNoAxesCombined },
			{ label: "Settings", path: "/settings", icon: Settings },
		],
	},
];

export default function Sidebar({ isOpen, onClose }) {
	return (
		<>
			{isOpen && (
				<button
					className="admin-sidebar-backdrop"
					aria-label="Close navigation menu"
					onClick={onClose}
					type="button"
				/>
			)}
			<aside className={`admin-sidebar${isOpen ? " is-open" : ""}`}>
				<div className="admin-sidebar-brand">
					<div className="admin-sidebar-mark" aria-hidden="true">C</div>
					<div className="admin-sidebar-brand-copy">
						<strong>Campus</strong>
						<span>Management Suite</span>
					</div>
					<button className="admin-sidebar-close" onClick={onClose} type="button" aria-label="Close navigation">
						<X size={18} />
					</button>
				</div>

				<nav className="admin-sidebar-nav" aria-label="Main navigation">
					{navigationSections.map((section) => (
						<section className="admin-sidebar-section" key={section.label}>
							<h2>{section.label}</h2>
							{section.items.map(({ label, path, icon: Icon }) => (
								<NavLink
									className={({ isActive }) => `admin-sidebar-link${isActive ? " is-active" : ""}`}
									end
									key={path}
								onClick={onClose}
									to={path}
								>
									<Icon size={17} strokeWidth={1.8} aria-hidden="true" />
									<span>{label}</span>
								</NavLink>
							))}
						</section>
					))}
				</nav>

				<div className="admin-sidebar-footer">
					<span className="admin-sidebar-status" aria-hidden="true" />
					<span>Development demo</span>
				</div>
			</aside>
		</>
	);
}
