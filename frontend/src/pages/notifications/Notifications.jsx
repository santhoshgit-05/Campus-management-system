import { useState } from "react";
import { Bell, FilterX, Search, Trash2, X, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Notifications.css";

const categories = ["General", "Academic", "Attendance", "Examinations", "Fees", "Leave", "Events", "Transport"];

const sampleByRole = {
	admin: [
		{ uid: "n-1", id: "NTF-001", title: "New leave request", message: "A faculty member submitted a leave request.", category: "Leave", createdAt: "2026-10-20 09:00", read: false },
		{ uid: "n-2", id: "NTF-002", title: "Fee payment received", message: "A student payment was recorded.", category: "Fees", createdAt: "2026-10-19 14:00", read: true },
	],
	student: [
		{ uid: "n-3", id: "NTF-003", title: "Exam schedule published", message: "Midterm examination schedule is available.", category: "Examinations", createdAt: "2026-10-20 10:00", read: false },
		{ uid: "n-4", id: "NTF-004", title: "Fee reminder", message: "Your tuition fee is due soon.", category: "Fees", createdAt: "2026-10-18 08:00", read: false },
	],
	faculty: [
		{ uid: "n-5", id: "NTF-005", title: "Attendance review", message: "Please review student attendance for CS-3A.", category: "Attendance", createdAt: "2026-10-20 11:00", read: false },
		{ uid: "n-6", id: "NTF-006", title: "Event registration", message: "Annual cultural fest registration is open.", category: "Events", createdAt: "2026-10-17 16:00", read: true },
	],
};

export default function Notifications() {
	const { user } = useAuth();
	const role = user?.role === "admin" ? "admin" : user?.role === "faculty" ? "faculty" : "student";
	const [notifications, setNotifications] = useState(sampleByRole[role] ?? sampleByRole.student);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ category: "", read: "" });
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [feedback, setFeedback] = useState(null);

	const normalizedSearch = search.trim().toLowerCase();
	const visible = notifications.filter((n) => {
		const matchesSearch = !normalizedSearch || [n.id, n.title, n.message].some((v) => v.toLowerCase().includes(normalizedSearch));
		return matchesSearch &&
			(!filters.category || n.category === filters.category) &&
			(filters.read === "" || String(n.read) === filters.read);
	});

	const total = notifications.length;
	const unread = notifications.filter((n) => !n.read).length;
	const read = notifications.filter((n) => n.read).length;
	const hasFilters = Boolean(normalizedSearch || Object.values(filters).some(Boolean));

	function clearFilters() { setSearch(""); setFilters({ category: "", read: "" }); }
	function toggleRead(uid) { setNotifications((c) => c.map((n) => n.uid === uid ? { ...n, read: !n.read } : n)); }
	function markAllRead() { setNotifications((c) => c.map((n) => ({ ...n, read: true }))); setFeedback({ type: "success", message: "All notifications marked as read." }); }
	function confirmDelete() {
		if (!deleteTarget) return;
		setNotifications((c) => c.filter((n) => n.uid !== deleteTarget.uid));
		setFeedback({ type: "success", message: "Notification deleted." });
		setDeleteTarget(null);
	}

	return (
		<main className="notifications-page">
			<header className="notifications-page-header">
				<div>
					<p className="notifications-eyebrow">ADMINISTRATION / NOTIFICATIONS</p>
					<h1>Notifications</h1>
					<p>Review campus updates and announcements.</p>
				</div>
				<button className="notifications-primary-button" onClick={markAllRead} type="button"><CheckCircle2 size={17} /> Mark all read</button>
			</header>

			<p className="notifications-demo-notice">Sample notifications for the {role} role · Not connected to live delivery.</p>

			{feedback && (
				<div className={`notifications-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="notifications-summary" aria-label="Notification counts">
				<div><span className="notifications-summary-icon"><Bell size={17} /></span><span>All</span><strong>{total}</strong></div>
				<div><span className="notifications-summary-icon"><Bell size={17} /></span><span>Unread</span><strong>{unread}</strong></div>
				<div><span className="notifications-summary-icon"><Bell size={17} /></span><span>Read</span><strong>{read}</strong></div>
			</section>

			<section className="notifications-directory">
				<div className="notifications-directory-heading">
					<div><h2>Notification list</h2><p>Showing {visible.length} of {notifications.length} notifications</p></div>
				</div>
				<div className="notifications-toolbar">
					<label className="notifications-search"><Search size={17} aria-hidden="true" /><input aria-label="Search notifications" onChange={(e) => setSearch(e.target.value)} placeholder="Search title or message" value={search} /></label>
					<div className="notifications-filters">
						<select aria-label="Filter by category" onChange={(e) => setFilters((c) => ({ ...c, category: e.target.value }))} value={filters.category}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
						<select aria-label="Filter by read status" onChange={(e) => setFilters((c) => ({ ...c, read: e.target.value }))} value={filters.read}><option value="">All</option><option value="false">Unread</option><option value="true">Read</option></select>
					</div>
					<button className="notifications-clear-button" disabled={!hasFilters} onClick={clearFilters} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				{visible.length ? (
					<div className="notifications-list">
						{visible.map((n) => (
							<article className={`notifications-item ${n.read ? "is-read" : "is-unread"}`} key={n.uid}>
								<div className="notifications-item-main">
									<strong>{n.title}</strong>
									<p>{n.message}</p>
									<small>{n.category} · {n.createdAt}</small>
								</div>
								<div className="notifications-item-actions">
									<button onClick={() => toggleRead(n.uid)} type="button">{n.read ? "Mark unread" : "Mark read"}</button>
									<button onClick={() => setDeleteTarget(n)} type="button" aria-label="Delete notification"><Trash2 size={15} /></button>
								</div>
							</article>
						))}
					</div>
				) : (
					<div className="notifications-empty-state"><div><Bell size={20} /></div><h3>No notifications found</h3><p>Try a different search or clear your filters.</p><button className="notifications-secondary-button" onClick={clearFilters} type="button">Clear search and filters</button></div>
				)}
			</section>

			{deleteTarget && (
				<div className="notifications-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
					<section aria-labelledby="delete-notification-title" aria-modal="true" className="notifications-modal notifications-confirm-modal" role="alertdialog">
						<div className="notifications-delete-icon"><Trash2 size={20} /></div><h2 id="delete-notification-title">Delete notification?</h2>
						<p>Remove <strong>{deleteTarget.title}</strong> ({deleteTarget.id}) from this demo list? This change only affects the current page session.</p>
						<footer className="notifications-modal-footer"><button className="notifications-secondary-button" onClick={() => setDeleteTarget(null)} type="button">Keep notification</button><button className="notifications-danger-button" onClick={confirmDelete} type="button"><Trash2 size={15} />Delete notification</button></footer>
					</section>
				</div>
			)}
		</main>
	);
}
