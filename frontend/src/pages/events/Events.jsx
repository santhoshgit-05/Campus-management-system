import { useState } from "react";
import { CirclePlus, Eye, FilterX, Pencil, Plus, Search, Trash2, X, PartyPopper, UserPlus, UserMinus } from "lucide-react";
import "./Events.css";

const categories = ["Cultural", "Technical", "Sports", "Academic"];
const statuses = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

const initialEvents = [
	{ uid: "ev-1", eventId: "EVT-001", title: "Annual Cultural Fest", category: "Cultural", description: "Campus-wide cultural celebration.", venue: "Main Auditorium", organizer: "Student Council", startDate: "2026-11-15", startTime: "10:00", endDate: "2026-11-15", endTime: "17:00", registrationDeadline: "2026-11-10", capacity: 200, status: "Upcoming" },
];

const initialRegistrations = [
	{ uid: "reg-1", registrationId: "REG-001", eventId: "EVT-001", studentId: "CMS2026001", studentName: "Aarav Mehta", registrationDate: "2026-10-20", status: "Registered" },
];

const blankEvent = { eventId: "", title: "", category: "Cultural", description: "", venue: "", organizer: "", startDate: "", startTime: "", endDate: "", endTime: "", registrationDeadline: "", capacity: "", status: "Upcoming" };

const formFields = [
	{ name: "eventId", label: "Event ID", required: true, placeholder: "e.g. EVT-010" },
	{ name: "title", label: "Title", required: true, placeholder: "Event title" },
	{ name: "category", label: "Category", required: true, options: categories },
	{ name: "venue", label: "Venue", required: true, placeholder: "Venue" },
	{ name: "organizer", label: "Organizer", required: true, placeholder: "Organizer" },
	{ name: "startDate", label: "Start date", required: true, type: "date" },
	{ name: "startTime", label: "Start time", required: true, type: "time" },
	{ name: "endDate", label: "End date", required: true, type: "date" },
	{ name: "endTime", label: "End time", required: true, type: "time" },
	{ name: "registrationDeadline", label: "Registration deadline", required: true, type: "date" },
	{ name: "capacity", label: "Capacity", required: true, type: "number", placeholder: "e.g. 100" },
	{ name: "status", label: "Status", required: true, options: statuses },
];

function newUid(p) { return `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

export default function Events() {
	const [events, setEvents] = useState(initialEvents);
	const [registrations, setRegistrations] = useState(initialRegistrations);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ category: "", status: "", date: "" });
	const [formOpen, setFormOpen] = useState(false);
	const [editingUid, setEditingUid] = useState(null);
	const [draft, setDraft] = useState(blankEvent);
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [feedback, setFeedback] = useState(null);
	const [studentId, setStudentId] = useState("CMS2026001");
	const [studentName, setStudentName] = useState("Aarav Mehta");

	const normalizedSearch = search.trim().toLowerCase();
	const visible = events.filter((e) => {
		const matchesSearch = !normalizedSearch || [e.eventId, e.title, e.venue].some((v) => v.toLowerCase().includes(normalizedSearch));
		return matchesSearch &&
			(!filters.category || e.category === filters.category) &&
			(!filters.status || e.status === filters.status) &&
			(!filters.date || e.startDate === filters.date);
	});

	const total = events.length;
	const upcoming = events.filter((e) => e.status === "Upcoming").length;
	const completed = events.filter((e) => e.status === "Completed").length;
	const totalRegs = registrations.filter((r) => r.status === "Registered").length;
	const hasFilters = Boolean(normalizedSearch || Object.values(filters).some(Boolean));

	function regCount(eventId) { return registrations.filter((r) => r.eventId === eventId && r.status === "Registered").length; }

	function updateFilter(name, value) { setFilters((c) => ({ ...c, [name]: value })); }
	function clearFilters() { setSearch(""); setFilters({ category: "", status: "", date: "" }); }
	function openCreateForm() { setEditingUid(null); setDraft(blankEvent); setErrors({}); setFormError(""); setFormOpen(true); }
	function openEditForm(e) { setSelectedEvent(null); setEditingUid(e.uid); setDraft({ ...e }); setErrors({}); setFormError(""); setFormOpen(true); }

	function validateDraft() {
		const nextErrors = {};
		for (const field of formFields) {
			if (field.required && !String(draft[field.name] ?? "").trim()) nextErrors[field.name] = `${field.label} is required.`;
		}
		if (draft.startDate && draft.endDate && draft.endDate < draft.startDate) nextErrors.endDate = "End date must be on/after start date.";
		if (draft.startTime && draft.endTime && draft.startDate === draft.endDate && draft.endTime <= draft.startTime) nextErrors.endTime = "End time must be after start time.";
		if (draft.registrationDeadline && draft.startDate && draft.registrationDeadline > draft.startDate) nextErrors.registrationDeadline = "Deadline must be on/before start date.";
		const cap = Number(draft.capacity);
		if (draft.capacity && (isNaN(cap) || cap <= 0)) nextErrors.capacity = "Capacity must be > 0.";
		const duplicate = events.find((e) => e.uid !== editingUid && e.eventId.toLowerCase() === draft.eventId.trim().toLowerCase());
		if (duplicate) nextErrors.eventId = "This event ID is already in use.";
		return nextErrors;
	}

	function handleSave(event) {
		event.preventDefault();
		const nextErrors = validateDraft();
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) { setFormError("Review the highlighted fields and try again."); return; }
		const record = { ...draft, uid: editingUid ?? newUid("ev"), eventId: draft.eventId.trim(), title: draft.title.trim(), description: draft.description.trim(), venue: draft.venue.trim(), organizer: draft.organizer.trim(), capacity: draft.capacity.trim() };
		if (editingUid) {
			setEvents((c) => c.map((e) => e.uid === editingUid ? record : e));
			setFeedback({ type: "success", message: `${record.title} updated in this demo session.` });
		} else {
			setEvents((c) => [record, ...c]);
			setFeedback({ type: "success", message: `${record.title} added to this demo session.` });
		}
		setFormOpen(false);
	}

	function register(eventId) {
		const ev = events.find((e) => e.eventId === eventId);
		if (!ev) return;
		if (regCount(eventId) >= Number(ev.capacity)) { setFeedback({ type: "error", message: "Event is full." }); return; }
		const duplicate = registrations.find((r) => r.eventId === eventId && r.studentId === studentId && r.status === "Registered");
		if (duplicate) { setFeedback({ type: "error", message: "Already registered." }); return; }
		setRegistrations((c) => [...c, { uid: newUid("reg"), registrationId: `REG-${Date.now()}`, eventId, studentId, studentName, registrationDate: new Date().toISOString().slice(0, 10), status: "Registered" }]);
		setFeedback({ type: "success", message: "Registered successfully." });
	}

	function cancelRegistration(eventId) {
		setRegistrations((c) => c.map((r) => r.eventId === eventId && r.studentId === studentId && r.status === "Registered" ? { ...r, status: "Cancelled" } : r));
		setFeedback({ type: "success", message: "Registration cancelled." });
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		setEvents((c) => c.filter((e) => e.uid !== deleteTarget.uid));
		setRegistrations((c) => c.filter((r) => r.eventId !== deleteTarget.eventId));
		setFeedback({ type: "success", message: `${deleteTarget.title} removed.` });
		setDeleteTarget(null);
		if (selectedEvent?.uid === deleteTarget.uid) setSelectedEvent(null);
	}

	function setDraftField(name, value) {
		setDraft((c) => ({ ...c, [name]: value }));
		setErrors((c) => { if (!c[name]) return c; const n = { ...c }; delete n[name]; return n; });
	}

	const myRegs = registrations.filter((r) => r.studentId === studentId && r.status === "Registered");

	return (
		<main className="events-page">
			<header className="events-page-header">
				<div>
					<p className="events-eyebrow">CAMPUS LIFE / EVENTS</p>
					<h1>Events & cultural activities</h1>
					<p>Manage campus events and student registrations.</p>
				</div>
				<button className="events-primary-button" onClick={openCreateForm} type="button"><Plus size={17} /> Add event</button>
			</header>

			<p className="events-demo-notice">Sample event records · Changes stay in this page's demo session and are not saved permanently.</p>

			{feedback && (
				<div className={`events-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="events-summary" aria-label="Event counts">
				<div><span className="events-summary-icon"><PartyPopper size={17} /></span><span>Total events</span><strong>{total}</strong></div>
				<div><span className="events-summary-icon"><PartyPopper size={17} /></span><span>Upcoming</span><strong>{upcoming}</strong></div>
				<div><span className="events-summary-icon"><PartyPopper size={17} /></span><span>Completed</span><strong>{completed}</strong></div>
				<div><span className="events-summary-icon"><PartyPopper size={17} /></span><span>Registrations</span><strong>{totalRegs}</strong></div>
			</section>

			<section className="events-directory">
				<div className="events-directory-heading">
					<div><h2>Event list</h2><p>Showing {visible.length} of {events.length} events</p></div>
				</div>
				<div className="events-toolbar">
					<label className="events-search"><Search size={17} aria-hidden="true" /><input aria-label="Search events" onChange={(e) => setSearch(e.target.value)} placeholder="Search event ID, title, or venue" value={search} /></label>
					<div className="events-filters">
						<select aria-label="Filter by category" onChange={(e) => updateFilter("category", e.target.value)} value={filters.category}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
						<select aria-label="Filter by status" onChange={(e) => updateFilter("status", e.target.value)} value={filters.status}><option value="">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
						<input aria-label="Filter by date" onChange={(e) => updateFilter("date", e.target.value)} type="date" value={filters.date} />
					</div>
					<button className="events-clear-button" disabled={!hasFilters} onClick={clearFilters} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				{visible.length ? (
					<div className="events-table-wrap">
						<table className="events-table">
							<thead><tr><th>Event</th><th>Category</th><th>Venue</th><th>Start</th><th>End</th><th>Capacity</th><th>Registered</th><th>Status</th><th><span className="events-visually-hidden">Actions</span></th></tr></thead>
							<tbody>
								{visible.map((e) => {
									const count = regCount(e.eventId);
									const full = count >= Number(e.capacity);
									const isRegistered = registrations.some((r) => r.eventId === e.eventId && r.studentId === studentId && r.status === "Registered");
									return (
										<tr key={e.uid}>
											<td><div className="events-name-cell"><span className="events-avatar"><PartyPopper size={14} /></span><span><strong>{e.title}</strong><small>{e.eventId}</small></span></div></td>
											<td>{e.category}</td>
											<td>{e.venue}</td>
											<td>{e.startDate} {e.startTime}</td>
											<td>{e.endDate} {e.endTime}</td>
											<td>{e.capacity}</td>
											<td>{count}{full ? " (Full)" : ""}</td>
											<td><span className={`events-status-badge ${e.status === "Upcoming" ? "is-active" : e.status === "Completed" ? "is-inactive" : ""}`}><span />{e.status}</span></td>
											<td><div className="events-row-actions">
												<button aria-label={`View ${e.title}`} onClick={() => setSelectedEvent(e)} title="View details" type="button"><Eye size={16} /></button>
												<button aria-label={`Edit ${e.title}`} onClick={() => openEditForm(e)} title="Edit event" type="button"><Pencil size={15} /></button>
												{isRegistered ? (
													<button aria-label={`Cancel registration for ${e.title}`} onClick={() => cancelRegistration(e.eventId)} title="Cancel registration" type="button"><UserMinus size={15} /></button>
												) : (
													<button aria-label={`Register for ${e.title}`} disabled={full} onClick={() => register(e.eventId)} title="Register" type="button"><UserPlus size={15} /></button>
												)}
												<button aria-label={`Delete ${e.title}`} onClick={() => setDeleteTarget(e)} title="Delete event" type="button"><Trash2 size={15} /></button>
											</div></td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				) : (
					<div className="events-empty-state"><div><Search size={20} /></div><h3>No events found</h3><p>Try a different search or clear your filters.</p><button className="events-secondary-button" onClick={clearFilters} type="button">Clear search and filters</button></div>
				)}
			</section>

			<section className="events-directory">
				<div className="events-directory-heading">
					<div><h2>My registrations</h2><p>Showing {myRegs.length} active registrations for {studentName}</p></div>
				</div>
				<div className="events-table-wrap">
					<table className="events-table">
						<thead><tr><th>Registration</th><th>Event</th><th>Registration date</th><th>Status</th></tr></thead>
						<tbody>
							{myRegs.length ? myRegs.map((r) => {
								const ev = events.find((e) => e.eventId === r.eventId);
								return (
									<tr key={r.uid}>
										<td>{r.registrationId}</td>
										<td>{ev?.title || r.eventId}</td>
										<td>{r.registrationDate}</td>
										<td>{r.status}</td>
									</tr>
								);
							}) : <tr><td colSpan={4}>No active registrations.</td></tr>}
						</tbody>
					</table>
				</div>
			</section>

			{formOpen && (
				<div className="events-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}>
					<section aria-labelledby="event-form-title" aria-modal="true" className="events-modal events-form-modal" role="dialog">
						<header className="events-modal-header"><div><p className="events-eyebrow">EVENT</p><h2 id="event-form-title">{editingUid ? "Edit event" : "Add event"}</h2></div><button aria-label="Close form" className="events-modal-close" onClick={() => setFormOpen(false)} type="button"><X size={18} /></button></header>
						<form noValidate onSubmit={handleSave}>
							<p className="events-required-note">Fields marked <span>*</span> are required.</p>
							{formError && <p className="events-form-error" role="alert">{formError}</p>}
							<div className="events-form-grid">
								{formFields.map((field) => (
									<div className={`events-form-field${errors[field.name] ? " has-error" : ""}`} key={field.name}>
										<label htmlFor={`event-${field.name}`}>{field.label}{field.required && <span> *</span>}</label>
										{field.options ? (
											<select id={`event-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} value={draft[field.name]}><option value="">Select {field.label.toLowerCase()}</option>{field.options.map((o) => <option key={o}>{o}</option>)}</select>
										) : (
											<input id={`event-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} placeholder={field.placeholder} type={field.type ?? "text"} value={draft[field.name]} />
										)}
										{errors[field.name] && <small className="events-field-error">{errors[field.name]}</small>}
									</div>
								))}
								<div className="events-form-field events-description-field"><label htmlFor="event-description">Description</label><textarea id="event-description" onChange={(e) => setDraftField("description", e.target.value)} placeholder="Event description" rows="2" value={draft.description} /></div>
							</div>
							<footer className="events-modal-footer"><button className="events-secondary-button" onClick={() => setFormOpen(false)} type="button">Cancel</button><button className="events-primary-button" type="submit"><CirclePlus size={16} />{editingUid ? "Save changes" : "Add event"}</button></footer>
						</form>
					</section>
				</div>
			)}

			{selectedEvent && (
				<div className="events-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedEvent(null); }}>
					<section aria-labelledby="event-details-title" aria-modal="true" className="events-modal events-details-modal" role="dialog">
						<header className="events-modal-header"><div><p className="events-eyebrow">EVENT</p><h2 id="event-details-title">Event details</h2></div><button aria-label="Close details" className="events-modal-close" onClick={() => setSelectedEvent(null)} type="button"><X size={18} /></button></header>
						<dl className="events-details-grid">{[["Event ID", selectedEvent.eventId], ["Title", selectedEvent.title], ["Category", selectedEvent.category], ["Venue", selectedEvent.venue], ["Organizer", selectedEvent.organizer], ["Start", `${selectedEvent.startDate} ${selectedEvent.startTime}`], ["End", `${selectedEvent.endDate} ${selectedEvent.endTime}`], ["Registration deadline", selectedEvent.registrationDeadline], ["Capacity", selectedEvent.capacity], ["Registered", regCount(selectedEvent.eventId)], ["Status", selectedEvent.status], ["Description", selectedEvent.description || "Not provided"]].map(([l, v]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}</dl>
						<footer className="events-modal-footer"><button className="events-secondary-button" onClick={() => setSelectedEvent(null)} type="button">Close</button><button className="events-primary-button" onClick={() => openEditForm(selectedEvent)} type="button"><Pencil size={15} />Edit event</button></footer>
					</section>
				</div>
			)}

			{deleteTarget && (
				<div className="events-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
					<section aria-labelledby="delete-event-title" aria-modal="true" className="events-modal events-confirm-modal" role="alertdialog">
						<div className="events-delete-icon"><Trash2 size={20} /></div><h2 id="delete-event-title">Delete event?</h2>
						<p>Remove <strong>{deleteTarget.title}</strong> ({deleteTarget.eventId}) from this demo list? This change only affects the current page session.</p>
						<footer className="events-modal-footer"><button className="events-secondary-button" onClick={() => setDeleteTarget(null)} type="button">Keep event</button><button className="events-danger-button" onClick={confirmDelete} type="button"><Trash2 size={15} />Delete event</button></footer>
					</section>
				</div>
			)}
		</main>
	);
}
