import { useState } from "react";
import { CirclePlus, Eye, FilterX, Pencil, Plus, Search, Trash2, ClipboardCheck, UsersRound, X, Clock } from "lucide-react";
import "./FacultyAttendance.css";

const departments = ["Biotechnology", "Business Administration", "Computer Science", "Electrical Engineering", "Mechanical Engineering"];
const statuses = ["Present", "Absent", "Late"];

const facultyMembers = [
	{ uid: "f-001", facultyId: "FAC-2026-001", fullName: "Dr. Maya Chen", department: "Computer Science" },
	{ uid: "f-002", facultyId: "FAC-2026-002", fullName: "Prof. Daniel Brooks", department: "Electrical Engineering" },
	{ uid: "f-003", facultyId: "FAC-2026-003", fullName: "Aisha Rahman", department: "Biotechnology" },
];

const timetableSlots = [
	{ facultyId: "FAC-2026-001", day: "Monday", time: "09:00 - 10:30", subject: "Algorithms", className: "CS-3A", room: "North 204" },
	{ facultyId: "FAC-2026-001", day: "Wednesday", time: "11:00 - 12:30", subject: "Data Structures", className: "CS-2B", room: "North 118" },
	{ facultyId: "FAC-2026-002", day: "Tuesday", time: "10:00 - 11:30", subject: "Circuit Analysis", className: "EE-2A", room: "West 105" },
	{ facultyId: "FAC-2026-003", day: "Thursday", time: "09:00 - 10:30", subject: "Genetics", className: "BT-3A", room: "South 212" },
];

const initialRecords = [
	{ uid: "fa-001", recordId: "FAT-2026-001", facultyId: "FAC-2026-001", fullName: "Dr. Maya Chen", department: "Computer Science", date: "2026-10-20", status: "Present", remarks: "" },
	{ uid: "fa-002", recordId: "FAT-2026-002", facultyId: "FAC-2026-002", fullName: "Prof. Daniel Brooks", department: "Electrical Engineering", date: "2026-10-20", status: "Late", remarks: "Traffic delay" },
	{ uid: "fa-003", recordId: "FAT-2026-003", facultyId: "FAC-2026-003", fullName: "Aisha Rahman", department: "Biotechnology", date: "2026-10-20", status: "Absent", remarks: "Conference" },
];

const blankRecord = { recordId: "", facultyId: "", fullName: "", department: "", date: "", status: "Present", remarks: "" };

const formFields = [
	{ name: "recordId", label: "Record ID", required: true, placeholder: "e.g. FAT-2026-010" },
	{ name: "facultyId", label: "Faculty ID", required: true, placeholder: "e.g. FAC-2026-004" },
	{ name: "fullName", label: "Faculty name", required: true, placeholder: "Faculty member's name" },
	{ name: "department", label: "Department", required: true, options: departments },
	{ name: "date", label: "Date", required: true, type: "date" },
	{ name: "status", label: "Status", required: true, options: statuses },
];

function newUid() { return `faculty-attendance-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

function nextPeriodFor(facultyId) {
	const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
	const slots = timetableSlots.filter((s) => s.facultyId === facultyId && s.day === today);
	return slots[0] ? `${slots[0].time} · ${slots[0].subject} (${slots[0].room})` : "No slot today";
}

export default function FacultyAttendance() {
	const [records, setRecords] = useState(initialRecords);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ faculty: "", department: "", status: "", date: "" });
	const [formOpen, setFormOpen] = useState(false);
	const [editingUid, setEditingUid] = useState(null);
	const [draft, setDraft] = useState(blankRecord);
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [selectedRecord, setSelectedRecord] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [feedback, setFeedback] = useState(null);

	const normalizedSearch = search.trim().toLowerCase();
	const visibleRecords = records.filter((r) => {
		const matchesSearch = !normalizedSearch || [r.recordId, r.facultyId, r.fullName].some((v) => v.toLowerCase().includes(normalizedSearch));
		return matchesSearch &&
			(!filters.faculty || r.fullName === filters.faculty) &&
			(!filters.department || r.department === filters.department) &&
			(!filters.status || r.status === filters.status) &&
			(!filters.date || r.date === filters.date);
	});

	const total = records.length;
	const present = records.filter((r) => r.status === "Present").length;
	const absent = records.filter((r) => r.status === "Absent").length;
	const late = records.filter((r) => r.status === "Late").length;
	const rate = total ? Math.round((present / total) * 100) : 0;
	const hasFilters = Boolean(normalizedSearch || Object.values(filters).some(Boolean));

	function updateFilter(name, value) { setFilters((c) => ({ ...c, [name]: value })); }
	function clearFilters() { setSearch(""); setFilters({ faculty: "", department: "", status: "", date: "" }); }
	function openCreateForm() { setEditingUid(null); setDraft(blankRecord); setErrors({}); setFormError(""); setFormOpen(true); }
	function openEditForm(r) { setSelectedRecord(null); setEditingUid(r.uid); setDraft({ ...r }); setErrors({}); setFormError(""); setFormOpen(true); }

	function validateDraft() {
		const nextErrors = {};
		for (const field of formFields) {
			if (field.required && !String(draft[field.name] ?? "").trim()) nextErrors[field.name] = `${field.label} is required.`;
		}
		const duplicate = records.find((r) => r.uid !== editingUid && r.recordId.toLowerCase() === draft.recordId.trim().toLowerCase());
		if (duplicate) nextErrors.recordId = "This record ID is already in use.";
		return nextErrors;
	}

	function handleSave(event) {
		event.preventDefault();
		const nextErrors = validateDraft();
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) { setFormError("Review the highlighted fields and try again."); return; }
		const record = { ...draft, uid: editingUid ?? newUid(), recordId: draft.recordId.trim(), facultyId: draft.facultyId.trim(), fullName: draft.fullName.trim(), department: draft.department.trim(), date: draft.date, status: draft.status, remarks: draft.remarks.trim() };
		if (editingUid) {
			setRecords((c) => c.map((r) => r.uid === editingUid ? record : r));
			setFeedback({ type: "success", message: `${record.fullName} attendance updated in this demo session.` });
		} else {
			setRecords((c) => [record, ...c]);
			setFeedback({ type: "success", message: `${record.fullName} attendance added to this demo session.` });
		}
		setFormOpen(false);
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		setRecords((c) => c.filter((r) => r.uid !== deleteTarget.uid));
		setFeedback({ type: "success", message: `${deleteTarget.fullName} record removed from this demo session.` });
		setDeleteTarget(null);
		if (selectedRecord?.uid === deleteTarget.uid) setSelectedRecord(null);
	}

	function setDraftField(name, value) {
		setDraft((c) => ({ ...c, [name]: value }));
		setErrors((c) => { if (!c[name]) return c; const n = { ...c }; delete n[name]; return n; });
	}

	return (
		<main className="faculty-attendance-page">
			<header className="faculty-attendance-page-header">
				<div>
					<p className="faculty-attendance-eyebrow">ACADEMICS / ATTENDANCE</p>
					<h1>Faculty attendance</h1>
					<p>Track faculty presence and review next-period timing.</p>
				</div>
				<button className="faculty-attendance-primary-button" onClick={openCreateForm} type="button"><Plus size={17} /> Add record</button>
			</header>

			<p className="faculty-attendance-demo-notice">Sample faculty attendance records · Changes stay in this page's demo session and are not saved permanently.</p>

			{feedback && (
				<div className={`faculty-attendance-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="faculty-attendance-summary" aria-label="Faculty attendance counts">
				<div><span className="faculty-attendance-summary-icon"><ClipboardCheck size={17} /></span><span>Total records</span><strong>{total}</strong></div>
				<div><span className="faculty-attendance-summary-icon is-active"><ClipboardCheck size={17} /></span><span>Present</span><strong>{present}</strong></div>
				<div><span className="faculty-attendance-summary-icon is-inactive"><ClipboardCheck size={17} /></span><span>Absent</span><strong>{absent}</strong></div>
				<div><span className="faculty-attendance-summary-icon"><ClipboardCheck size={17} /></span><span>Late</span><strong>{late}</strong></div>
				<div><span className="faculty-attendance-summary-icon"><Clock size={17} /></span><span>Attendance rate</span><strong>{rate}%</strong></div>
			</section>

			<section className="faculty-attendance-directory">
				<div className="faculty-attendance-directory-heading">
					<div><h2>Faculty attendance register</h2><p>Showing {visibleRecords.length} of {records.length} records</p></div>
				</div>
				<div className="faculty-attendance-toolbar">
					<label className="faculty-attendance-search"><Search size={17} aria-hidden="true" /><input aria-label="Search faculty attendance" onChange={(e) => setSearch(e.target.value)} placeholder="Search record, faculty ID, or name" value={search} /></label>
					<div className="faculty-attendance-filters">
						<select aria-label="Filter by faculty" onChange={(e) => updateFilter("faculty", e.target.value)} value={filters.faculty}><option value="">All faculty</option>{facultyMembers.map((f) => <option key={f.uid}>{f.fullName}</option>)}</select>
						<select aria-label="Filter by department" onChange={(e) => updateFilter("department", e.target.value)} value={filters.department}><option value="">All departments</option>{departments.map((d) => <option key={d}>{d}</option>)}</select>
						<select aria-label="Filter by status" onChange={(e) => updateFilter("status", e.target.value)} value={filters.status}><option value="">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
						<input aria-label="Filter by date" onChange={(e) => updateFilter("date", e.target.value)} type="date" value={filters.date} />
					</div>
					<button className="faculty-attendance-clear-button" disabled={!hasFilters} onClick={clearFilters} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				{visibleRecords.length ? (
					<div className="faculty-attendance-table-wrap">
						<table className="faculty-attendance-table">
							<thead><tr><th>Record</th><th>Faculty</th><th>Department</th><th>Date</th><th>Status</th><th>Next period</th><th>Remarks</th><th><span className="faculty-attendance-visually-hidden">Actions</span></th></tr></thead>
							<tbody>
								{visibleRecords.map((record) => (
									<tr key={record.uid}>
										<td className="faculty-attendance-id-cell">{record.recordId}</td>
										<td><div className="faculty-attendance-name-cell"><span className="faculty-attendance-avatar">{record.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span><span><strong>{record.fullName}</strong><small>{record.facultyId}</small></span></div></td>
										<td>{record.department}</td>
										<td>{record.date}</td>
										<td><span className={`faculty-attendance-status-badge ${record.status === "Present" ? "is-active" : record.status === "Absent" ? "is-inactive" : ""}`}><span />{record.status}</span></td>
										<td>{nextPeriodFor(record.facultyId)}</td>
										<td>{record.remarks || "—"}</td>
										<td><div className="faculty-attendance-row-actions">
											<button aria-label={`View ${record.fullName}`} onClick={() => setSelectedRecord(record)} title="View details" type="button"><Eye size={16} /></button>
											<button aria-label={`Edit ${record.fullName}`} onClick={() => openEditForm(record)} title="Edit record" type="button"><Pencil size={15} /></button>
											<button aria-label={`Delete ${record.fullName}`} onClick={() => setDeleteTarget(record)} title="Delete record" type="button"><Trash2 size={15} /></button>
										</div></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="faculty-attendance-empty-state"><div><Search size={20} /></div><h3>No faculty attendance records found</h3><p>Try a different search or clear your filters.</p><button className="faculty-attendance-secondary-button" onClick={clearFilters} type="button">Clear search and filters</button></div>
				)}
			</section>

			{formOpen && (
				<div className="faculty-attendance-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}>
					<section aria-labelledby="faculty-attendance-form-title" aria-modal="true" className="faculty-attendance-modal faculty-attendance-form-modal" role="dialog">
						<header className="faculty-attendance-modal-header"><div><p className="faculty-attendance-eyebrow">FACULTY ATTENDANCE RECORD</p><h2 id="faculty-attendance-form-title">{editingUid ? "Edit record" : "Add record"}</h2></div><button aria-label="Close form" className="faculty-attendance-modal-close" onClick={() => setFormOpen(false)} type="button"><X size={18} /></button></header>
						<form noValidate onSubmit={handleSave}>
							<p className="faculty-attendance-required-note">Fields marked <span>*</span> are required.</p>
							{formError && <p className="faculty-attendance-form-error" role="alert">{formError}</p>}
							<div className="faculty-attendance-form-grid">
								{formFields.map((field) => (
									<div className={`faculty-attendance-form-field${errors[field.name] ? " has-error" : ""}`} key={field.name}>
										<label htmlFor={`faculty-attendance-${field.name}`}>{field.label}{field.required && <span> *</span>}</label>
										{field.options ? (
											<select id={`faculty-attendance-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} value={draft[field.name]}><option value="">Select {field.label.toLowerCase()}</option>{field.options.map((o) => <option key={o}>{o}</option>)}</select>
										) : (
											<input id={`faculty-attendance-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} placeholder={field.placeholder} type={field.type ?? "text"} value={draft[field.name]} />
										)}
										{errors[field.name] && <small className="faculty-attendance-field-error">{errors[field.name]}</small>}
									</div>
								))}
								<div className="faculty-attendance-form-field faculty-attendance-remarks-field"><label htmlFor="faculty-attendance-remarks">Remarks</label><textarea id="faculty-attendance-remarks" onChange={(e) => setDraftField("remarks", e.target.value)} placeholder="Optional notes" rows="2" value={draft.remarks} /></div>
							</div>
							<footer className="faculty-attendance-modal-footer"><button className="faculty-attendance-secondary-button" onClick={() => setFormOpen(false)} type="button">Cancel</button><button className="faculty-attendance-primary-button" type="submit"><CirclePlus size={16} />{editingUid ? "Save changes" : "Add record"}</button></footer>
						</form>
					</section>
				</div>
			)}

			{selectedRecord && (
				<div className="faculty-attendance-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedRecord(null); }}>
					<section aria-labelledby="faculty-attendance-details-title" aria-modal="true" className="faculty-attendance-modal faculty-attendance-details-modal" role="dialog">
						<header className="faculty-attendance-modal-header"><div><p className="faculty-attendance-eyebrow">FACULTY ATTENDANCE PROFILE</p><h2 id="faculty-attendance-details-title">Attendance details</h2></div><button aria-label="Close details" className="faculty-attendance-modal-close" onClick={() => setSelectedRecord(null)} type="button"><X size={18} /></button></header>
						<div className="faculty-attendance-profile-heading"><span className="faculty-attendance-avatar is-large">{selectedRecord.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span><div><h3>{selectedRecord.fullName}</h3><p>{selectedRecord.facultyId}</p></div><span className={`faculty-attendance-status-badge ${selectedRecord.status === "Present" ? "is-active" : selectedRecord.status === "Absent" ? "is-inactive" : ""}`}><span />{selectedRecord.status}</span></div>
						<dl className="faculty-attendance-details-grid">{[["Record ID", selectedRecord.recordId], ["Faculty ID", selectedRecord.facultyId], ["Department", selectedRecord.department], ["Date", selectedRecord.date], ["Status", selectedRecord.status], ["Next period", nextPeriodFor(selectedRecord.facultyId)], ["Remarks", selectedRecord.remarks || "Not provided"]].map(([l, v]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}</dl>
						<footer className="faculty-attendance-modal-footer"><button className="faculty-attendance-secondary-button" onClick={() => setSelectedRecord(null)} type="button">Close</button><button className="faculty-attendance-primary-button" onClick={() => openEditForm(selectedRecord)} type="button"><Pencil size={15} />Edit record</button></footer>
					</section>
				</div>
			)}

			{deleteTarget && (
				<div className="faculty-attendance-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
					<section aria-labelledby="delete-faculty-attendance-title" aria-modal="true" className="faculty-attendance-modal faculty-attendance-confirm-modal" role="alertdialog">
						<div className="faculty-attendance-delete-icon"><Trash2 size={20} /></div><h2 id="delete-faculty-attendance-title">Delete attendance record?</h2>
						<p>Remove <strong>{deleteTarget.fullName}</strong> ({deleteTarget.recordId}) from this demo list? This change only affects the current page session.</p>
						<footer className="faculty-attendance-modal-footer"><button className="faculty-attendance-secondary-button" onClick={() => setDeleteTarget(null)} type="button">Keep record</button><button className="faculty-attendance-danger-button" onClick={confirmDelete} type="button"><Trash2 size={15} />Delete record</button></footer>
					</section>
				</div>
			)}
		</main>
	);
}
