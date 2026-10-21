import { useState } from "react";
import { CirclePlus, Eye, FilterX, Pencil, Plus, Search, Trash2, ClipboardCheck, UsersRound, X } from "lucide-react";
import "./StudentAttendance.css";

const departments = ["Biotechnology", "Business Administration", "Computer Science", "Electrical Engineering", "Mechanical Engineering"];
const statuses = ["Present", "Absent", "Late"];

const initialRecords = [
	{ uid: "att-001", recordId: "ATT-2026-001", studentId: "CMS2026001", fullName: "Aarav Mehta", department: "Computer Science", date: "2026-10-20", status: "Present", remarks: "" },
	{ uid: "att-002", recordId: "ATT-2026-002", studentId: "CMS2026002", fullName: "Sofia Bennett", department: "Electrical Engineering", date: "2026-10-20", status: "Absent", remarks: "Medical leave" },
	{ uid: "att-003", recordId: "ATT-2026-003", studentId: "CMS2026003", fullName: "Noah Williams", department: "Business Administration", date: "2026-10-20", status: "Late", remarks: "Arrived 15 min late" },
	{ uid: "att-004", recordId: "ATT-2026-004", studentId: "CMS2026001", fullName: "Aarav Mehta", department: "Computer Science", date: "2026-10-19", status: "Present", remarks: "" },
	{ uid: "att-005", recordId: "ATT-2026-005", studentId: "CMS2026004", fullName: "Maya Patel", department: "Biotechnology", date: "2026-10-19", status: "Present", remarks: "" },
];

const blankRecord = { recordId: "", studentId: "", fullName: "", department: "", date: "", status: "Present", remarks: "" };

const formFields = [
	{ name: "recordId", label: "Record ID", required: true, placeholder: "e.g. ATT-2026-010" },
	{ name: "studentId", label: "Student ID", required: true, placeholder: "e.g. CMS2026010" },
	{ name: "fullName", label: "Student name", required: true, placeholder: "Student's full name" },
	{ name: "department", label: "Department", required: true, options: departments },
	{ name: "date", label: "Date", required: true, type: "date" },
	{ name: "status", label: "Status", required: true, options: statuses },
];

function newUid() { return `attendance-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

export default function StudentAttendance() {
	const [records, setRecords] = useState(initialRecords);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ department: "", status: "", date: "" });
	const [formOpen, setFormOpen] = useState(false);
	const [editingUid, setEditingUid] = useState(null);
	const [draft, setDraft] = useState(blankRecord);
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [selectedRecord, setSelectedRecord] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [feedback, setFeedback] = useState(null);

	const normalizedSearch = search.trim().toLowerCase();
	const visibleRecords = records.filter((record) => {
		const matchesSearch = !normalizedSearch || [record.recordId, record.studentId, record.fullName].some((v) => v.toLowerCase().includes(normalizedSearch));
		return matchesSearch &&
			(!filters.department || record.department === filters.department) &&
			(!filters.status || record.status === filters.status) &&
			(!filters.date || record.date === filters.date);
	});

	const total = records.length;
	const present = records.filter((r) => r.status === "Present").length;
	const absent = records.filter((r) => r.status === "Absent").length;
	const late = records.filter((r) => r.status === "Late").length;
	const rate = total ? Math.round((present / total) * 100) : 0;
	const hasFilters = Boolean(normalizedSearch || Object.values(filters).some(Boolean));

	function updateFilter(name, value) { setFilters((c) => ({ ...c, [name]: value })); }
	function clearFilters() { setSearch(""); setFilters({ department: "", status: "", date: "" }); }
	function openCreateForm() { setEditingUid(null); setDraft(blankRecord); setErrors({}); setFormError(""); setFormOpen(true); }
	function openEditForm(record) { setSelectedRecord(null); setEditingUid(record.uid); setDraft({ ...record }); setErrors({}); setFormError(""); setFormOpen(true); }

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
		const record = { ...draft, uid: editingUid ?? newUid(), recordId: draft.recordId.trim(), studentId: draft.studentId.trim(), fullName: draft.fullName.trim(), department: draft.department.trim(), date: draft.date, status: draft.status, remarks: draft.remarks.trim() };
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
		<main className="attendance-page">
			<header className="attendance-page-header">
				<div>
					<p className="attendance-eyebrow">ACADEMICS / ATTENDANCE</p>
					<h1>Student attendance</h1>
					<p>Track daily attendance and review present, absent, and late summaries.</p>
				</div>
				<button className="attendance-primary-button" onClick={openCreateForm} type="button"><Plus size={17} /> Add record</button>
			</header>

			<p className="attendance-demo-notice">Sample attendance records · Changes stay in this page's demo session and are not saved permanently.</p>

			{feedback && (
				<div className={`attendance-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="attendance-summary" aria-label="Attendance counts">
				<div><span className="attendance-summary-icon"><ClipboardCheck size={17} /></span><span>Total records</span><strong>{total}</strong></div>
				<div><span className="attendance-summary-icon is-active"><ClipboardCheck size={17} /></span><span>Present</span><strong>{present}</strong></div>
				<div><span className="attendance-summary-icon is-inactive"><ClipboardCheck size={17} /></span><span>Absent</span><strong>{absent}</strong></div>
				<div><span className="attendance-summary-icon"><ClipboardCheck size={17} /></span><span>Late</span><strong>{late}</strong></div>
				<div><span className="attendance-summary-icon"><ClipboardCheck size={17} /></span><span>Attendance rate</span><strong>{rate}%</strong></div>
			</section>

			<section className="attendance-directory">
				<div className="attendance-directory-heading">
					<div><h2>Attendance register</h2><p>Showing {visibleRecords.length} of {records.length} records</p></div>
				</div>
				<div className="attendance-toolbar">
					<label className="attendance-search"><Search size={17} aria-hidden="true" /><input aria-label="Search attendance" onChange={(e) => setSearch(e.target.value)} placeholder="Search record, student ID, or name" value={search} /></label>
					<div className="attendance-filters">
						<select aria-label="Filter by department" onChange={(e) => updateFilter("department", e.target.value)} value={filters.department}><option value="">All departments</option>{departments.map((d) => <option key={d}>{d}</option>)}</select>
						<select aria-label="Filter by status" onChange={(e) => updateFilter("status", e.target.value)} value={filters.status}><option value="">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
						<input aria-label="Filter by date" onChange={(e) => updateFilter("date", e.target.value)} type="date" value={filters.date} />
					</div>
					<button className="attendance-clear-button" disabled={!hasFilters} onClick={clearFilters} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				{visibleRecords.length ? (
					<div className="attendance-table-wrap">
						<table className="attendance-table">
							<thead><tr><th>Record</th><th>Student</th><th>Department</th><th>Date</th><th>Status</th><th>Remarks</th><th><span className="attendance-visually-hidden">Actions</span></th></tr></thead>
							<tbody>
								{visibleRecords.map((record) => (
									<tr key={record.uid}>
										<td className="attendance-id-cell">{record.recordId}</td>
										<td><div className="attendance-name-cell"><span className="attendance-avatar">{record.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span><span><strong>{record.fullName}</strong><small>{record.studentId}</small></span></div></td>
										<td>{record.department}</td>
										<td>{record.date}</td>
										<td><span className={`attendance-status-badge ${record.status === "Present" ? "is-active" : record.status === "Absent" ? "is-inactive" : ""}`}><span />{record.status}</span></td>
										<td>{record.remarks || "—"}</td>
										<td><div className="attendance-row-actions">
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
					<div className="attendance-empty-state"><div><Search size={20} /></div><h3>No attendance records found</h3><p>Try a different search or clear your filters.</p><button className="attendance-secondary-button" onClick={clearFilters} type="button">Clear search and filters</button></div>
				)}
			</section>

			{formOpen && (
				<div className="attendance-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}>
					<section aria-labelledby="attendance-form-title" aria-modal="true" className="attendance-modal attendance-form-modal" role="dialog">
						<header className="attendance-modal-header"><div><p className="attendance-eyebrow">ATTENDANCE RECORD</p><h2 id="attendance-form-title">{editingUid ? "Edit record" : "Add record"}</h2></div><button aria-label="Close form" className="attendance-modal-close" onClick={() => setFormOpen(false)} type="button"><X size={18} /></button></header>
						<form noValidate onSubmit={handleSave}>
							<p className="attendance-required-note">Fields marked <span>*</span> are required.</p>
							{formError && <p className="attendance-form-error" role="alert">{formError}</p>}
							<div className="attendance-form-grid">
								{formFields.map((field) => (
									<div className={`attendance-form-field${errors[field.name] ? " has-error" : ""}`} key={field.name}>
										<label htmlFor={`attendance-${field.name}`}>{field.label}{field.required && <span> *</span>}</label>
										{field.options ? (
											<select id={`attendance-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} value={draft[field.name]}><option value="">Select {field.label.toLowerCase()}</option>{field.options.map((o) => <option key={o}>{o}</option>)}</select>
										) : (
											<input id={`attendance-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} placeholder={field.placeholder} type={field.type ?? "text"} value={draft[field.name]} />
										)}
										{errors[field.name] && <small className="attendance-field-error">{errors[field.name]}</small>}
									</div>
								))}
								<div className="attendance-form-field attendance-remarks-field"><label htmlFor="attendance-remarks">Remarks</label><textarea id="attendance-remarks" onChange={(e) => setDraftField("remarks", e.target.value)} placeholder="Optional notes" rows="2" value={draft.remarks} /></div>
							</div>
							<footer className="attendance-modal-footer"><button className="attendance-secondary-button" onClick={() => setFormOpen(false)} type="button">Cancel</button><button className="attendance-primary-button" type="submit"><CirclePlus size={16} />{editingUid ? "Save changes" : "Add record"}</button></footer>
						</form>
					</section>
				</div>
			)}

			{selectedRecord && (
				<div className="attendance-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedRecord(null); }}>
					<section aria-labelledby="attendance-details-title" aria-modal="true" className="attendance-modal attendance-details-modal" role="dialog">
						<header className="attendance-modal-header"><div><p className="attendance-eyebrow">ATTENDANCE PROFILE</p><h2 id="attendance-details-title">Attendance details</h2></div><button aria-label="Close details" className="attendance-modal-close" onClick={() => setSelectedRecord(null)} type="button"><X size={18} /></button></header>
						<div className="attendance-profile-heading"><span className="attendance-avatar is-large">{selectedRecord.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span><div><h3>{selectedRecord.fullName}</h3><p>{selectedRecord.studentId}</p></div><span className={`attendance-status-badge ${selectedRecord.status === "Present" ? "is-active" : selectedRecord.status === "Absent" ? "is-inactive" : ""}`}><span />{selectedRecord.status}</span></div>
						<dl className="attendance-details-grid">{[["Record ID", selectedRecord.recordId], ["Student ID", selectedRecord.studentId], ["Department", selectedRecord.department], ["Date", selectedRecord.date], ["Status", selectedRecord.status], ["Remarks", selectedRecord.remarks || "Not provided"]].map(([l, v]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}</dl>
						<footer className="attendance-modal-footer"><button className="attendance-secondary-button" onClick={() => setSelectedRecord(null)} type="button">Close</button><button className="attendance-primary-button" onClick={() => openEditForm(selectedRecord)} type="button"><Pencil size={15} />Edit record</button></footer>
					</section>
				</div>
			)}

			{deleteTarget && (
				<div className="attendance-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
					<section aria-labelledby="delete-attendance-title" aria-modal="true" className="attendance-modal attendance-confirm-modal" role="alertdialog">
						<div className="attendance-delete-icon"><Trash2 size={20} /></div><h2 id="delete-attendance-title">Delete attendance record?</h2>
						<p>Remove <strong>{deleteTarget.fullName}</strong> ({deleteTarget.recordId}) from this demo list? This change only affects the current page session.</p>
						<footer className="attendance-modal-footer"><button className="attendance-secondary-button" onClick={() => setDeleteTarget(null)} type="button">Keep record</button><button className="attendance-danger-button" onClick={confirmDelete} type="button"><Trash2 size={15} />Delete record</button></footer>
					</section>
				</div>
			)}
		</main>
	);
}
