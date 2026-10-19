import { ArrowLeft, Construction } from "lucide-react";
import { Link } from "react-router-dom";
import "./ModulePage.css";

const modules = {
	students: ["Academics", "Students", "Manage enrollment, student profiles, and cohort information.", "Student directory, enrollment status, and profile management will live here."],
	faculty: ["Academics", "Faculty", "Review faculty profiles, teaching assignments, and department membership.", "Faculty directory, workload summaries, and staff records will live here."],
	departments: ["Academics", "Departments", "Organize academic divisions, department contacts, and program ownership.", "Department profiles and program-level summaries will live here."],
	subjects: ["Academics", "Subjects", "Plan subjects offered across programs, terms, and departments.", "Subject catalogs, credits, and instructor assignments will live here."],
	timetable: ["Academics", "Timetable", "Coordinate class schedules, rooms, and teaching periods across campus.", "Weekly schedules and room allocations will live here."],
	attendance: ["Academics", "Attendance", "Review attendance summaries and class participation patterns.", "Attendance registers, filters, and reports will live here."],
	leave: ["Academics", "Leave Management", "Review leave requests and track student and faculty absences.", "Request queues, approval history, and leave balances will live here."],
	transport: ["Campus Life", "Transport / Find My Bus", "Explore route information and campus transport services.", "Route listings, stops, and bus information will live here."],
	hostel: ["Campus Life", "Hostel", "Coordinate residential spaces, room assignments, and hostel services.", "Room availability, resident lists, and facility information will live here."],
	canteen: ["Campus Life", "Canteen", "Manage campus dining information, menus, and food service activity.", "Menu listings and service summaries will live here."],
	examinations: ["Administration", "Examinations", "Coordinate exam schedules, assessment windows, and results.", "Exam calendars, room schedules, and results will live here."],
	events: ["Campus Life", "Events & Culturals", "Plan campus events, cultural activities, and student participation.", "Event calendars, registrations, and announcements will live here."],
	fees: ["Administration", "Fees", "Review fee schedules, payment status, and student account summaries.", "Fee plans, payment records, and outstanding balances will live here."],
	library: ["Campus Life", "Library", "Coordinate library resources, catalog records, and circulation services.", "Catalog search, lending activity, and resource availability will live here."],
	placements: ["Administration", "Placements", "Track career opportunities, employer visits, and placement activity.", "Opportunity listings, recruitment events, and outcomes will live here."],
	complaints: ["Administration", "Complaints", "Review campus concerns and coordinate follow-up with the right teams.", "Issue intake, assignment, and resolution tracking will live here."],
	notifications: ["Administration", "Notifications", "Prepare campus updates and review recent community notices.", "Audience selection, message history, and delivery status will live here."],
	reports: ["Administration", "Reports", "Bring together campus indicators for operational and academic review.", "Report filters, summaries, and exports will live here."],
	settings: ["Administration", "Settings", "Configure campus preferences, roles, and system-wide options.", "Workspace preferences and administrative controls will live here."],
};

export default function ModulePage({ moduleKey }) {
	const module = modules[moduleKey];

	if (!module) return null;

	const [group, title, description, planned] = module;

	return (
		<main className="module-page">
			<div className="module-breadcrumb"><Link to="/dashboard">Dashboard</Link><span>/</span><span>{group}</span></div>
			<header className="module-page-header">
				<div>
					<p className="module-page-kicker">{group}</p>
					<h1>{title}</h1>
					<p>{description}</p>
				</div>
				<span className="module-demo-tag">Development demo</span>
			</header>
			<section className="module-placeholder">
				<div className="module-placeholder-icon"><Construction size={22} strokeWidth={1.7} /></div>
				<p className="module-page-kicker">MODULE PREVIEW</p>
				<h2>Workspace in preparation</h2>
				<p>{planned}</p>
				<p className="module-sample-note">This frontend placeholder contains no live college records or connected services.</p>
				<Link to="/dashboard" className="module-back-link"><ArrowLeft size={15} />Back to dashboard</Link>
			</section>
		</main>
	);
}