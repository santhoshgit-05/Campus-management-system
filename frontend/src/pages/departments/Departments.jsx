import { useState } from "react";
import {
	CirclePlus,
	Eye,
	FilterX,
	Pencil,
	Plus,
	Search,
	Trash2,
	Building2,
	UsersRound,
	X,
} from "lucide-react";
import "./Departments.css";

const initialDepartments = [
	{ uid: "dept-001", departmentCode: "CSE", departmentName: "Computer Science & Engineering", hod: "Dr. Maya Chen", email: "cse@example.edu", phone: "(555) 020-0001", establishedYear: "2005", description: "Software, systems, and intelligent computing.", status: "Active" },
	{ uid: "dept-002", departmentCode: "ECE", departmentName: "Electronics & Communication Engineering", hod: "Prof. Daniel Brooks", email: "ece@example.edu", phone: "(555) 020-0002", establishedYear: "2003", description: "Electronics, communication, and signal processing.", status: "Active" },
	{ uid: "dept-003", departmentCode: "ME", departmentName: "Mechanical Engineering", hod: "Priya Nair", email: "me@example.edu", phone: "(555) 020-0003", establishedYear: "2000", description: "Thermal, design, and manufacturing engineering.", status: "Active" },
	{ uid: "dept-004", departmentCode: "BT", departmentName: "Biotechnology", hod: "Aisha Rahman", email: "bt@example.edu", phone: "(555) 020-0004", establishedYear: "2010", description: "Molecular biology and bioengineering.", status: "Active" },
	{ uid: "dept-005", departmentCode: "MBA", departmentName: "Business Administration", hod: "Luis Ortega", email: "mba@example.edu", phone: "(555) 020-0005", establishedYear: "2008", description: "Management, finance, and entrepreneurship.", status: "Inactive" },
];

const statuses = ["Active", "Inactive"];

const blankDepartment = {
	departmentCode: "",
	departmentName: "",
	hod: "",
	email: "",
	phone: "",
	establishedYear: "",
	description: "",
	status: "Active",
};

const formFields = [
	{ name: "departmentCode", label: "Department code", required: true, placeholder: "e.g. CSE" },
	{ name: "departmentName", label: "Department name", required: true, placeholder: "Full department name" },
	{ name: "hod", label: "Head of department", required: true, placeholder: "Faculty member's name" },
	{ name: "email", label: "Email", required: true, type: "email", placeholder: "department@example.edu" },
	{ name: "phone", label: "Phone", required: false, type: "tel", placeholder: "(555) 020-0000" },
	{ name: "establishedYear", label: "Established year", required: false, type: "number", placeholder: "e.g. 2005" },
	{ name: "status", label: "Status", required: true, options: statuses },
];

function newUid() {
	return `department-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Departments() {
	const [departments, setDepartments] = useState(initialDepartments);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ status: "" });
	const [formOpen, setFormOpen] = useState(false);
	const [editingUid, setEditingUid] = useState(null);
	const [draft, setDraft] = useState(blankDepartment);
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [selectedDepartment, setSelectedDepartment] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [feedback, setFeedback] = useState(null);

	const normalizedSearch = search.trim().toLowerCase();
	const visibleDepartments = departments.filter((department) => {
		const matchesSearch = !normalizedSearch || [department.departmentCode, department.departmentName, department.hod]
			.some((value) => value.toLowerCase().includes(normalizedSearch));
		return matchesSearch && (!filters.status || department.status === filters.status);
	});
	const activeCount = departments.filter((department) => department.status === "Active").length;
	const inactiveCount = departments.filter((department) => department.status === "Inactive").length;
	const hasFilters = Boolean(normalizedSearch || filters.status);

	function updateFilter(name, value) {
		setFilters((current) => ({ ...current, [name]: value }));
	}
	function clearFilters() {
		setSearch("");
		setFilters({ status: "" });
	}
	function openCreateForm() {
		setEditingUid(null);
		setDraft(blankDepartment);
		setErrors({});
		setFormError("");
		setFormOpen(true);
	}
	function openEditForm(department) {
		setSelectedDepartment(null);
		setEditingUid(department.uid);
		setDraft({ ...department });
		setErrors({});
		setFormError("");
		setFormOpen(true);
	}
	function validateDraft() {
		const nextErrors = {};
		for (const field of formFields) {
			if (field.required && !String(draft[field.name] ?? "").trim()) {
				nextErrors[field.name] = `${field.label} is required.`;
			}
		}
		if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
			nextErrors.email = "Enter a valid email address.";
		}
		const duplicate = departments.find((department) => department.uid !== editingUid && department.departmentCode.toLowerCase() === draft.departmentCode.trim().toLowerCase());
		if (duplicate) nextErrors.departmentCode = "This department code is already in use.";
		return nextErrors;
	}
	function handleSaveDepartment(event) {
		event.preventDefault();
		const nextErrors = validateDraft();
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) {
			setFormError("Review the highlighted fields and try again.");
			return;
		}
		const record = {
			...draft,
			uid: editingUid ?? newUid(),
			departmentCode: draft.departmentCode.trim().toUpperCase(),
			departmentName: draft.departmentName.trim(),
			hod: draft.hod.trim(),
			email: draft.email.trim(),
			phone: draft.phone.trim(),
			establishedYear: draft.establishedYear.trim(),
			description: draft.description.trim(),
		};
		if (editingUid) {
			setDepartments((current) => current.map((department) => department.uid === editingUid ? record : department));
			setFeedback({ type: "success", message: `${record.departmentName} was updated in this demo session.` });
		} else {
			setDepartments((current) => [record, ...current]);
			setFeedback({ type: "success", message: `${record.departmentName} was added to this demo session.` });
		}
		setFormOpen(false);
	}
	function confirmDelete() {
		if (!deleteTarget) return;
		setDepartments((current) => current.filter((department) => department.uid !== deleteTarget.uid));
		setFeedback({ type: "success", message: `${deleteTarget.departmentName} was removed from this demo session.` });
		setDeleteTarget(null);
		if (selectedDepartment?.uid === deleteTarget.uid) setSelectedDepartment(null);
	}
	function setDraftField(name, value) {
		setDraft((current) => ({ ...current, [name]: value }));
		setErrors((current) => {
			if (!current[name]) return current;
			const next = { ...current };
			delete next[name];
			return next;
		});
	}

	return (
		<main className="departments-page">
			<header className="departments-page-header">
				<div>
					<p className="departments-eyebrow">CORE MANAGEMENT</p>
					<h1>Department management</h1>
					<p>Manage academic departments, heads, and contact details.</p>
				</div>
				<button className="departments-primary-button" onClick={openCreateForm} type="button">
					<Plus size={17} /> Add department
				</button>
			</header>

			<p className="departments-demo-notice">Sample department records · Changes stay in this page's demo session and are not saved permanently.</p>

			{feedback && (
				<div className={`departments-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="departments-summary" aria-label="Department counts">
				<div><span className="departments-summary-icon"><Building2 size={17} /></span><span>Total departments</span><strong>{departments.length}</strong></div>
				<div><span className="departments-summary-icon is-active"><Building2 size={17} /></span><span>Active</span><strong>{activeCount}</strong></div>
				<div><span className="departments-summary-icon is-inactive"><Building2 size={17} /></span><span>Inactive</span><strong>{inactiveCount}</strong></div>
			</section>

			<section className="departments-directory">
				<div className="departments-directory-heading">
					<div><h2>Department directory</h2><p>Showing {visibleDepartments.length} of {departments.length} departments</p></div>
				</div>

				<div className="departments-toolbar">
					<label className="departments-search">
						<Search size={17} aria-hidden="true" />
						<input aria-label="Search departments" onChange={(event) => setSearch(event.target.value)} placeholder="Search code, name, or HOD" value={search} />
					</label>
					<div className="departments-filters">
						<select aria-label="Filter by status" onChange={(event) => updateFilter("status", event.target.value)} value={filters.status}>
							<option value="">All statuses</option>
							{statuses.map((status) => <option key={status}>{status}</option>)}
						</select>
					</div>
					<button className="departments-clear-button" disabled={!hasFilters} onClick={clearFilters} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				{visibleDepartments.length ? (
					<div className="departments-table-wrap">
						<table className="departments-table">
							<thead><tr>
								<th>Department</th><th>Code</th><th>Head of department</th><th>Email</th><th>Phone</th><th>Established</th><th>Status</th><th><span className="departments-visually-hidden">Actions</span></th>
							</tr></thead>
							<tbody>
								{visibleDepartments.map((department) => (
									<tr key={department.uid}>
										<td><div className="department-name-cell"><span className="department-avatar">{department.departmentCode.slice(0, 2)}</span><span><strong>{department.departmentName}</strong><small>{department.description || "No description"}</small></span></div></td>
										<td className="department-id-cell">{department.departmentCode}</td>
										<td>{department.hod}</td>
										<td>{department.email}</td>
										<td>{department.phone || "Not provided"}</td>
										<td>{department.establishedYear || "—"}</td>
										<td><span className={`department-status-badge ${department.status === "Active" ? "is-active" : "is-inactive"}`}><span />{department.status}</span></td>
										<td><div className="department-row-actions">
											<button aria-label={`View ${department.departmentName}`} onClick={() => setSelectedDepartment(department)} title="View details" type="button"><Eye size={16} /></button>
											<button aria-label={`Edit ${department.departmentName}`} onClick={() => openEditForm(department)} title="Edit department" type="button"><Pencil size={15} /></button>
											<button aria-label={`Delete ${department.departmentName}`} onClick={() => setDeleteTarget(department)} title="Delete department" type="button"><Trash2 size={15} /></button>
										</div></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="departments-empty-state">
						<div><Search size={20} /></div>
						<h3>No departments found</h3>
						<p>Try a different search or clear your filters to see all demo records.</p>
						<button className="departments-secondary-button" onClick={clearFilters} type="button">Clear search and filters</button>
					</div>
				)}
			</section>

			{formOpen && (
				<div className="departments-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}>
					<section aria-labelledby="department-form-title" aria-modal="true" className="departments-modal departments-form-modal" role="dialog">
						<header className="departments-modal-header"><div><p className="departments-eyebrow">DEPARTMENT RECORD</p><h2 id="department-form-title">{editingUid ? "Edit department" : "Add department"}</h2></div><button aria-label="Close form" className="departments-modal-close" onClick={() => setFormOpen(false)} type="button"><X size={18} /></button></header>
						<form noValidate onSubmit={handleSaveDepartment}>
							<p className="departments-required-note">Fields marked <span>*</span> are required.</p>
							{formError && <p className="departments-form-error" role="alert">{formError}</p>}
							<div className="departments-form-grid">
								{formFields.map((field) => (
									<div className={`departments-form-field${errors[field.name] ? " has-error" : ""}`} key={field.name}>
										<label htmlFor={`department-${field.name}`}>{field.label}{field.required && <span> *</span>}</label>
										{field.options ? (
											<select id={`department-${field.name}`} onChange={(event) => setDraftField(field.name, event.target.value)} value={draft[field.name]}>
												<option value="">Select {field.label.toLowerCase()}</option>
												{field.options.map((option) => <option key={option}>{option}</option>)}
											</select>
										) : (
											<input id={`department-${field.name}`} onChange={(event) => setDraftField(field.name, event.target.value)} placeholder={field.placeholder} type={field.type ?? "text"} value={draft[field.name]} />
										)}
										{errors[field.name] && <small className="departments-field-error">{errors[field.name]}</small>}
									</div>
								))}
								<div className="departments-form-field departments-description-field"><label htmlFor="department-description">Description</label><textarea id="department-description" onChange={(event) => setDraftField("description", event.target.value)} placeholder="Short department summary" rows="2" value={draft.description} /></div>
							</div>
							<footer className="departments-modal-footer"><button className="departments-secondary-button" onClick={() => setFormOpen(false)} type="button">Cancel</button><button className="departments-primary-button" type="submit"><CirclePlus size={16} />{editingUid ? "Save changes" : "Add department"}</button></footer>
						</form>
					</section>
				</div>
			)}

			{selectedDepartment && (
				<div className="departments-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedDepartment(null); }}>
					<section aria-labelledby="department-details-title" aria-modal="true" className="departments-modal departments-details-modal" role="dialog">
						<header className="departments-modal-header"><div><p className="departments-eyebrow">DEPARTMENT PROFILE</p><h2 id="department-details-title">Department details</h2></div><button aria-label="Close details" className="departments-modal-close" onClick={() => setSelectedDepartment(null)} type="button"><X size={18} /></button></header>
						<div className="departments-profile-heading"><span className="department-avatar is-large">{selectedDepartment.departmentCode.slice(0, 2)}</span><div><h3>{selectedDepartment.departmentName}</h3><p>{selectedDepartment.departmentCode}</p></div><span className={`department-status-badge ${selectedDepartment.status === "Active" ? "is-active" : "is-inactive"}`}><span />{selectedDepartment.status}</span></div>
						<dl className="departments-details-grid">
							{[["Code", selectedDepartment.departmentCode], ["Head of department", selectedDepartment.hod], ["Email", selectedDepartment.email], ["Phone", selectedDepartment.phone || "Not provided"], ["Established year", selectedDepartment.establishedYear || "Not provided"], ["Status", selectedDepartment.status], ["Description", selectedDepartment.description || "Not provided"]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
						</dl>
						<footer className="departments-modal-footer"><button className="departments-secondary-button" onClick={() => setSelectedDepartment(null)} type="button">Close</button><button className="departments-primary-button" onClick={() => openEditForm(selectedDepartment)} type="button"><Pencil size={15} />Edit department</button></footer>
					</section>
				</div>
			)}

			{deleteTarget && (
				<div className="departments-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}>
					<section aria-labelledby="delete-department-title" aria-modal="true" className="departments-modal departments-confirm-modal" role="alertdialog">
						<div className="departments-delete-icon"><Trash2 size={20} /></div><h2 id="delete-department-title">Delete department?</h2>
						<p>Remove <strong>{deleteTarget.departmentName}</strong> ({deleteTarget.departmentCode}) from this demo list? This change only affects the current page session.</p>
						<footer className="departments-modal-footer"><button className="departments-secondary-button" onClick={() => setDeleteTarget(null)} type="button">Keep department</button><button className="departments-danger-button" onClick={confirmDelete} type="button"><Trash2 size={15} />Delete department</button></footer>
					</section>
				</div>
			)}
		</main>
	);
}
