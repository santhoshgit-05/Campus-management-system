import { useState } from "react";
import { CirclePlus, Eye, FilterX, Pencil, Plus, Search, Trash2, X, CalendarDays } from "lucide-react";
import "./Timetable.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "13:00 - 14:00", "14:00 - 15:00"];
const departments = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Biotechnology", "Business Administration"];
const classes = ["CS-3A", "CS-2B", "EE-2A", "ME-2B", "BT-3A"];
const faculty = ["Dr. Maya Chen", "Prof. Daniel Brooks", "Priya Nair", "Aisha Rahman"];

const initialEntries = [
	{ uid: "tt-1", entryId: "TT-001", day: "Monday", period: "09:00 - 10:00", subject: "Algorithms", faculty: "Dr. Maya Chen", room: "North 204", className: "CS-3A", department: "Computer Science" },
	{ uid: "tt-2", entryId: "TT-002", day: "Monday", period: "10:00 - 11:00", subject: "Data Structures", faculty: "Dr. Maya Chen", room: "North 118", className: "CS-2B", department: "Computer Science" },
	{ uid: "tt-3", entryId: "TT-003", day: "Tuesday", period: "10:00 - 11:00", subject: "Circuit Analysis", faculty: "Prof. Daniel Brooks", room: "West 105", className: "EE-2A", department: "Electrical Engineering" },
];

const blankEntry = { entryId: "", day: "Monday", period: periods[0], subject: "", faculty: "", room: "", className: "", department: "" };

const formFields = [
	{ name: "entryId", label: "Entry ID", required: true, placeholder: "e.g. TT-010" },
	{ name: "day", label: "Day", required: true, options: days },
	{ name: "period", label: "Period", required: true, options: periods },
	{ name: "subject", label: "Subject", required: true, placeholder: "Subject name" },
	{ name: "faculty", label: "Faculty", required: true, options: faculty },
	{ name: "room", label: "Room", required: true, placeholder: "Room number" },
	{ name: "className", label: "Class / Section", required: true, options: classes },
	{ name: "department", label: "Department", required: true, options: departments },
];

function newUid() { return `tt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

export default function Timetable() {
	const [entries, setEntries] = useState(initialEntries);
	const [filters, setFilters] = useState({ department: "", className: "", faculty: "", day: "" });
	const [formOpen, setFormOpen] = useState(false);
	const [editingUid, setEditingUid] = useState(null);
	const [draft, setDraft] = useState(blankEntry);
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [selectedEntry, setSelectedEntry] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [feedback, setFeedback] = useState(null);

	const visibleEntries = entries.filter((e) =>
		(!filters.department || e.department === filters.department) &&
		(!filters.className || e.className === filters.className) &&
		(!filters.faculty || e.faculty === filters.faculty) &&
		(!filters.day || e.day === filters.day)
	);

	const hasFilters = Object.values(filters).some(Boolean);

	function updateFilter(name, value) { setFilters((c) => ({ ...c, [name]: value })); }
	function clearFilters() { setFilters({ department: "", className: "", faculty: "", day: "" }); }
	function openCreateForm() { setEditingUid(null); setDraft(blankEntry); setErrors({}); setFormError(""); setFormOpen(true); }
	function openEditForm(e) { setSelectedEntry(null); setEditingUid(e.uid); setDraft({ ...e }); setErrors({}); setFormError(""); setFormOpen(true); }

	function validateDraft() {
		const nextErrors = {};
		for (const field of formFields) {
			if (field.required && !String(draft[field.name] ?? "").trim()) nextErrors[field.name] = `${field.label} is required.`;
		}
		const overlap = entries.find((e) => e.uid !== editingUid && e.day === draft.day && e.period === draft.period && (e.faculty === draft.faculty || e.room === draft.room));
		if (overlap) nextErrors.period = overlap.faculty === draft.faculty ? "This faculty member already has a class in this period." : "This room is already booked in this period.";
		const duplicate = entries.find((e) => e.uid !== editingUid && e.entryId.toLowerCase() === draft.entryId.trim().toLowerCase());
		if (duplicate) nextErrors.entryId = "This entry ID is already in use.";
		return nextErrors;
	}

	function handleSave(event) {
		event.preventDefault();
		const nextErrors = validateDraft();
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) { setFormError("Review the highlighted fields and try again."); return; }
		const record = { ...draft, uid: editingUid ?? newUid(), entryId: draft.entryId.trim(), subject: draft.subject.trim(), room: draft.room.trim() };
		if (editingUid) {
			setEntries((c) => c.map((e) => e.uid === editingUid ? record : e));
			setFeedback({ type: "success", message: `${record.subject} entry updated in this demo session.` });
		} else {
			setEntries((c) => [record, ...c]);
			setFeedback({ type: "success", message: `${record.subject} entry added to this demo session.` });
		}
		setFormOpen(false);
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		setEntries((c) => c.filter((e) => e.uid !== deleteTarget.uid));
		setFeedback({ type: "success", message: `${deleteTarget.subject} entry removed from this demo session.` });
		setDeleteTarget(null);
		if (selectedEntry?.uid === deleteTarget.uid) setSelectedEntry(null);
	}

	function setDraftField(name, value) {
		setDraft((c) => ({ ...c, [name]: value }));
		setErrors((c) => { if (!c[name]) return c; const n = { ...c }; delete n[name]; return n; });
	}

	const grouped = days.map((day) => ({ day, items: visibleEntries.filter((e) => e.day === day).sort((a, b) => a.period.localeCompare(b.period)) }));

	return (
		<main className="timetable-page">
			<header className="timetable-page-header">
				<div>
					<p className="timetable-eyebrow">ACADEMICS / TIMETABLE</p>
					<h1>Timetable management</h1>
					<p>Coordinate class schedules, rooms, and teaching periods.</p>
				</div>
				<button className="timetable-primary-button" onClick={openCreateForm} type="button"><Plus size={17} /> Add entry</button>
			</header>

			<p className="timetable-demo-notice">Sample timetable entries · Changes stay in this page's demo session and are not saved permanently.</p>

			{feedback && (
				<div className={`timetable-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="timetable-directory">
				<div className="timetable-directory-heading">
					<div><h2>Weekly schedule</h2><p>Showing {visibleEntries.length} of {entries.length} entries</p></div>
				</div>
				<div className="timetable-toolbar">
					<div className="timetable-filters">
						<select aria-label="Filter by department" onChange={(e) => updateFilter("department", e.target.value)} value={filters.department}><option value="">All departments</option>{departments.map((d) => <option key={d}>{d}</option>)}</select>
						<select aria-label="Filter by class" onChange={(e) => updateFilter("className", e.target.value)} value={filters.className}><option value="">All classes</option>{classes.map((c) => <option key={c}>{c}</option>)}</select>
						<select aria-label="Filter by faculty" onChange={(e) => updateFilter("faculty", e.target.value)} value={filters.faculty}><option value="">All faculty</option>{faculty.map((f) => <option key={f}>{f}</option>)}</select>
						<select aria-label="Filter by day" onChange={(e) => updateFilter("day", e.target.value)} value={filters.day}><option value="">All days</option>{days.map((d) => <option key={d}>{d}</option>)}</select>
					</div>
					<button className="timetable-clear-button" disabled={!hasFilters} onClick={clearFilters} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				<div className="timetable-week-grid">
					{grouped.map(({ day, items }) => (
						<div className="timetable-day-card" key={day}>
							<h3>{day}</h3>
							{items.length ? items.map((e) => (
								<div className="timetable-slot" key={e.uid}>
									<div className="timetable-slot-time"><CalendarDays size={14} /> {e.period}</div>
									<strong>{e.subject}</strong>
									<span>{e.faculty}</span>
									<span>{e.className} · {e.room}</span>
									<div className="timetable-slot-actions">
										<button onClick={() => setSelectedEntry(e)} title="View" type="button"><Eye size={14} /></button>
										<button onClick={() => openEditForm(e)} title="Edit" type="button"><Pencil size={14} /></button>
										<button onClick={() => setDeleteTarget(e)} title="Delete" type="button"><Trash2 size={14} /></button>
									</div>
								</div>
							)) : <p className="timetable-no-slots">No classes scheduled.</p>}
						</div>
					))}
				</div>
			</section>

			{formOpen && (
				<div className="timetable-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}>
					<section aria-labelledby="timetable-form-title" aria-modal="true" className="timetable-modal timetable-form-modal" role="dialog">
						<header className="timetable-modal-header"><div><p className="timetable-eyebrow">TIMETABLE ENTRY</p><h2 id="timetable-form-title">{editingUid ? "Edit entry" : "Add entry"}</h2></div><button aria-label="Close form" className="timetable-modal-close" onClick={() => setFormOpen(false)} type="button"><X size={18} /></button></header>
						<form noValidate onSubmit={handleSave}>
							<p className="timetable-required-note">Fields marked <span>*</span> are required.</p>
							{formError && <p className="timetable-form-error" role="alert">{formError}</p>}
							<div className="timetable-form-grid">
								{formFields.map((field) => (
									<div className={`timetable-form-field${errors[field.name] ? " has-error" : ""}`} key={field.name}>
										<label htmlFor={`timetable-${field.name}`}>{field.label}{field.required && <span> *</span>}</label>
										{field.options ? (
											<select id={`timetable-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} value={draft[field.name]}><option value="">Select {field.label.toLowerCase()}</option>{field.options.map((o) => <option key={o}>{o}</option>)}</select>
										) : (
											<input id={`timetable-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} placeholder={field.placeholder} type="text" value={draft[field.name]} />
										)}
										{errors[field.name] && <small className="timetable-field-error">{errors[field.name]}</small>}
									</div>
								))}
							</div>
							<footer className="timetable-modal-footer"><button className="timetable-secondary-button" onClick={() => setFormOpen(false)} type="button">Cancel</button><button className="timetable-primary-button" type="submit"><CirclePlus size={16} />{editingUid ? "Save changes" : "Add entry"}</button></footer>
						</form>
					</section>
				</div>
			)}

			{selectedEntry && (
				<div className="timetable-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedEntry(null); }}>
					<section aria-labelledby="timetable-details-title" aria-modal="true" className="timetable-modal timetable-details-modal" role="dialog">
						<header className="timetable-modal-header"><div><p className="timetable-eyebrow">TIMETABLE ENTRY</p><h2 id="timetable-details-title">Entry details</h2></div><button aria-label="Close details" className="timetable-modal-close" onClick={() => setSelectedEntry(null)} type="button"><X size={18} /></button></header>
						<dl className="timetable-details-grid">{[["Entry ID", selectedEntry.entryId], ["Day", selectedEntry.day], ["Period", selectedEntry.period], ["Subject", selectedEntry.subject], ["Faculty", selectedEntry.faculty], ["Room", selectedEntry.room], ["Class / Section", selectedEntry.className], ["Department", selectedEntry.department]].map(([l, v]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}</dl>
						<footer className="timetable-modal-footer"><button className="timetable-secondary-button" onClick={() => setSelectedEntry(null)} type="button">Close</button><button className="timetable-primary-button" onClick={() => openEditForm(selectedEntry)} type="button"><Pencil size={15} />Edit entry</button></footer>
					</section>
				</div>
			)}

			{deleteTarget && (
				<div className="timetable-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
					<section aria-labelledby="delete-timetable-title" aria-modal="true" className="timetable-modal timetable-confirm-modal" role="alertdialog">
						<div className="timetable-delete-icon"><Trash2 size={20} /></div><h2 id="delete-timetable-title">Delete timetable entry?</h2>
						<p>Remove <strong>{deleteTarget.subject}</strong> ({deleteTarget.entryId}) from this demo list? This change only affects the current page session.</p>
						<footer className="timetable-modal-footer"><button className="timetable-secondary-button" onClick={() => setDeleteTarget(null)} type="button">Keep entry</button><button className="timetable-danger-button" onClick={confirmDelete} type="button"><Trash2 size={15} />Delete entry</button></footer>
					</section>
				</div>
			)}
		</main>
	);
}
