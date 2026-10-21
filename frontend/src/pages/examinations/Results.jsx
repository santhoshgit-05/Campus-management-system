import { useState } from "react";
import { CirclePlus, Eye, FilterX, Pencil, Plus, Search, Trash2, X, FileText } from "lucide-react";
import "./Results.css";

const exams = ["EX-2026-001", "EX-2026-002"];
const departments = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Biotechnology", "Business Administration"];
const subjects = ["Algorithms", "Data Structures", "Circuit Analysis", "Thermodynamics", "Genetics"];

const initialResults = [
	{ uid: "res-1", resultId: "RES-2026-001", studentName: "Aarav Mehta", rollNumber: "CMS2026001", examId: "EX-2026-001", subject: "Algorithms", department: "Computer Science", marks: "85", maxMarks: "100" },
];

const blankResult = { resultId: "", studentName: "", rollNumber: "", examId: "", subject: "", department: "", marks: "", maxMarks: "100" };

const formFields = [
	{ name: "resultId", label: "Result ID", required: true, placeholder: "e.g. RES-2026-010" },
	{ name: "studentName", label: "Student name", required: true, placeholder: "Student's full name" },
	{ name: "rollNumber", label: "Roll number", required: true, placeholder: "e.g. CMS2026010" },
	{ name: "examId", label: "Exam ID", required: true, options: exams },
	{ name: "subject", label: "Subject", required: true, options: subjects },
	{ name: "department", label: "Department", required: true, options: departments },
	{ name: "marks", label: "Marks obtained", required: true, type: "number", placeholder: "e.g. 85" },
	{ name: "maxMarks", label: "Maximum marks", required: true, type: "number", placeholder: "e.g. 100" },
];

function newUid() { return `result-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

function gradeFor(marks, max) {
	const pct = max > 0 ? (marks / max) * 100 : 0;
	if (pct >= 90) return "A";
	if (pct >= 80) return "B";
	if (pct >= 70) return "C";
	if (pct >= 60) return "D";
	return "F";
}

function statusFor(marks, max) {
	const pct = max > 0 ? (marks / max) * 100 : 0;
	return pct >= 40 ? "Pass" : "Fail";
}

export default function Results() {
	const [results, setResults] = useState(initialResults);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ examId: "", department: "", subject: "" });
	const [formOpen, setFormOpen] = useState(false);
	const [editingUid, setEditingUid] = useState(null);
	const [draft, setDraft] = useState(blankResult);
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [selectedResult, setSelectedResult] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [feedback, setFeedback] = useState(null);

	const normalizedSearch = search.trim().toLowerCase();
	const visible = results.filter((r) => {
		const matchesSearch = !normalizedSearch || [r.resultId, r.studentName, r.rollNumber].some((v) => v.toLowerCase().includes(normalizedSearch));
		return matchesSearch &&
			(!filters.examId || r.examId === filters.examId) &&
			(!filters.department || r.department === filters.department) &&
			(!filters.subject || r.subject === filters.subject);
	});

	const total = visible.length;
	const avgPct = total ? Math.round(visible.reduce((s, r) => s + (Number(r.marks) / Number(r.maxMarks)) * 100, 0) / total) : 0;
	const passCount = visible.filter((r) => statusFor(Number(r.marks), Number(r.maxMarks)) === "Pass").length;
	const failCount = total - passCount;
	const hasFilters = Boolean(normalizedSearch || Object.values(filters).some(Boolean));

	function updateFilter(name, value) { setFilters((c) => ({ ...c, [name]: value })); }
	function clearFilters() { setSearch(""); setFilters({ examId: "", department: "", subject: "" }); }
	function openCreateForm() { setEditingUid(null); setDraft(blankResult); setErrors({}); setFormError(""); setFormOpen(true); }
	function openEditForm(r) { setSelectedResult(null); setEditingUid(r.uid); setDraft({ ...r }); setErrors({}); setFormError(""); setFormOpen(true); }

	function validateDraft() {
		const nextErrors = {};
		for (const field of formFields) {
			if (field.required && !String(draft[field.name] ?? "").trim()) nextErrors[field.name] = `${field.label} is required.`;
		}
		const marks = Number(draft.marks);
		const max = Number(draft.maxMarks);
		if (draft.marks && (isNaN(marks) || marks < 0)) nextErrors.marks = "Marks must be a non-negative number.";
		if (draft.maxMarks && (isNaN(max) || max <= 0)) nextErrors.maxMarks = "Maximum marks must be greater than zero.";
		if (!isNaN(marks) && !isNaN(max) && max > 0 && marks > max) nextErrors.marks = "Marks cannot exceed maximum marks.";
		const duplicate = results.find((r) => r.uid !== editingUid && r.resultId.toLowerCase() === draft.resultId.trim().toLowerCase());
		if (duplicate) nextErrors.resultId = "This result ID is already in use.";
		return nextErrors;
	}

	function handleSave(event) {
		event.preventDefault();
		const nextErrors = validateDraft();
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) { setFormError("Review the highlighted fields and try again."); return; }
		const record = { ...draft, uid: editingUid ?? newUid(), resultId: draft.resultId.trim(), studentName: draft.studentName.trim(), rollNumber: draft.rollNumber.trim(), marks: draft.marks.trim(), maxMarks: draft.maxMarks.trim() };
		if (editingUid) {
			setResults((c) => c.map((r) => r.uid === editingUid ? record : r));
			setFeedback({ type: "success", message: `${record.studentName} result updated in this demo session.` });
		} else {
			setResults((c) => [record, ...c]);
			setFeedback({ type: "success", message: `${record.studentName} result added to this demo session.` });
		}
		setFormOpen(false);
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		setResults((c) => c.filter((r) => r.uid !== deleteTarget.uid));
		setFeedback({ type: "success", message: `${deleteTarget.studentName} result removed from this demo session.` });
		setDeleteTarget(null);
		if (selectedResult?.uid === deleteTarget.uid) setSelectedResult(null);
	}

	function setDraftField(name, value) {
		setDraft((c) => ({ ...c, [name]: value }));
		setErrors((c) => { if (!c[name]) return c; const n = { ...c }; delete n[name]; return n; });
	}

	return (
		<main className="exam-page">
			<header className="exam-page-header">
				<div>
					<p className="exam-eyebrow">ADMINISTRATION / RESULTS</p>
					<h1>Examination results</h1>
					<p>Enter marks and review grades and pass/fail status.</p>
				</div>
				<button className="exam-primary-button" onClick={openCreateForm} type="button"><Plus size={17} /> Add result</button>
			</header>

			<p className="exam-demo-notice">Sample result records · Changes stay in this page's demo session and are not saved permanently.</p>

			{feedback && (
				<div className={`exam-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="exam-summary" aria-label="Result counts">
				<div><span className="exam-summary-icon"><FileText size={17} /></span><span>Total results</span><strong>{total}</strong></div>
				<div><span className="exam-summary-icon"><FileText size={17} /></span><span>Average %</span><strong>{avgPct}%</strong></div>
				<div><span className="exam-summary-icon"><FileText size={17} /></span><span>Pass</span><strong>{passCount}</strong></div>
				<div><span className="exam-summary-icon"><FileText size={17} /></span><span>Fail</span><strong>{failCount}</strong></div>
			</section>

			<section className="exam-directory">
				<div className="exam-directory-heading">
					<div><h2>Results table</h2><p>Showing {visible.length} of {results.length} results</p></div>
				</div>
				<div className="exam-toolbar">
					<label className="exam-search"><Search size={17} aria-hidden="true" /><input aria-label="Search results" onChange={(e) => setSearch(e.target.value)} placeholder="Search result ID, student, or roll" value={search} /></label>
					<div className="exam-filters">
						<select aria-label="Filter by exam" onChange={(e) => updateFilter("examId", e.target.value)} value={filters.examId}><option value="">All exams</option>{exams.map((x) => <option key={x}>{x}</option>)}</select>
						<select aria-label="Filter by department" onChange={(e) => updateFilter("department", e.target.value)} value={filters.department}><option value="">All departments</option>{departments.map((d) => <option key={d}>{d}</option>)}</select>
						<select aria-label="Filter by subject" onChange={(e) => updateFilter("subject", e.target.value)} value={filters.subject}><option value="">All subjects</option>{subjects.map((s) => <option key={s}>{s}</option>)}</select>
					</div>
					<button className="exam-clear-button" disabled={!hasFilters} onClick={clearFilters} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				{visible.length ? (
					<div className="exam-table-wrap">
						<table className="exam-table">
							<thead><tr><th>Result</th><th>Student</th><th>Roll no.</th><th>Exam</th><th>Subject</th><th>Department</th><th>Marks</th><th>%</th><th>Grade</th><th>Status</th><th><span className="exam-visually-hidden">Actions</span></th></tr></thead>
							<tbody>
								{visible.map((r) => {
									const pct = Math.round((Number(r.marks) / Number(r.maxMarks)) * 100);
									const grade = gradeFor(Number(r.marks), Number(r.maxMarks));
									const status = statusFor(Number(r.marks), Number(r.maxMarks));
									return (
										<tr key={r.uid}>
											<td className="exam-id-cell">{r.resultId}</td>
											<td>{r.studentName}</td>
											<td>{r.rollNumber}</td>
											<td>{r.examId}</td>
											<td>{r.subject}</td>
											<td>{r.department}</td>
											<td>{r.marks}/{r.maxMarks}</td>
											<td>{pct}%</td>
											<td>{grade}</td>
											<td><span className={`exam-status-badge ${status === "Pass" ? "is-active" : "is-inactive"}`}><span />{status}</span></td>
											<td><div className="exam-row-actions">
												<button aria-label={`View ${r.studentName}`} onClick={() => setSelectedResult(r)} title="View details" type="button"><Eye size={16} /></button>
												<button aria-label={`Edit ${r.studentName}`} onClick={() => openEditForm(r)} title="Edit result" type="button"><Pencil size={15} /></button>
												<button aria-label={`Delete ${r.studentName}`} onClick={() => setDeleteTarget(r)} title="Delete result" type="button"><Trash2 size={15} /></button>
											</div></td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				) : (
					<div className="exam-empty-state"><div><Search size={20} /></div><h3>No results found</h3><p>Try a different search or clear your filters.</p><button className="exam-secondary-button" onClick={clearFilters} type="button">Clear search and filters</button></div>
				)}
			</section>

			{formOpen && (
				<div className="exam-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}>
					<section aria-labelledby="result-form-title" aria-modal="true" className="exam-modal exam-form-modal" role="dialog">
						<header className="exam-modal-header"><div><p className="exam-eyebrow">RESULT</p><h2 id="result-form-title">{editingUid ? "Edit result" : "Add result"}</h2></div><button aria-label="Close form" className="exam-modal-close" onClick={() => setFormOpen(false)} type="button"><X size={18} /></button></header>
						<form noValidate onSubmit={handleSave}>
							<p className="exam-required-note">Fields marked <span>*</span> are required.</p>
							{formError && <p className="exam-form-error" role="alert">{formError}</p>}
							<div className="exam-form-grid">
								{formFields.map((field) => (
									<div className={`exam-form-field${errors[field.name] ? " has-error" : ""}`} key={field.name}>
										<label htmlFor={`result-${field.name}`}>{field.label}{field.required && <span> *</span>}</label>
										{field.options ? (
											<select id={`result-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} value={draft[field.name]}><option value="">Select {field.label.toLowerCase()}</option>{field.options.map((o) => <option key={o}>{o}</option>)}</select>
										) : (
											<input id={`result-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} placeholder={field.placeholder} type={field.type ?? "text"} value={draft[field.name]} />
										)}
										{errors[field.name] && <small className="exam-field-error">{errors[field.name]}</small>}
									</div>
								))}
							</div>
							<footer className="exam-modal-footer"><button className="exam-secondary-button" onClick={() => setFormOpen(false)} type="button">Cancel</button><button className="exam-primary-button" type="submit"><CirclePlus size={16} />{editingUid ? "Save changes" : "Add result"}</button></footer>
						</form>
					</section>
				</div>
			)}

			{selectedResult && (
				<div className="exam-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedResult(null); }}>
					<section aria-labelledby="result-details-title" aria-modal="true" className="exam-modal exam-details-modal" role="dialog">
						<header className="exam-modal-header"><div><p className="exam-eyebrow">RESULT</p><h2 id="result-details-title">Result details</h2></div><button aria-label="Close details" className="exam-modal-close" onClick={() => setSelectedResult(null)} type="button"><X size={18} /></button></header>
						<dl className="exam-details-grid">{[["Result ID", selectedResult.resultId], ["Student", selectedResult.studentName], ["Roll no.", selectedResult.rollNumber], ["Exam", selectedResult.examId], ["Subject", selectedResult.subject], ["Department", selectedResult.department], ["Marks", `${selectedResult.marks}/${selectedResult.maxMarks}`], ["Percentage", `${Math.round((Number(selectedResult.marks) / Number(selectedResult.maxMarks)) * 100)}%`], ["Grade", gradeFor(Number(selectedResult.marks), Number(selectedResult.maxMarks))], ["Status", statusFor(Number(selectedResult.marks), Number(selectedResult.maxMarks))]].map(([l, v]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}</dl>
						<footer className="exam-modal-footer"><button className="exam-secondary-button" onClick={() => setSelectedResult(null)} type="button">Close</button><button className="exam-primary-button" onClick={() => openEditForm(selectedResult)} type="button"><Pencil size={15} />Edit result</button></footer>
					</section>
				</div>
			)}

			{deleteTarget && (
				<div className="exam-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
					<section aria-labelledby="delete-result-title" aria-modal="true" className="exam-modal exam-confirm-modal" role="alertdialog">
						<div className="exam-delete-icon"><Trash2 size={20} /></div><h2 id="delete-result-title">Delete result?</h2>
						<p>Remove <strong>{deleteTarget.studentName}</strong> ({deleteTarget.resultId}) from this demo list? This change only affects the current page session.</p>
						<footer className="exam-modal-footer"><button className="exam-secondary-button" onClick={() => setDeleteTarget(null)} type="button">Keep result</button><button className="exam-danger-button" onClick={confirmDelete} type="button"><Trash2 size={15} />Delete result</button></footer>
					</section>
				</div>
			)}
		</main>
	);
}
