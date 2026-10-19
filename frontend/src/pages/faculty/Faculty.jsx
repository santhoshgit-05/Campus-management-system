import { useState } from "react";
import {
	Eye,
	FilterX,
	Pencil,
	Plus,
	Search,
	Trash2,
	UserRoundCheck,
	UsersRound,
	UserX,
	X,
} from "lucide-react";
import "./Faculty.css";

const departments = ["Biotechnology", "Business Administration", "Computer Science", "Electrical Engineering", "Mechanical Engineering"];
const designations = ["Professor", "Associate Professor", "Assistant Professor", "Senior Lecturer", "Lecturer", "Teaching Fellow"];
const employmentStatuses = ["Active", "Inactive", "On Leave"];

const initialFaculty = [
	{ uid: "faculty-demo-001", facultyId: "FAC-2026-001", fullName: "Dr. Maya Chen", email: "maya.chen@example.edu", phone: "+1 (555) 010-0201", department: "Computer Science", designation: "Associate Professor", assignedSubjects: ["Algorithms", "Data Structures"], status: "Active", joiningDate: "2018-08-15", qualification: "Ph.D. Computer Science", address: "18 Cedar Lane, Brookfield", availability: [{ day: "Monday", time: "09:00 - 10:30", subject: "Algorithms", className: "CS-3A", room: "North 204" }, { day: "Wednesday", time: "11:00 - 12:30", subject: "Data Structures", className: "CS-2B", room: "North 118" }, { day: "Friday", time: "14:00 - 15:30", subject: "Algorithms Lab", className: "CS-3A", room: "Lab 3" }] },
	{ uid: "faculty-demo-002", facultyId: "FAC-2026-002", fullName: "Prof. Daniel Brooks", email: "daniel.brooks@example.edu", phone: "(555) 010-0202", department: "Electrical Engineering", designation: "Professor", assignedSubjects: ["Circuit Analysis", "Signals & Systems"], status: "Active", joiningDate: "2012-01-09", qualification: "Ph.D. Electrical Engineering", address: "42 Oak Avenue, Fairview", availability: [{ day: "Tuesday", time: "10:00 - 11:30", subject: "Circuit Analysis", className: "EE-2A", room: "West 105" }, { day: "Thursday", time: "13:00 - 14:30", subject: "Signals & Systems", className: "EE-3B", room: "West 210" }] },
	{ uid: "faculty-demo-003", facultyId: "FAC-2026-003", fullName: "Aisha Rahman", email: "aisha.rahman@example.edu", phone: "+44 20 5555 0103", department: "Biotechnology", designation: "Assistant Professor", assignedSubjects: ["Cell Biology", "Genetics"], status: "Active", joiningDate: "2021-07-01", qualification: "Ph.D. Molecular Biology", address: "West Hall, Faculty Suite 12", availability: [{ day: "Monday", time: "13:00 - 14:30", subject: "Cell Biology", className: "BT-2A", room: "South 306" }, { day: "Thursday", time: "09:00 - 10:30", subject: "Genetics", className: "BT-3A", room: "South 212" }] },
	{ uid: "faculty-demo-004", facultyId: "FAC-2026-004", fullName: "Luis Ortega", email: "luis.ortega@example.edu", phone: "555.010.0204", department: "Business Administration", designation: "Senior Lecturer", assignedSubjects: ["Marketing Principles", "Business Strategy"], status: "On Leave", joiningDate: "2019-02-11", qualification: "M.B.A. Marketing", address: "77 River Road, Brookfield", availability: [] },
	{ uid: "faculty-demo-005", facultyId: "FAC-2026-005", fullName: "Priya Nair", email: "priya.nair@example.edu", phone: "(555) 010-0205", department: "Mechanical Engineering", designation: "Lecturer", assignedSubjects: ["Thermodynamics", "Fluid Mechanics"], status: "Active", joiningDate: "2022-08-22", qualification: "M.S. Mechanical Engineering", address: "9 Pine Street, Lakeside", availability: [{ day: "Tuesday", time: "09:00 - 10:30", subject: "Thermodynamics", className: "ME-2B", room: "East 101" }, { day: "Friday", time: "11:00 - 12:30", subject: "Fluid Mechanics", className: "ME-3A", room: "East 208" }] },
	{ uid: "faculty-demo-006", facultyId: "FAC-2026-006", fullName: "Marcus Reed", email: "marcus.reed@example.edu", phone: "+1-555-010-0206", department: "Computer Science", designation: "Teaching Fellow", assignedSubjects: ["Programming Fundamentals"], status: "Inactive", joiningDate: "2020-09-01", qualification: "M.S. Software Engineering", address: "North Residence, Faculty Unit 4", availability: [] },
];

const blankFaculty = {
	facultyId: "",
	fullName: "",
	email: "",
	phone: "",
	department: "",
	designation: "",
	assignedSubjects: "",
	status: "Active",
	joiningDate: "",
	qualification: "",
	address: "",
};

const formFields = [
	{ name: "facultyId", label: "Faculty ID", required: true, placeholder: "e.g. FAC-2026-007" },
	{ name: "fullName", label: "Full name", required: true, placeholder: "Faculty member's name" },
	{ name: "email", label: "Email", required: true, type: "email", placeholder: "name@example.edu" },
	{ name: "phone", label: "Phone number", required: true, type: "tel", placeholder: "+1 (555) 010-0200" },
	{ name: "department", label: "Department", required: true, options: departments },
	{ name: "designation", label: "Designation", required: true, options: designations },
	{ name: "assignedSubjects", label: "Assigned subjects", required: true, placeholder: "Comma-separated subjects" },
	{ name: "status", label: "Employment status", required: true, options: employmentStatuses },
	{ name: "joiningDate", label: "Joining date", required: true, type: "date" },
	{ name: "qualification", label: "Qualification", required: true, placeholder: "e.g. Ph.D. Computer Science" },
];

function makeUid() {
	return `faculty-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function initials(name) {
	return name.split(/\s+/).filter(Boolean).slice(-2).map((part) => part[0]).join("").toUpperCase();
}

function formatDate(value) {
	if (!value) return "Not provided";
	return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export default function Faculty() {
	const [faculty, setFaculty] = useState(initialFaculty);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ department: "", designation: "", status: "" });
	const [formOpen, setFormOpen] = useState(false);
	const [editingUid, setEditingUid] = useState(null);
	const [draft, setDraft] = useState(blankFaculty);
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [selectedFaculty, setSelectedFaculty] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [feedback, setFeedback] = useState(null);
	const [availabilityUid, setAvailabilityUid] = useState(initialFaculty[0].uid);

	const normalizedSearch = search.trim().toLowerCase();
	const visibleFaculty = faculty.filter((member) => {
		const matchesSearch = !normalizedSearch || [member.facultyId, member.fullName, member.email]
			.some((value) => value.toLowerCase().includes(normalizedSearch));
		return matchesSearch &&
			(!filters.department || member.department === filters.department) &&
			(!filters.designation || member.designation === filters.designation) &&
			(!filters.status || member.status === filters.status);
	});
	const activeCount = faculty.filter((member) => member.status === "Active").length;
	const inactiveCount = faculty.filter((member) => member.status === "Inactive").length;
	const hasFilters = Boolean(normalizedSearch || Object.values(filters).some(Boolean));
	const availabilityFaculty = faculty.find((member) => member.uid === availabilityUid) ?? faculty[0];

	function updateFilter(name, value) {
		setFilters((current) => ({ ...current, [name]: value }));
	}

	function clearFilters() {
		setSearch("");
		setFilters({ department: "", designation: "", status: "" });
	}

	function openCreateForm() {
		setEditingUid(null);
		setDraft(blankFaculty);
		setErrors({});
		setFormError("");
		setFormOpen(true);
	}

	function openEditForm(member) {
		setSelectedFaculty(null);
		setEditingUid(member.uid);
		setDraft({ ...member, assignedSubjects: member.assignedSubjects.join(", ") });
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
		if (draft.phone) {
			const digits = draft.phone.replace(/\D/g, "");
			if (!/^[+\d\s().-]+$/.test(draft.phone.trim()) || digits.length < 7 || digits.length > 15) {
				nextErrors.phone = "Enter a valid phone number with 7 to 15 digits.";
			}
		}
		const duplicateId = faculty.find((member) => member.uid !== editingUid && member.facultyId.toLowerCase() === draft.facultyId.trim().toLowerCase());
		const duplicateEmail = faculty.find((member) => member.uid !== editingUid && member.email.toLowerCase() === draft.email.trim().toLowerCase());
		if (duplicateId) nextErrors.facultyId = "This Faculty ID is already in use.";
		if (duplicateEmail) nextErrors.email = "This email address is already in use.";
		return nextErrors;
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

	function handleSaveFaculty(event) {
		event.preventDefault();
		const nextErrors = validateDraft();
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) {
			setFormError("Review the highlighted fields and try again.");
			return;
		}

		const record = {
			...draft,
			uid: editingUid ?? makeUid(),
			facultyId: draft.facultyId.trim(),
			fullName: draft.fullName.trim(),
			email: draft.email.trim(),
			phone: draft.phone.trim(),
			assignedSubjects: draft.assignedSubjects.split(",").map((subject) => subject.trim()).filter(Boolean),
			qualification: draft.qualification.trim(),
			address: draft.address.trim(),
			availability: editingUid ? faculty.find((member) => member.uid === editingUid)?.availability ?? [] : [],
		};

		if (editingUid) {
			setFaculty((current) => current.map((member) => member.uid === editingUid ? record : member));
			setFeedback({ type: "success", message: `${record.fullName} was updated in this demo session.` });
		} else {
			setFaculty((current) => [record, ...current]);
			setAvailabilityUid((current) => current || record.uid);
			setFeedback({ type: "success", message: `${record.fullName} was added to this demo session.` });
		}
		setFormOpen(false);
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		const remainingFaculty = faculty.filter((member) => member.uid !== deleteTarget.uid);
		setFaculty(remainingFaculty);
		if (availabilityUid === deleteTarget.uid) {
			setAvailabilityUid(remainingFaculty[0]?.uid ?? "");
		}
		setFeedback({ type: "success", message: `${deleteTarget.fullName} was removed from this demo session.` });
		setDeleteTarget(null);
		if (selectedFaculty?.uid === deleteTarget.uid) setSelectedFaculty(null);
	}

	return (
		<main className="faculty-page">
			<header className="faculty-page-header">
				<div>
					<p className="faculty-eyebrow">ACADEMICS / DIRECTORY</p>
					<h1>Faculty management</h1>
					<p>Manage faculty profiles, teaching assignments, and availability.</p>
				</div>
				<button className="faculty-primary-button" onClick={openCreateForm} type="button"><Plus size={17} />Add faculty</button>
			</header>

			<p className="faculty-demo-notice">Fictional faculty records · Changes remain in this page's demo session and are not saved permanently.</p>

			{feedback && (
				<div className={`faculty-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="faculty-summary" aria-label="Faculty counts">
				<div><span className="faculty-summary-icon"><UsersRound size={17} /></span><span>Total faculty</span><strong>{faculty.length}</strong></div>
				<div><span className="faculty-summary-icon is-active"><UserRoundCheck size={17} /></span><span>Active</span><strong>{activeCount}</strong></div>
				<div><span className="faculty-summary-icon is-inactive"><UserX size={17} /></span><span>Inactive</span><strong>{inactiveCount}</strong></div>
			</section>

			<section className="faculty-directory">
				<div className="faculty-directory-heading">
					<div><h2>Faculty directory</h2><p>Showing {visibleFaculty.length} of {faculty.length} faculty members</p></div>
				</div>
				<div className="faculty-toolbar">
					<label className="faculty-search"><Search size={17} aria-hidden="true" /><input aria-label="Search faculty" onChange={(event) => setSearch(event.target.value)} placeholder="Search ID, name, or email" value={search} /></label>
					<div className="faculty-filters">
						<select aria-label="Filter by department" onChange={(event) => updateFilter("department", event.target.value)} value={filters.department}><option value="">All departments</option>{departments.map((department) => <option key={department}>{department}</option>)}</select>
						<select aria-label="Filter by designation" onChange={(event) => updateFilter("designation", event.target.value)} value={filters.designation}><option value="">All designations</option>{designations.map((designation) => <option key={designation}>{designation}</option>)}</select>
						<select aria-label="Filter by employment status" onChange={(event) => updateFilter("status", event.target.value)} value={filters.status}><option value="">All statuses</option>{employmentStatuses.map((status) => <option key={status}>{status}</option>)}</select>
					</div>
					<button className="faculty-clear-button" disabled={!hasFilters} onClick={clearFilters} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				{visibleFaculty.length ? (
					<div className="faculty-table-wrap">
						<table className="faculty-table">
							<thead><tr><th>Faculty member</th><th>Faculty ID</th><th>Phone</th><th>Department</th><th>Designation</th><th>Assigned subjects</th><th>Employment status</th><th><span className="faculty-visually-hidden">Actions</span></th></tr></thead>
							<tbody>
								{visibleFaculty.map((member) => (
									<tr key={member.uid}>
										<td><div className="faculty-name-cell"><span className="faculty-avatar">{initials(member.fullName)}</span><span><strong>{member.fullName}</strong><small>{member.email}</small></span></div></td>
										<td className="faculty-id-cell">{member.facultyId}</td><td>{member.phone}</td><td>{member.department}</td><td>{member.designation}</td>
										<td><span className="faculty-subjects" title={member.assignedSubjects.join(", ")}>{member.assignedSubjects.join(", ") || "Not assigned"}</span></td>
										<td><span className={`faculty-status-badge is-${member.status.toLowerCase().replaceAll(" ", "-")}`}><span />{member.status}</span></td>
										<td><div className="faculty-row-actions"><button aria-label={`View ${member.fullName}`} onClick={() => setSelectedFaculty(member)} title="View details" type="button"><Eye size={16} /></button><button aria-label={`Edit ${member.fullName}`} onClick={() => openEditForm(member)} title="Edit faculty" type="button"><Pencil size={15} /></button><button aria-label={`Delete ${member.fullName}`} onClick={() => setDeleteTarget(member)} title="Delete faculty" type="button"><Trash2 size={15} /></button></div></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="faculty-empty-state"><div><Search size={20} /></div><h3>No faculty found</h3><p>Try a different search or clear the filters to see all demo records.</p><button className="faculty-secondary-button" onClick={clearFilters} type="button">Clear search and filters</button></div>
				)}
			</section>

			<section className="faculty-availability">
				<div className="faculty-availability-heading">
					<div><p className="faculty-eyebrow">SAMPLE SCHEDULE</p><h2>Faculty availability</h2><p>Illustrative weekly slots only. No real-time status or conflict checking.</p></div>
					<label>Faculty<select aria-label="Choose faculty availability" onChange={(event) => setAvailabilityUid(event.target.value)} value={availabilityFaculty?.uid ?? ""}>{faculty.map((member) => <option key={member.uid} value={member.uid}>{member.fullName}</option>)}</select></label>
				</div>
				{availabilityFaculty ? (
					<>
						<div className="faculty-subject-tags"><span>Assigned subjects</span>{availabilityFaculty.assignedSubjects.map((subject) => <span className="faculty-subject-tag" key={subject}>{subject}</span>)}</div>
						{availabilityFaculty.availability.length ? (
							<div className="faculty-availability-table-wrap"><table className="faculty-availability-table"><thead><tr><th>Day</th><th>Time</th><th>Subject</th><th>Class</th><th>Room</th></tr></thead><tbody>{availabilityFaculty.availability.map((slot) => <tr key={`${slot.day}-${slot.time}`}><td>{slot.day}</td><td>{slot.time}</td><td>{slot.subject}</td><td>{slot.className}</td><td>{slot.room}</td></tr>)}</tbody></table></div>
						) : <p className="faculty-no-slots">No sample availability slots are listed for this faculty member.</p>}
					</>
				) : <p className="faculty-no-slots">No faculty records are available.</p>}
			</section>

			{formOpen && (
				<div className="faculty-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}>
					<section aria-labelledby="faculty-form-title" aria-modal="true" className="faculty-modal faculty-form-modal" role="dialog">
						<header className="faculty-modal-header"><div><p className="faculty-eyebrow">FACULTY RECORD</p><h2 id="faculty-form-title">{editingUid ? "Edit faculty" : "Add faculty"}</h2></div><button aria-label="Close form" className="faculty-modal-close" onClick={() => setFormOpen(false)} type="button"><X size={18} /></button></header>
						<form noValidate onSubmit={handleSaveFaculty}>
							<p className="faculty-required-note">Fields marked <span>*</span> are required.</p>
							{formError && <p className="faculty-form-error" role="alert">{formError}</p>}
							<div className="faculty-form-grid">
								{formFields.map((field) => (
									<div className={`faculty-form-field${errors[field.name] ? " has-error" : ""}`} key={field.name}>
										<label htmlFor={`faculty-${field.name}`}>{field.label}{field.required && <span> *</span>}</label>
										{field.options ? <select id={`faculty-${field.name}`} onChange={(event) => setDraftField(field.name, event.target.value)} value={draft[field.name]}><option value="">Select {field.label.toLowerCase()}</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : <input id={`faculty-${field.name}`} onChange={(event) => setDraftField(field.name, event.target.value)} placeholder={field.placeholder} type={field.type ?? "text"} value={draft[field.name]} />}
										{errors[field.name] && <small className="faculty-field-error">{errors[field.name]}</small>}
									</div>
								))}
								<div className="faculty-form-field faculty-address-field"><label htmlFor="faculty-address">Address</label><textarea id="faculty-address" onChange={(event) => setDraftField("address", event.target.value)} placeholder="Street, city, and postal code" rows="2" value={draft.address} /></div>
							</div>
							<footer className="faculty-modal-footer"><button className="faculty-secondary-button" onClick={() => setFormOpen(false)} type="button">Cancel</button><button className="faculty-primary-button" type="submit">{editingUid ? "Save changes" : "Add faculty"}</button></footer>
						</form>
					</section>
				</div>
			)}

			{selectedFaculty && (
				<div className="faculty-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedFaculty(null); }}>
					<section aria-labelledby="faculty-details-title" aria-modal="true" className="faculty-modal faculty-details-modal" role="dialog">
						<header className="faculty-modal-header"><div><p className="faculty-eyebrow">FACULTY PROFILE</p><h2 id="faculty-details-title">Faculty details</h2></div><button aria-label="Close details" className="faculty-modal-close" onClick={() => setSelectedFaculty(null)} type="button"><X size={18} /></button></header>
						<div className="faculty-profile-heading"><span className="faculty-avatar is-large">{initials(selectedFaculty.fullName)}</span><div><h3>{selectedFaculty.fullName}</h3><p>{selectedFaculty.facultyId}</p></div><span className={`faculty-status-badge is-${selectedFaculty.status.toLowerCase().replaceAll(" ", "-")}`}><span />{selectedFaculty.status}</span></div>
						<dl className="faculty-details-grid">{[["Email", selectedFaculty.email], ["Phone number", selectedFaculty.phone], ["Department", selectedFaculty.department], ["Designation", selectedFaculty.designation], ["Assigned subjects", selectedFaculty.assignedSubjects.join(", ") || "Not assigned"], ["Employment status", selectedFaculty.status], ["Joining date", formatDate(selectedFaculty.joiningDate)], ["Qualification", selectedFaculty.qualification], ["Address", selectedFaculty.address || "Not provided"]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
						<footer className="faculty-modal-footer"><button className="faculty-secondary-button" onClick={() => setSelectedFaculty(null)} type="button">Close</button><button className="faculty-primary-button" onClick={() => openEditForm(selectedFaculty)} type="button"><Pencil size={15} />Edit faculty</button></footer>
					</section>
				</div>
			)}

			{deleteTarget && (
				<div className="faculty-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}>
					<section aria-labelledby="delete-faculty-title" aria-modal="true" className="faculty-modal faculty-confirm-modal" role="alertdialog">
						<div className="faculty-delete-icon"><Trash2 size={20} /></div><h2 id="delete-faculty-title">Delete faculty member?</h2><p>Remove <strong>{deleteTarget.fullName}</strong> ({deleteTarget.facultyId}) from this demo list? This change only affects the current page session.</p>
						<footer className="faculty-modal-footer"><button className="faculty-secondary-button" onClick={() => setDeleteTarget(null)} type="button">Keep faculty</button><button className="faculty-danger-button" onClick={confirmDelete} type="button"><Trash2 size={15} />Delete faculty</button></footer>
					</section>
				</div>
			)}
		</main>
	);
}
