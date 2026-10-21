import { useState } from "react";
import { CirclePlus, Eye, FilterX, Pencil, Plus, Search, Trash2, X, FileText } from "lucide-react";
import "./ExamTimetable.css";

const examTypes = ["Midterm", "Final", "Quiz", "Practical"];
const departments = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Biotechnology", "Business Administration"];
const classes = ["CS-3A", "CS-2B", "EE-2A", "ME-2B", "BT-3A"];
const subjects = ["Algorithms", "Data Structures", "Circuit Analysis", "Thermodynamics", "Genetics"];

const initialExams = [
	{ uid: "ex-1", examId: "EX-2026-001", examName: "Midterm Examination", examType: "Midterm", department: "Computer Science", className: "CS-3A", subject: "Algorithms", date: "2026-11-10", startTime: "09:00", endTime: "11:00", room: "Hall A", maxMarks: "100" },
];

const blankExam = { examId: "", examName: "", examType: "Midterm", department: "", className: "", subject: "", date: "", startTime: "", endTime: "", room: "", maxMarks: "" };

const formFields = [
	{ name: "examId", label: "Exam ID", required: true, placeholder: "e.g. EX-2026-010" },
	{ name: "examName", label: "Exam name", required: true, placeholder: "e.g. Midterm Examination" },
	{ name: "examType", label: "Exam type", required: true, options: examTypes },
	{ name: "department", label: "Department", required: true, options: departments },
	{ name: "className", label: "Class / Section", required: true, options: classes },
	{ name: "subject", label: "Subject", required: true, options: subjects },
	{ name: "date", label: "Date", required: true, type: "date" },
	{ name: "startTime", label: "Start time", required: true, type: "time" },
	{ name: "endTime", label: "End time", required: true, type: "time" },
	{ name: "room", label: "Room", required: true, placeholder: "e.g. Hall A" },
	{ name: "maxMarks", label: "Maximum marks", required: true, type: "number", placeholder: "e.g. 100" },
];

function newUid() { return `exam-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

export default function ExamTimetable() {
	const [exams, setExams] = useState(initialExams);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ department: "", examType: "", date: "" });
	const [formOpen, setFormOpen] = useState(false);
	const [editingUid, setEditingUid] = useState(null);
	const [draft, setDraft] = useState(blankExam);
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [selectedExam, setSelectedExam] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [feedback, setFeedback] = useState(null);

	const normalizedSearch = search.trim().toLowerCase();
	const visible = exams.filter((e) => {
		const matchesSearch = !normalizedSearch || [e.examId, e.examName, e.subject].some((v) => v.toLowerCase().includes(normalizedSearch));
		return matchesSearch &&
			(!filters.department || e.department === filters.department) &&
			(!filters.examType || e.examType === filters.examType) &&
			(!filters.date || e.date === filters.date);
	});

	const hasFilters = Boolean(normalizedSearch || Object.values(filters).some(Boolean));

	function updateFilter(name, value) { setFilters((c) => ({ ...c, [name]: value })); }
	function clearFilters() { setSearch(""); setFilters({ department: "", examType: "", date: "" }); }
	function openCreateForm() { setEditingUid(null); setDraft(blankExam); setErrors({}); setFormError(""); setFormOpen(true); }
	function openEditForm(e) { setSelectedExam(null); setEditingUid(e.uid); setDraft({ ...e }); setErrors({}); setFormError(""); setFormOpen(true); }

	function validateDraft() {
		const nextErrors = {};
		for (const field of formFields) {
			if (field.required && !String(draft[field.name] ?? "").trim()) nextErrors[field.name] = `${field.label} is required.`;
		}
		if (draft.startTime && draft.endTime && draft.endTime <= draft.startTime) nextErrors.endTime = "End time must be after start time.";
		const conflict = exams.find((e) => e.uid !== editingUid && e.date === draft.date && e.room === draft.room && !(draft.endTime <= e.startTime || draft.startTime >= e.endTime));
		if (conflict) nextErrors.room = "This room is already booked for an overlapping time.";
		const duplicate = exams.find((e) => e.uid !== editingUid && e.examId.toLowerCase() === draft.examId.trim().toLowerCase());
		if (duplicate) nextErrors.examId = "This exam ID is already in use.";
		return nextErrors;
	}

	function handleSave(event) {
		event.preventDefault();
		const nextErrors = validateDraft();
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) { setFormError("Review the highlighted fields and try again."); return; }
		const record = { ...draft, uid: editingUid ?? newUid(), examId: draft.examId.trim(), examName: draft.examName.trim(), room: draft.room.trim(), maxMarks: draft.maxMarks.trim() };
		if (editingUid) {
			setExams((c) => c.map((e) => e.uid === editingUid ? record : e));
			setFeedback({ type: "success", message: `${record.examName} updated in this demo session.` });
		} else {
			setExams((c) => [record, ...c]);
			setFeedback({ type: "success", message: `${record.examName} added to this demo session.` });
		}
		setFormOpen(false);
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		setExams((c) => c.filter((e) => e.uid !== deleteTarget.uid));
		setFeedback({ type: "success", message: `${deleteTarget.examName} removed from this demo session.` });
		setDeleteTarget(null);
		if (selectedExam?.uid === deleteTarget.uid) setSelectedExam(null);
	}

	function setDraftField(name, value) {
		setDraft((c) => ({ ...c, [name]: value }));
		setErrors((c) => { if (!c[name]) return c; const n = { ...c }; delete n[name]; return n; });
	}

	return (
		<main className="exam-page">
			<header className="exam-page-header">
				<div>
					<p className="exam-eyebrow">ADMINISTRATION / EXAMINATIONS</p>
					<h1>Examination schedule</h1>
					<p>Coordinate exam schedules, rooms, and assessment windows.</p>
				</div>
				<button className="exam-primary-button" onClick={openCreateForm} type="button"><Plus size={17} /> Add exam</button>
			</header>

			<p className="exam-demo-notice">Sample examination records · Changes stay in this page's demo session and are not saved permanently.</p>

			{feedback && (
				<div className={`exam-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="exam-directory">
				<div className="exam-directory-heading">
					<div><h2>Examination list</h2><p>Showing {visible.length} of {exams.length} exams</p></div>
				</div>
				<div className="exam-toolbar">
					<label className="exam-search"><Search size={17} aria-hidden="true" /><input aria-label="Search exams" onChange={(e) => setSearch(e.target.value)} placeholder="Search exam ID, name, or subject" value={search} /></label>
					<div className="exam-filters">
						<select aria-label="Filter by department" onChange={(e) => updateFilter("department", e.target.value)} value={filters.department}><option value="">All departments</option>{departments.map((d) => <option key={d}>{d}</option>)}</select>
						<select aria-label="Filter by exam type" onChange={(e) => updateFilter("examType", e.target.value)} value={filters.examType}><option value="">All types</option>{examTypes.map((t) => <option key={t}>{t}</option>)}</select>
						<input aria-label="Filter by date" onChange={(e) => updateFilter("date", e.target.value)} type="date" value={filters.date} />
					</div>
					<button className="exam-clear-button" disabled={!hasFilters} onClick={clearFilters} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				{visible.length ? (
					<div className="exam-table-wrap">
						<table className="exam-table">
							<thead><tr><th>Exam</th><th>Type</th><th>Department</th><th>Class</th><th>Subject</th><th>Date</th><th>Time</th><th>Room</th><th>Max marks</th><th><span className="exam-visually-hidden">Actions</span></th></tr></thead>
							<tbody>
								{visible.map((e) => (
									<tr key={e.uid}>
										<td><div className="exam-name-cell"><span className="exam-avatar"><FileText size={14} /></span><span><strong>{e.examName}</strong><small>{e.examId}</small></span></div></td>
										<td>{e.examType}</td>
										<td>{e.department}</td>
										<td>{e.className}</td>
										<td>{e.subject}</td>
										<td>{e.date}</td>
										<td>{e.startTime} - {e.endTime}</td>
										<td>{e.room}</td>
										<td>{e.maxMarks}</td>
										<td><div className="exam-row-actions">
											<button aria-label={`View ${e.examName}`} onClick={() => setSelectedExam(e)} title="View details" type="button"><Eye size={16} /></button>
											<button aria-label={`Edit ${e.examName}`} onClick={() => openEditForm(e)} title="Edit exam" type="button"><Pencil size={15} /></button>
											<button aria-label={`Delete ${e.examName}`} onClick={() => setDeleteTarget(e)} title="Delete exam" type="button"><Trash2 size={15} /></button>
										</div></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="exam-empty-state"><div><Search size={20} /></div><h3>No examinations found</h3><p>Try a different search or clear your filters.</p><button className="exam-secondary-button" onClick={clearFilters} type="button">Clear search and filters</button></div>
				)}
			</section>

			{formOpen && (
				<div className="exam-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}>
					<section aria-labelledby="exam-form-title" aria-modal="true" className="exam-modal exam-form-modal" role="dialog">
						<header className="exam-modal-header"><div><p className="exam-eyebrow">EXAMINATION</p><h2 id="exam-form-title">{editingUid ? "Edit exam" : "Add exam"}</h2></div><button aria-label="Close form" className="exam-modal-close" onClick={() => setFormOpen(false)} type="button"><X size={18} /></button></header>
						<form noValidate onSubmit={handleSave}>
							<p className="exam-required-note">Fields marked <span>*</span> are required.</p>
							{formError && <p className="exam-form-error" role="alert">{formError}</p>}
							<div className="exam-form-grid">
								{formFields.map((field) => (
									<div className={`exam-form-field${errors[field.name] ? " has-error" : ""}`} key={field.name}>
										<label htmlFor={`exam-${field.name}`}>{field.label}{field.required && <span> *</span>}</label>
										{field.options ? (
											<select id={`exam-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} value={draft[field.name]}><option value="">Select {field.label.toLowerCase()}</option>{field.options.map((o) => <option key={o}>{o}</option>)}</select>
										) : (
											<input id={`exam-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} placeholder={field.placeholder} type={field.type ?? "text"} value={draft[field.name]} />
										)}
										{errors[field.name] && <small className="exam-field-error">{errors[field.name]}</small>}
									</div>
								))}
							</div>
							<footer className="exam-modal-footer"><button className="exam-secondary-button" onClick={() => setFormOpen(false)} type="button">Cancel</button><button className="exam-primary-button" type="submit"><CirclePlus size={16} />{editingUid ? "Save changes" : "Add exam"}</button></footer>
						</form>
					</section>
				</div>
			)}

			{selectedExam && (
				<div className="exam-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedExam(null); }}>
					<section aria-labelledby="exam-details-title" aria-modal="true" className="exam-modal exam-details-modal" role="dialog">
						<header className="exam-modal-header"><div><p className="exam-eyebrow">EXAMINATION</p><h2 id="exam-details-title">Exam details</h2></div><button aria-label="Close details" className="exam-modal-close" onClick={() => setSelectedExam(null)} type="button"><X size={18} /></button></header>
						<dl className="exam-details-grid">{[["Exam ID", selectedExam.examId], ["Exam name", selectedExam.examName], ["Type", selectedExam.examType], ["Department", selectedExam.department], ["Class", selectedExam.className], ["Subject", selectedExam.subject], ["Date", selectedExam.date], ["Time", `${selectedExam.startTime} - ${selectedExam.endTime}`], ["Room", selectedExam.room], ["Max marks", selectedExam.maxMarks]].map(([l, v]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}</dl>
						<footer className="exam-modal-footer"><button className="exam-secondary-button" onClick={() => setSelectedExam(null)} type="button">Close</button><button className="exam-primary-button" onClick={() => openEditForm(selectedExam)} type="button"><Pencil size={15} />Edit exam</button></footer>
					</section>
				</div>
			)}

			{deleteTarget && (
				<div className="exam-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
					<section aria-labelledby="delete-exam-title" aria-modal="true" className="exam-modal exam-confirm-modal" role="alertdialog">
						<div className="exam-delete-icon"><Trash2 size={20} /></div><h2 id="delete-exam-title">Delete examination?</h2>
						<p>Remove <strong>{deleteTarget.examName}</strong> ({deleteTarget.examId}) from this demo list? This change only affects the current page session.</p>
						<footer className="exam-modal-footer"><button className="exam-secondary-button" onClick={() => setDeleteTarget(null)} type="button">Keep exam</button><button className="exam-danger-button" onClick={confirmDelete} type="button"><Trash2 size={15} />Delete exam</button></footer>
					</section>
				</div>
			)}
		</main>
	);
}
