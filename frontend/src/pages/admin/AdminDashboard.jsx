import { Link } from "react-router-dom";
import {
	ArrowRight,
	ArrowUpRight,
	BookOpenCheck,
	CalendarDays,
	ClipboardCheck,
	GraduationCap,
	Users,
} from "lucide-react";
import "./AdminDashboard.css";

const statistics = [
	{ label: "Total students", value: "2,480", note: "+4.8% this term", icon: GraduationCap, tone: "green" },
	{ label: "Total faculty", value: "186", note: "Across 12 departments", icon: Users, tone: "blue" },
	{ label: "Departments", value: "12", note: "Academic divisions", icon: BookOpenCheck, tone: "orange" },
	{ label: "Today's attendance", value: "94.2%", note: "Sample: 2,336 present", icon: ClipboardCheck, tone: "teal" },
];

const attendanceTrend = [
	{ day: "Mon", value: 91 }, { day: "Tue", value: 95 }, { day: "Wed", value: 89 },
	{ day: "Thu", value: 96 }, { day: "Fri", value: 94 }, { day: "Sat", value: 86 },
	{ day: "Sun", value: 92 },
];

const upcomingEvents = [
	{ date: "21", month: "OCT", title: "Research & Innovation Forum", meta: "Auditorium · 10:00 AM", tone: "coral" },
	{ date: "24", month: "OCT", title: "Inter-college Arts Festival", meta: "Central grounds · 2:30 PM", tone: "blue" },
	{ date: "29", month: "OCT", title: "Alumni Networking Evening", meta: "Conference hall · 5:00 PM", tone: "green" },
];

const recentActivity = [
	{ title: "Student record updated", detail: "Maya Patel · Computer Science", time: "10 min ago", initials: "MP", tone: "green" },
	{ title: "Leave request submitted", detail: "Jordan Lee · Faculty", time: "32 min ago", initials: "JL", tone: "blue" },
	{ title: "Fee payment recorded", detail: "Aarav Shah · Semester 3", time: "1 hr ago", initials: "AS", tone: "orange" },
];

export default function AdminDashboard() {
	return (
		<main className="admin-dashboard">
			<header className="dashboard-welcome">
				<div>
					<p className="dashboard-eyebrow">SUNDAY, OCTOBER 18, 2026</p>
					<h1>Welcome back, Santhosh</h1>
					<p className="dashboard-welcome-copy">Here&apos;s your campus at a glance.</p>
				</div>
				<span className="dashboard-sample-label">Sample data · Development demo</span>
			</header>

			<section className="dashboard-stat-grid" aria-label="Sample campus statistics">
				{statistics.map(({ label, value, note, icon: Icon, tone }) => (
					<article className="dashboard-stat-card" key={label}>
						<div className={`dashboard-stat-icon tone-${tone}`}><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></div>
						<p className="dashboard-stat-label">{label}</p>
						<p className="dashboard-stat-value">{value}</p>
						<p className="dashboard-stat-note">{note}</p>
					</article>
				))}
			</section>

			<section className="dashboard-quick-actions" aria-label="Quick actions">
				<h2>Quick actions</h2>
				<div className="dashboard-action-list">
					<Link to="/students"><GraduationCap size={17} />Add student<ArrowRight size={15} /></Link>
					<Link to="/faculty"><Users size={17} />Manage faculty<ArrowRight size={15} /></Link>
					<Link to="/attendance"><ClipboardCheck size={17} />View attendance<ArrowRight size={15} /></Link>
				</div>
			</section>

			<div className="dashboard-content-grid">
				<section className="dashboard-panel attendance-panel">
					<div className="dashboard-panel-heading">
						<div><p className="dashboard-panel-kicker">ATTENDANCE OVERVIEW</p><h2>Weekly attendance</h2></div>
						<Link to="/attendance" className="dashboard-text-link">View report <ArrowUpRight size={15} /></Link>
					</div>
					<div className="attendance-chart" role="img" aria-label="Sample weekly attendance: Monday 91 percent, Tuesday 95 percent, Wednesday 89 percent, Thursday 96 percent, Friday 94 percent, Saturday 86 percent, Sunday 92 percent">
						<div className="attendance-chart-guides" aria-hidden="true"><span>100%</span><span>75%</span><span>50%</span></div>
						<div className="attendance-chart-columns" aria-hidden="true">
							{attendanceTrend.map(({ day, value }) => (
								<div className="attendance-chart-column" key={day}>
									<span className="attendance-chart-value">{value}%</span>
									<div className="attendance-chart-track"><span style={{ height: `${value}%` }} /></div>
									<span className="attendance-chart-day">{day}</span>
								</div>
							))}
						</div>
					</div>
					<p className="dashboard-chart-caption">Illustrative rates for the current week. Not connected to college records.</p>
				</section>

				<section className="dashboard-panel events-panel">
					<div className="dashboard-panel-heading">
						<div><p className="dashboard-panel-kicker">ON THE CALENDAR</p><h2>Upcoming events</h2></div>
						<Link to="/events" className="dashboard-text-link" aria-label="View all events"><ArrowUpRight size={16} /></Link>
					</div>
					<div className="dashboard-event-list">
						{upcomingEvents.map((event) => (
							<article className="dashboard-event" key={event.title}>
								<div className={`dashboard-event-date tone-${event.tone}`}><strong>{event.date}</strong><span>{event.month}</span></div>
								<div><h3>{event.title}</h3><p>{event.meta}</p></div>
							</article>
						))}
					</div>
				</section>

				<section className="dashboard-panel announcements-panel">
					<div className="dashboard-panel-heading">
						<div><p className="dashboard-panel-kicker">CAMPUS BULLETIN</p><h2>Announcements</h2></div>
						<Link to="/notifications" className="dashboard-text-link" aria-label="View all notifications"><ArrowUpRight size={16} /></Link>
					</div>
					<div className="dashboard-announcement"><span className="dashboard-announcement-dot" /><div><h3>Library hours extended</h3><p>Study spaces will remain open until 10 PM during midterms.</p><time>Today · 9:15 AM</time></div></div>
					<div className="dashboard-announcement"><span className="dashboard-announcement-dot is-muted" /><div><h3>Campus maintenance notice</h3><p>North parking entrance will be closed on October 20.</p><time>Yesterday</time></div></div>
				</section>

				<section className="dashboard-panel activity-panel">
					<div className="dashboard-panel-heading">
						<div><p className="dashboard-panel-kicker">DEMO ACTIVITY</p><h2>Recent activity</h2></div>
						<span className="dashboard-activity-period"><CalendarDays size={14} />Today</span>
					</div>
					<div className="dashboard-activity-list">
						{recentActivity.map((activity) => (
							<article className="dashboard-activity-row" key={activity.title}>
								<span className={`dashboard-activity-avatar tone-${activity.tone}`}>{activity.initials}</span>
								<div className="dashboard-activity-copy"><h3>{activity.title}</h3><p>{activity.detail}</p></div>
								<time>{activity.time}</time>
							</article>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
