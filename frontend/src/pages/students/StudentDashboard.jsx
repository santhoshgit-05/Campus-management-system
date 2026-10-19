import { BookOpenCheck, Bus, CalendarDays, ClipboardCheck, House, WalletCards } from "lucide-react";
import { DEMO_STUDENT_PROFILES } from "../../config/demoProfiles.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./StudentDashboard.css";

const schedule = [
	{ time: "09:00", subject: "Data Structures", className: "CS-2A", room: "North 118" },
	{ time: "10:45", subject: "Discrete Mathematics", className: "CS-2A", room: "West 204" },
	{ time: "13:00", subject: "Computer Networks", className: "CS-2A", room: "North 210" },
];
const results = [
	{ subject: "Programming Fundamentals", grade: "A", score: "88 / 100" },
	{ subject: "Applied Mathematics II", grade: "A-", score: "84 / 100" },
	{ subject: "Digital Systems", grade: "B+", score: "79 / 100" },
];

export default function StudentDashboard() {
	const { user } = useAuth();
	const student = DEMO_STUDENT_PROFILES[user?.id] ?? DEMO_STUDENT_PROFILES.STU2026001;

	return (
		<main className="student-dashboard">
			<header className="student-portal-welcome" id="overview"><div><p className="student-portal-kicker">STUDENT OVERVIEW</p><h1>Welcome back, {student.name.split(" ")[0]}</h1><p>Your campus information in one place.</p></div><span className="student-demo-tag">Sample data · Development demo</span></header>
			<section className="student-overview-stats" aria-label="Sample student summary">
				<article><span className="student-stat-icon"><ClipboardCheck size={18} /></span><p>Attendance</p><strong>94%</strong><small>Sample for current term</small></article>
				<article><span className="student-stat-icon is-blue"><BookOpenCheck size={18} /></span><p>Term average</p><strong>83.7%</strong><small>Sample academic record</small></article>
				<article><span className="student-stat-icon is-orange"><WalletCards size={18} /></span><p>Fee balance</p><strong>$0.00</strong><small>Sample account status</small></article>
			</section>
			<div className="student-dashboard-grid">
				<section className="student-portal-panel student-profile-panel" id="profile"><div className="student-portal-panel-heading"><div><p className="student-portal-kicker">MY RECORD</p><h2>Student profile</h2></div><span className="student-demo-tag">Demo</span></div><dl className="student-profile-grid"><div><dt>Student</dt><dd>{student.name}</dd></div><div><dt>Register number</dt><dd>{student.id}</dd></div><div><dt>Department</dt><dd>{student.department}</dd></div><div><dt>Academic year / section</dt><dd>{student.year} · {student.section}</dd></div><div><dt>Category</dt><dd>{student.category}</dd></div><div><dt>Current term</dt><dd>Fall term · Sample</dd></div></dl></section>
				<section className="student-portal-panel" id="attendance"><div className="student-portal-panel-heading"><div><p className="student-portal-kicker">SAMPLE SUMMARY</p><h2>Attendance</h2></div><ClipboardCheck size={18} className="student-panel-icon" /></div><div className="student-attendance-summary"><strong>94%</strong><span>Term attendance</span></div><div className="student-progress-track"><span style={{ width: "94%" }} /></div><p className="student-panel-note">Illustrative attendance only; no college records are connected.</p></section>
				<section className="student-portal-panel student-timetable-panel" id="timetable"><div className="student-portal-panel-heading"><div><p className="student-portal-kicker">SAMPLE WEEKDAY</p><h2>Timetable</h2></div><CalendarDays size={18} className="student-panel-icon" /></div><div className="student-timetable-list">{schedule.map((item) => <article key={item.time}><time>{item.time}</time><div><strong>{item.subject}</strong><small>{item.className} · {item.room}</small></div></article>)}</div></section>
				<section className="student-portal-panel" id="results"><div className="student-portal-panel-heading"><div><p className="student-portal-kicker">SAMPLE RECORD</p><h2>Recent results</h2></div><BookOpenCheck size={18} className="student-panel-icon" /></div><div className="student-results-list">{results.map((result) => <article key={result.subject}><div><strong>{result.subject}</strong><small>{result.score}</small></div><span>{result.grade}</span></article>)}</div></section>
				<section className="student-portal-panel" id="fees"><div className="student-portal-panel-heading"><div><p className="student-portal-kicker">SAMPLE ACCOUNT</p><h2>Fees</h2></div><WalletCards size={18} className="student-panel-icon" /></div><div className="student-fee-status"><span>Current term</span><strong>Paid</strong></div><p className="student-panel-note">Demo fee information only. No payments can be made here.</p></section>
				<section className="student-portal-panel" id="announcements"><div className="student-portal-panel-heading"><div><p className="student-portal-kicker">SAMPLE NOTICES</p><h2>Announcements</h2></div></div><div className="student-notice"><strong>Library study hours</strong><p>Extended evening hours are planned during midterm week.</p><time>Sample notice · Oct 18</time></div><div className="student-notice"><strong>Student activity fair</strong><p>Club sign-ups will be held at the central quad.</p><time>Sample notice · Oct 21</time></div></section>
				<section className="student-portal-panel student-campus-panel" id="campus"><div className="student-portal-panel-heading"><div><p className="student-portal-kicker">CAMPUS SERVICES</p><h2>Transport & housing</h2></div><Bus size={18} className="student-panel-icon" /></div><div className="student-campus-service"><Bus size={17} /><div><strong>Shuttle route B</strong><p>North gate · Sample pickup 8:10 AM</p></div></div><div className="student-campus-service"><House size={17} /><div><strong>Maple Hall · Room 214</strong><p>Sample residence assignment</p></div></div><p className="student-panel-note">Sample campus information; confirm schedules with campus staff.</p></section>
			</div>
		</main>
	);
}