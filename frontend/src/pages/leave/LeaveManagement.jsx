import { useState } from "react";
import { CirclePlus, Eye, FilterX, Pencil, Plus, Search, Trash2, CheckCircle2, XCircle, X } from "lucide-react";
import "./LeaveManagement.css";

const roles = ["Student", "Faculty"];
const leaveTypes = ["Sick Leave", "Casual Leave", "Earned Leave", "On Duty"];
const statuses = ["Pending", "Approved", "Rejected"];

const initialRequests = [
	{ uid: "lr-1", requestId: "LV-2026-001", applicantName: "Aarav Mehta", applicantRole: "Student", department: "Computer Science", leaveType: "Sick Leave", startDate: "2026-10-22", endDate: "2026-10-23", reason: "Fever and rest", submissionDate: "2026-10-20", status: "Pending", decisionNote: "" },
	{ uid: "lr-2", requestId: "LV-2026-002", applicantName: "Dr. Maya Chen", applicantRole: "Faculty", department: "Computer Science", leaveType: "On Duty", startDate: "2026-10-25", endDate: "2026-10-26", reason: "Conference attendance", submissionDate: "2026-10-19", status: "Approved", decisionNote: "Approved by admin" },
	{ uid: "lr-3", requestId: "LV-2026-003", applicantName: "Sofia Bennett", applicantRole: "Student", department: "Electrical Engineering", leaveType: "Casual Leave", startDate: "2026-10-28", endDate: "2026-10-28", reason: "Family function", submissionDate: "2026-10-18", status: "Rejected", decisionNote: "Exams week" },
];

const blankRequest = { requestId: "", applicantName: "", applicantRole: "Student", department: "", leaveType: "", startDate: "", endDate: "", reason: "", status: "Pending", decisionNote: "" };

const formFields = [
	{ name: "requestId", label: "Request ID", required: true, placeholder: "e.g. LV-2026-010" },
	{ name: "applicantName", label: "Applicant name", required: true, placeholder: "Full name" },
	{ name: "applicantRole", label: "Applicant role", required: true, options: roles },
	{ name: "department", label: "Department", required: true, options: ["Biotechnology", "Business Administration", "Computer Science", "Electrical Engineering", "Mechanical Engineering"] },
	{ name: "leaveType", label: "Leave type", required: true, options: leaveTypes },
	{ name: "startDate", label: "Start date", required: true, type: "date" },
	{ name: "endDate", label: "End date", required: true, type: "date" },
	{ name: "reason", label: "Reason", required: true, placeholder: "Reason for leave" },
];

function newUid() { return `leave-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

export default function LeaveManagement() {
	const [requests, setRequests] = useState(initialRequests);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ role: "", leaveType: "", status: "", dateFrom: "", dateTo: "" });
	const [formOpen, setFormOpen] = useState(false);
	const [editingUid, setEditingUid] = useState(null);
	const [draft, setDraft] = useState(blankRequest);
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [decisionTarget, setDecisionTarget] = useState(null);
	const [decisionNote, setDecisionNote] = useState("");
	const [feedback, setFeedback] = useState(null);

	const normalizedSearch = search.trim().toLowerCase();
	const visible = requests.filter((r) => {
		const matchesSearch = !normalizedSearch || r.applicantName.toLowerCase().includes(normalizedSearch);
		const inRange = (!filters.dateFrom || r.startDate >= filters.dateFrom) && (!filters.dateTo || r.endDate <= filters.dateTo);
		return matchesSearch && inRange &&
			(!filters.role || r.applicantRole === filters.role) &&
			(!filters.leaveType || r.leaveType === filters.leaveType) &&
			(!filters.status || r.status === filters.status);
	});

	const total = requests.length;
	const pending = requests.filter((r) => r.status === "Pending").length;
	const approved = requests.filter((r) => r.status === "Approved").length;
	const rejected = requests.filter((r) => r.status === "Rejected").length;
	const hasFilters = Boolean(normalizedSearch || Object.values(filters).some(Boolean));

	function updateFilter(name, value) { setFilters((c) => ({ ...c, [name]: value })); }
	function clearFilters() { setSearch(""); setFilters({ role: "", leaveType: "", status: "", dateFrom: "", dateTo: "" }); }
	function openCreateForm() { setEditingUid(null); setDraft(blankRequest); setErrors({}); setFormError(""); setFormOpen(true); }
	function openEditForm(r) { setSelectedRequest(null); setEditingUid(r.uid); setDraft({ ...r }); setErrors({}); setFormError(""); setFormOpen(true); }

	function validateDraft() {
		const nextErrors = {};
		for (const field of formFields) {
			if (field.required && !String(draft[field.name] ?? "").trim()) nextErrors[field.name] = `${field.label} is required.`;
		}
		if (draft.startDate && draft.endDate && draft.endDate < draft.startDate) nextErrors.endDate = "End date must be on or after start date.";
		const duplicate = requests.find((r) => r.uid !== editingUid && r.requestId.toLowerCase() === draft.requestId.trim().toLowerCase());
		if (duplicate) nextErrors.requestId = "This request ID is already in use.";
		return nextErrors;
	}

	function handleSave(event) {
		event.preventDefault();
		const nextErrors = validateDraft();
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) { setFormError("Review the highlighted fields and try again."); return; }
		const record = { ...draft, uid: editingUid ?? newUid(), requestId: draft.requestId.trim(), applicantName: draft.applicantName.trim(), department: draft.department.trim(), reason: draft.reason.trim(), submissionDate: new Date().toISOString().slice(0, 10), status: draft.status || "Pending", decisionNote: draft.decisionNote?.trim() || "" };
		if (editingUid) {
			setRequests((c) => c.map((r) => r.uid === editingUid ? record : r));
			setFeedback({ type: "success", message: `${record.applicantName} request updated in this demo session.` });
		} else {
			setRequests((c) => [record, ...c]);
			setFeedback({ type: "success", message: `${record.applicantName} leave request added to this demo session.` });
		}
		setFormOpen(false);
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		setRequests((c) => c.filter((r) => r.uid !== deleteTarget.uid));
		setFeedback({ type: "success", message: `${deleteTarget.applicantName} request removed from this demo session.` });
		setDeleteTarget(null);
		if (selectedRequest?.uid === deleteTarget.uid) setSelectedRequest(null);
	}

	function applyDecision(status) {
		if (!decisionTarget) return;
		setRequests((c) => c.map((r) => r.uid === decisionTarget.uid ? { ...r, status, decisionNote: decisionNote.trim() } : r));
		setFeedback({ type: "success", message: `${decisionTarget.applicantName} request ${status.toLowerCase()}.` });
		setDecisionTarget(null);
		setDecisionNote("");
	}

	function setDraftField(name, value) {
		setDraft((c) => ({ ...c, [name]: value }));
		setErrors((c) => { if (!c[name]) return c; const n = { ...c }; delete n[name]; return n; });
	}

	return (
		<main className="leave-page">
			<header className="leave-page-header">
				<div>
					<p className="leave-eyebrow">ACADEMICS / LEAVE</p>
					<h1>Leave management</h1>
					<p>Review leave requests and track approvals.</p>
				</div>
				<button className="leave-primary-button" onClick={openCreateForm} type="button"><Plus size={17} /> Add request</button>
			</header>

			<p className="leave-demo-notice">Sample leave requests · Changes stay in this page's demo session and are not saved permanently.</p>

			{feedback && (
				<div className={`leave-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="leave-summary" aria-label="Leave counts">
				<div><span className="leave-summary-icon"><CheckCircle2 size={17} /></span><span>Total requests</span><strong>{total}</strong></div>
				<div><span className="leave-summary-icon"><CheckCircle2 size={17} /></span><span>Pending</span><strong>{pending}</strong></div>
				<div><span className="leave-summary-icon"><CheckCircle2 size={17} /></span><span>Approved</span><strong>{approved}</strong></div>
				<div><span className="leave-summary-icon"><CheckCircle2 size={17} /></span><span>Rejected</span><strong>{rejected}</strong></div>
			</section>

			<section className="leave-directory">
				<div className="leave-directory-heading">
					<div><h2>Leave requests</h2><p>Showing {visible.length} of {requests.length} requests</p></div>
				</div>
				<div className="leave-toolbar">
					<label className="leave-search"><Search size={17} aria-hidden="true" /><input aria-label="Search leave requests" onChange={(e) => setSearch(e.target.value)} placeholder="Search applicant name" value={search} /></label>
					<div className="leave-filters">
						<select aria-label="Filter by role" onChange={(e) => updateFilter("role", e.target.value)} value={filters.role}><option value="">All roles</option>{roles.map((r) => <option key={r}>{r}</option>)}</select>
						<select aria-label="Filter by leave type" onChange={(e) => updateFilter("leaveType", e.target.value)} value={filters.leaveType}><option value="">All types</option>{leaveTypes.map((t) => <option key={t}>{t}</option>)}</select>
						<select aria-label="Filter by status" onChange={(e) => updateFilter("status", e.target.value)} value={filters.status}><option value="">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
						<input aria-label="From date" onChange={(e) => updateFilter("dateFrom", e.target.value)} type="date" value={filters.dateFrom} />
						<input aria-label="To date" onChange={(e) => updateFilter("dateTo", e.target.value)} type="date" value={filters.dateTo} />
					</div>
					<button className="leave-clear-button" disabled={!hasFilters} onClick={clearFilters} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				{visible.length ? (
					<div className="leave-table-wrap">
						<table className="leave-table">
							<thead><tr><th>Request</th><th>Applicant</th><th>Role</th><th>Department</th><th>Type</th><th>Start</th><th>End</th><th>Status</th><th><span className="leave-visually-hidden">Actions</span></th></tr></thead>
							<tbody>
								{visible.map((r) => (
									<tr key={r.uid}>
										<td className="leave-id-cell">{r.requestId}</td>
										<td>{r.applicantName}</td>
										<td>{r.applicantRole}</td>
										<td>{r.department}</td>
										<td>{r.leaveType}</td>
										<td>{r.startDate}</td>
										<td>{r.endDate}</td>
										<td><span className={`leave-status-badge ${r.status === "Approved" ? "is-active" : r.status === "Rejected" ? "is-inactive" : ""}`}><span />{r.status}</span></td>
										<td><div className="leave-row-actions">
											<button aria-label={`View ${r.applicantName}`} onClick={() => setSelectedRequest(r)} title="View details" type="button"><Eye size={16} /></button>
											<button aria-label={`Edit ${r.applicantName}`} onClick={() => openEditForm(r)} title="Edit request" type="button"><Pencil size={15} /></button>
											{r.status === "Pending" && (
												<>
													<button aria-label={`Approve ${r.applicantName}`} onClick={() => { setDecisionTarget(r); setDecisionNote(""); }} title="Approve" type="button"><CheckCircle2 size={15} /></button>
													<button aria-label={`Reject ${r.applicantName}`} onClick={() => { setDecisionTarget({ ...r, _reject: true }); setDecisionNote(""); }} title="Reject" type="button"><XCircle size={15} /></button>
												</>
											)}
											<button aria-label={`Delete ${r.applicantName}`} onClick={() => setDeleteTarget(r)} title="Delete request" type="button"><Trash2 size={15} /></button>
										</div></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="leave-empty-state"><div><Search size={20} /></div><h3>No leave requests found</h3><p>Try a different search or clear your filters.</p><button className="leave-secondary-button" onClick={clearFilters} type="button">Clear search and filters</button></div>
				)}
			</section>

			{formOpen && (
				<div className="leave-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}>
					<section aria-labelledby="leave-form-title" aria-modal="true" className="leave-modal leave-form-modal" role="dialog">
						<header className="leave-modal-header"><div><p className="leave-eyebrow">LEAVE REQUEST</p><h2 id="leave-form-title">{editingUid ? "Edit request" : "Add request"}</h2></div><button aria-label="Close form" className="leave-modal-close" onClick={() => setFormOpen(false)} type="button"><X size={18} /></button></header>
						<form noValidate onSubmit={handleSave}>
							<p className="leave-required-note">Fields marked <span>*</span> are required.</p>
							{formError && <p className="leave-form-error" role="alert">{formError}</p>}
							<div className="leave-form-grid">
								{formFields.map((field) => (
									<div className={`leave-form-field${errors[field.name] ? " has-error" : ""}`} key={field.name}>
										<label htmlFor={`leave-${field.name}`}>{field.label}{field.required && <span> *</span>}</label>
										{field.options ? (
											<select id={`leave-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} value={draft[field.name]}><option value="">Select {field.label.toLowerCase()}</option>{field.options.map((o) => <option key={o}>{o}</option>)}</select>
										) : (
											<input id={`leave-${field.name}`} onChange={(e) => setDraftField(field.name, e.target.value)} placeholder={field.placeholder} type={field.type ?? "text"} value={draft[field.name]} />
										)}
										{errors[field.name] && <small className="leave-field-error">{errors[field.name]}</small>}
									</div>
								))}
								<div className="leave-form-field leave-reason-field"><label htmlFor="leave-reason">Reason</label><textarea id="leave-reason" onChange={(e) => setDraftField("reason", e.target.value)} placeholder="Reason for leave" rows="2" value={draft.reason} /></div>
							</div>
							<footer className="leave-modal-footer"><button className="leave-secondary-button" onClick={() => setFormOpen(false)} type="button">Cancel</button><button className="leave-primary-button" type="submit"><CirclePlus size={16} />{editingUid ? "Save changes" : "Add request"}</button></footer>
						</form>
					</section>
				</div>
			)}

			{selectedRequest && (
				<div className="leave-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedRequest(null); }}>
					<section aria-labelledby="leave-details-title" aria-modal="true" className="leave-modal leave-details-modal" role="dialog">
						<header className="leave-modal-header"><div><p className="leave-eyebrow">LEAVE REQUEST</p><h2 id="leave-details-title">Request details</h2></div><button aria-label="Close details" className="leave-modal-close" onClick={() => setSelectedRequest(null)} type="button"><X size={18} /></button></header>
						<dl className="leave-details-grid">{[["Request ID", selectedRequest.requestId], ["Applicant", selectedRequest.applicantName], ["Role", selectedRequest.applicantRole], ["Department", selectedRequest.department], ["Leave type", selectedRequest.leaveType], ["Start date", selectedRequest.startDate], ["End date", selectedRequest.endDate], ["Submission date", selectedRequest.submissionDate], ["Status", selectedRequest.status], ["Reason", selectedRequest.reason], ["Decision note", selectedRequest.decisionNote || "Not provided"]].map(([l, v]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}</dl>
						<footer className="leave-modal-footer"><button className="leave-secondary-button" onClick={() => setSelectedRequest(null)} type="button">Close</button><button className="leave-primary-button" onClick={() => openEditForm(selectedRequest)} type="button"><Pencil size={15} />Edit request</button></footer>
					</section>
				</div>
			)}

			{decisionTarget && (
				<div className="leave-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setDecisionTarget(null); }}>
					<section aria-labelledby="leave-decision-title" aria-modal="true" className="leave-modal leave-confirm-modal" role="alertdialog">
						<h2 id="leave-decision-title">{decisionTarget._reject ? "Reject" : "Approve"} leave request?</h2>
						<p>{decisionTarget._reject ? "Reject" : "Approve"} <strong>{decisionTarget.applicantName}</strong> ({decisionTarget.requestId})?</p>
						<label>Decision note (optional)<textarea onChange={(e) => setDecisionNote(e.target.value)} rows="2" value={decisionNote} /></label>
						<footer className="leave-modal-footer"><button className="leave-secondary-button" onClick={() => setDecisionTarget(null)} type="button">Cancel</button><button className={decisionTarget._reject ? "leave-danger-button" : "leave-primary-button"} onClick={() => applyDecision(decisionTarget._reject ? "Rejected" : "Approved")} type="button">{decisionTarget._reject ? "Reject" : "Approve"}</button></footer>
					</section>
				</div>
			)}

			{deleteTarget && (
				<div className="leave-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
					<section aria-labelledby="delete-leave-title" aria-modal="true" className="leave-modal leave-confirm-modal" role="alertdialog">
						<div className="leave-delete-icon"><Trash2 size={20} /></div><h2 id="delete-leave-title">Delete leave request?</h2>
						<p>Remove <strong>{deleteTarget.applicantName}</strong> ({deleteTarget.requestId}) from this demo list? This change only affects the current page session.</p>
						<footer className="leave-modal-footer"><button className="leave-secondary-button" onClick={() => setDeleteTarget(null)} type="button">Keep request</button><button className="leave-danger-button" onClick={confirmDelete} type="button"><Trash2 size={15} />Delete request</button></footer>
					</section>
				</div>
			)}
		</main>
	);
}
