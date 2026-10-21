import { useState } from "react";
import { BookOpenCheck, CalendarDays, ClipboardCheck, GraduationCap, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { resolveSubjectTheme } from "../../config/departmentThemes.js";
import "./FacultyDashboard.css";

const assignedStudents = [
	{ id: "STU2026007", name: "Aarav Mehta", status: "Present" },
	{ id: "STU2026012", name: "Mina Clarke", status: "Present" },
	{ id: "STU2026018", name: "Eli Turner", status: "Absent" },
	{ id: "STU2026024", name: "Zara Ahmed", status: "Present" },
];

const teachingSchedule = [
	{ day: "Monday", time: "09:00 - 10:30", subject: "Algorithms", className: "CS-3A", room: "North 204" },
	{ day: "Wednesday", time: "11:00 - 12:30", subject: "Data Structures", className: "CS-2B", room: "North 118" },
	{ day: "Friday", time: "14:00 - 15:30", subject: "Algorithms Lab", className: "CS-3A", room: "Lab 3" },
];

export default function FacultyDashboard() {
	const [attendance, setAttendance] = useState(assignedStudents.map((student) => student.status === "Present"));
	const [feedback, setFeedback] = useState("");

	function toggleAttendance(index) {
		setAttendance((current) => current.map((present, position) => position === index ? !present : present));
		setFeedback("");
	}

	return (
		<main className="faculty-portal-dashboard">
			<header className="faculty-portal-welcome" id="overview"><div><p className="faculty-portal-kicker">FACULTY OVERVIEW</p><h1>Welcome back, Taylor</h1><p>Your teaching workspace and assigned classes.</p></div><span className="faculty-portal-demo">Sample data · Development demo</span></header>
			<section className="faculty-portal-stats" aria-label="Sample faculty summary"><article><UsersRound size={18} /><span>Assigned students</span><strong>24</strong><small>Across sample sections</small></article><article><BookOpenCheck size={18} /><span>Assigned subjects</span><strong>2</strong><small>Algorithms · Data Structures</small></article><article><ClipboardCheck size={18} /><span>Attendance to review</span><strong>1</strong><small>Sample class roster</small></article></section>
			<div className="faculty-portal-grid">
				<section className="faculty-portal-panel" id="profile"><div className="faculty-portal-panel-heading"><div><p className="faculty-portal-kicker">MY RECORD</p><h2>Faculty profile</h2></div><span className="faculty-portal-sample">Demo</span></div><dl className="faculty-portal-profile-grid"><div><dt>Faculty member</dt><dd>Taylor Morgan</dd></div><div><dt>Faculty ID</dt><dd>FAC2026001</dd></div><div><dt>Department</dt><dd>Computer Science</dd></div><div><dt>Designation</dt><dd>Assistant Professor</dd></div><div><dt>Qualification</dt><dd>M.S. Computer Science</dd></div><div><dt>Office hours</dt><dd>Tue · 1:00–3:00 PM · Sample</dd></div></dl></section>
				<section className="faculty-portal-panel" id="classes"><div className="faculty-portal-panel-heading"><div><p className="faculty-portal-kicker">ASSIGNED TEACHING</p><h2>My subjects & classes</h2></div><GraduationCap size={18} /></div><div className="faculty-class-card"><span className={`faculty-subject-chip subject-${resolveSubjectTheme("Algorithms")}`}>Algorithms</span><span>CS-3A · 24 students</span><small>Sample assignment</small></div><div className="faculty-class-card"><span className={`faculty-subject-chip subject-${resolveSubjectTheme("Data Structures")}`}>Data Structures</span><span>CS-2B · 22 students</span><small>Sample assignment</small></div></section>
				<section className="faculty-portal-panel faculty-schedule-panel" id="timetable"><div className="faculty-portal-panel-heading"><div><p className="faculty-portal-kicker">SAMPLE WEEKLY SLOTS</p><h2>Teaching timetable</h2></div><CalendarDays size={18} /></div><div className="faculty-schedule-scroll"><table className="faculty-schedule-table"><thead><tr><th>Day</th><th>Time</th><th>Subject</th><th>Class</th><th>Room</th></tr></thead><tbody>{teachingSchedule.map((slot) => <tr key={`${slot.day}-${slot.time}`}><td>{slot.day}</td><td>{slot.time}</td><td><span className={`faculty-subject-chip subject-${resolveSubjectTheme(slot.subject)}`}>{slot.subject}</span></td><td>{slot.className}</td><td>{slot.room}</td></tr>)}</tbody></table></div><p className="faculty-portal-note">Sample timetable only. No live availability or conflict checking.</p></section>
				<section className="faculty-portal-panel faculty-attendance-panel" id="attendance"><div className="faculty-portal-panel-heading"><div><p className="faculty-portal-kicker">LOCAL DEMO TOOL</p><h2>Sample attendance sheet</h2><span className={`faculty-subject-chip subject-${resolveSubjectTheme("Algorithms")}`}>Algorithms · CS-3A</span></div><ClipboardCheck size={18} /></div><p className="faculty-portal-note">Toggle attendance for this fictional assigned roster. Nothing is sent or saved permanently.</p><div className="faculty-roster">{assignedStudents.map((student, index) => <label key={student.id}><span><strong>{student.name}</strong><small>{student.id}</small></span><input aria-label={`${student.name} present`} checked={attendance[index]} onChange={() => toggleAttendance(index)} type="checkbox" /><span className={attendance[index] ? "is-present" : "is-absent"}>{attendance[index] ? "Present" : "Absent"}</span></label>)}</div><button className="faculty-attendance-save" onClick={() => setFeedback("Sample attendance updated for this page session only.")} type="button">Save demo attendance</button>{feedback && <p className="faculty-attendance-feedback" role="status">{feedback}</p>}</section>
		<section className="faculty-portal-panel" id="quick-actions"><div className="faculty-portal-panel-heading"><div><p className="faculty-portal-kicker">QUICK ACTIONS</p><h2>Shortcuts</h2></div></div><div className="faculty-quick-actions"><Link to="/faculty-attendance">Faculty Attendance</Link><Link to="/timetable">Timetable</Link><Link to="/leave">Leave</Link><Link to="/examinations">Examinations</Link><Link to="/events">Events</Link></div></section>
	</div>
</main>
	);
}
