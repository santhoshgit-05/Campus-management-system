import { useState } from "react";
import {
	CirclePlus,
	Eye,
	FilterX,
	Pencil,
	Plus,
	Search,
	Trash2,
	UserRound,
	UsersRound,
	X,
} from "lucide-react";
import "./Students.css";

const initialStudents = [
	{ uid: "demo-001", studentId: "CMS2026001", fullName: "Aarav Mehta", email: "aarav.mehta@example.edu", phone: "(555) 010-0101", department: "Computer Science", academicYear: "3rd Year", section: "A", dateOfBirth: "2005-04-18", gender: "Male", address: "18 Cedar Lane, Brookfield", category: "Day Scholar", status: "Active" },
	{ uid: "demo-002", studentId: "CMS2026002", fullName: "Sofia Bennett", email: "sofia.bennett@example.edu", phone: "(555) 010-0102", department: "Electrical Engineering", academicYear: "2nd Year", section: "B", dateOfBirth: "2006-08-02", gender: "Female", address: "West Hall, Room 214", category: "Hosteller", status: "Active" },
	{ uid: "demo-003", studentId: "CMS2026003", fullName: "Noah Williams", email: "noah.williams@example.edu", phone: "(555) 010-0103", department: "Business Administration", academicYear: "4th Year", section: "A", dateOfBirth: "2004-11-22", gender: "Male", address: "42 Oak Avenue, Fairview", category: "Day Scholar", status: "Active" },
	{ uid: "demo-004", studentId: "CMS2026004", fullName: "Maya Patel", email: "maya.patel@example.edu", phone: "(555) 010-0104", department: "Biotechnology", academicYear: "1st Year", section: "C", dateOfBirth: "2007-01-09", gender: "Female", address: "North Residence, Room 108", category: "Hosteller", status: "Active" },
	{ uid: "demo-005", studentId: "CMS2026005", fullName: "Ethan Brooks", email: "ethan.brooks@example.edu", phone: "(555) 010-0105", department: "Mechanical Engineering", academicYear: "3rd Year", section: "B", dateOfBirth: "2005-06-13", gender: "Male", address: "9 Pine Street, Lakeside", category: "Day Scholar", status: "Inactive" },
	{ uid: "demo-006", studentId: "CMS2026006", fullName: "Amara Okafor", email: "amara.okafor@example.edu", phone: "(555) 010-0106", department: "Computer Science", academicYear: "2nd Year", section: "A", dateOfBirth: "2006-03-27", gender: "Female", address: "East Hall, Room 305", category: "Hosteller", status: "Active" },
	{ uid: "demo-007", studentId: "CMS2026007", fullName: "Lucas Chen", email: "lucas.chen@example.edu", phone: "(555) 010-0107", department: "Business Administration", academicYear: "1st Year", section: "B", dateOfBirth: "2007-09-14", gender: "Male", address: "77 River Road, Brookfield", category: "Day Scholar", status: "Active" },
	{ uid: "demo-008", studentId: "CMS2026008", fullName: "Isabella Romero", email: "isabella.romero@example.edu", phone: "(555) 010-0108", department: "Electrical Engineering", academicYear: "4th Year", section: "A", dateOfBirth: "2004-12-05", gender: "Female", address: "South Hall, Room 122", category: "Hosteller", status: "Inactive" },
];

const departments = ["Biotechnology", "Business Administration", "Computer Science", "Electrical Engineering", "Mechanical Engineering"];
const academicYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const categories = ["Day Scholar", "Hosteller"];
const statuses = ["Active", "Inactive"];

const blankStudent = {
	studentId: "",
	fullName: "",
	email: "",
	phone: "",
	department: "",
	academicYear: "",
	section: "",
	dateOfBirth: "",
	gender: "",
	address: "",
	category: "Day Scholar",
	status: "Active",
};

const formFields = [
	{ name: "studentId", label: "Student ID", required: true, placeholder: "e.g. CMS2026010" },
	{ name: "fullName", label: "Full name", required: true, placeholder: "Student's full name" },
	{ name: "email", label: "Email", required: true, type: "email", placeholder: "name@example.edu" },
	{ name: "phone", label: "Phone", required: true, type: "tel", placeholder: "(555) 010-0100" },
	{ name: "department", label: "Department", required: true, options: departments },
	{ name: "academicYear", label: "Academic year", required: true, options: academicYears },
	{ name: "section", label: "Section", required: true, placeholder: "e.g. A" },
	{ name: "dateOfBirth", label: "Date of birth", required: true, type: "date" },
	{ name: "gender", label: "Gender", required: true, options: ["Female", "Male", "Non-binary", "Prefer not to say"] },
	{ name: "category", label: "Student category", required: true, options: categories },
	{ name: "status", label: "Status", required: true, options: statuses },
];

function newUid() {
	return `student-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Students() {
	const [students, setStudents] = useState(initialStudents);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ department: "", academicYear: "", category: "", status: "" });
	const [formOpen, setFormOpen] = useState(false);
	const [editingUid, setEditingUid] = useState(null);
	const [draft, setDraft] = useState(blankStudent);
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [feedback, setFeedback] = useState(null);

	const normalizedSearch = search.trim().toLowerCase();
	const visibleStudents = students.filter((student) => {
		const matchesSearch = !normalizedSearch || [student.studentId, student.fullName, student.email]
			.some((value) => value.toLowerCase().includes(normalizedSearch));
		return matchesSearch &&
			(!filters.department || student.department === filters.department) &&
			(!filters.academicYear || student.academicYear === filters.academicYear) &&
			(!filters.category || student.category === filters.category) &&
			(!filters.status || student.status === filters.status);
	});
	const activeCount = students.filter((student) => student.status === "Active").length;
	const hasFilters = Boolean(normalizedSearch || Object.values(filters).some(Boolean));

	function updateFilter(name, value) {
		setFilters((current) => ({ ...current, [name]: value }));
	}

	function clearFilters() {
		setSearch("");
		setFilters({ department: "", academicYear: "", category: "", status: "" });
	}

	function openCreateForm() {
		setEditingUid(null);
		setDraft(blankStudent);
		setErrors({});
		setFormError("");
		setFormOpen(true);
	}

	function openEditForm(student) {
		setSelectedStudent(null);
		setEditingUid(student.uid);
		setDraft({ ...student });
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
		const duplicate = students.find((student) => student.uid !== editingUid && (
			student.studentId.toLowerCase() === draft.studentId.trim().toLowerCase() ||
			student.email.toLowerCase() === draft.email.trim().toLowerCase()
		));
		if (duplicate) {
			nextErrors.studentId = duplicate.studentId.toLowerCase() === draft.studentId.trim().toLowerCase()
				? "This student ID is already in use."
				: "This email is already in use.";
		}
		return nextErrors;
	}

	function handleSaveStudent(event) {
		event.preventDefault();
		const nextErrors = validateDraft();
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) {
			setFormError("Review the highlighted fields and try again.");
			return;
		}

		if (editingUid) {
			setStudents((current) => current.map((student) => student.uid === editingUid ? { ...draft, uid: editingUid } : student));
			setFeedback({ type: "success", message: `${draft.fullName} was updated in this demo session.` });
		} else {
			setStudents((current) => [{ ...draft, uid: newUid() }, ...current]);
			setFeedback({ type: "success", message: `${draft.fullName} was added to this demo session.` });
		}
		setFormOpen(false);
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		setStudents((current) => current.filter((student) => student.uid !== deleteTarget.uid));
		setFeedback({ type: "success", message: `${deleteTarget.fullName} was removed from this demo session.` });
		setDeleteTarget(null);
		if (selectedStudent?.uid === deleteTarget.uid) setSelectedStudent(null);
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
		<main className="students-page">
			<header className="students-page-header">
				<div>
					<p className="students-eyebrow">ACADEMICS / DIRECTORY</p>
					<h1>Student management</h1>
					<p>Review student records and manage enrollment details.</p>
				</div>
				<button className="students-primary-button" onClick={openCreateForm} type="button">
					<Plus size={17} /> Add student
				</button>
			</header>

			<p className="students-demo-notice">Sample student records · Changes stay in this page's demo session and are not saved permanently.</p>

			{feedback && (
				<div className={`students-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="students-summary" aria-label="Student counts">
				<div><span className="students-summary-icon"><UsersRound size={17} /></span><span>Total students</span><strong>{students.length}</strong></div>
				<div><span className="students-summary-icon is-active"><UserRound size={17} /></span><span>Active students</span><strong>{activeCount}</strong></div>
			</section>

			<section className="students-directory">
				<div className="students-directory-heading">
					<div><h2>Student directory</h2><p>Showing {visibleStudents.length} of {students.length} students</p></div>
				</div>

				<div className="students-toolbar">
					<label className="students-search">
						<Search size={17} aria-hidden="true" />
						<input aria-label="Search students" onChange={(event) => setSearch(event.target.value)} placeholder="Search ID, name, or email" value={search} />
					</label>
					<div className="students-filters">
						<select aria-label="Filter by department" onChange={(event) => updateFilter("department", event.target.value)} value={filters.department}>
							<option value="">All departments</option>
							{departments.map((department) => <option key={department}>{department}</option>)}
						</select>
						<select aria-label="Filter by academic year" onChange={(event) => updateFilter("academicYear", event.target.value)} value={filters.academicYear}>
							<option value="">All years</option>
							{academicYears.map((year) => <option key={year}>{year}</option>)}
						</select>
						<select aria-label="Filter by student category" onChange={(event) => updateFilter("category", event.target.value)} value={filters.category}>
							<option value="">All categories</option>
							{categories.map((category) => <option key={category}>{category}</option>)}
						</select>
						<select aria-label="Filter by status" onChange={(event) => updateFilter("status", event.target.value)} value={filters.status}>
							<option value="">All statuses</option>
							{statuses.map((status) => <option key={status}>{status}</option>)}
						</select>
					</div>
					<button className="students-clear-button" disabled={!hasFilters} onClick={clearFilters} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				{visibleStudents.length ? (
					<div className="students-table-wrap">
						<table className="students-table">
							<thead><tr>
								<th>Student</th><th>Student ID</th><th>Phone</th><th>Department</th><th>Year / Section</th><th>Category</th><th>Status</th><th><span className="students-visually-hidden">Actions</span></th>
							</tr></thead>
							<tbody>
								{visibleStudents.map((student) => (
									<tr key={student.uid}>
										<td><div className="student-name-cell"><span className="student-avatar">{student.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span><strong>{student.fullName}</strong><small>{student.email}</small></span></div></td>
										<td className="student-id-cell">{student.studentId}</td>
										<td>{student.phone}</td>
										<td>{student.department}</td>
										<td>{student.academicYear}<small className="student-section">Section {student.section}</small></td>
										<td><span className={`student-category-badge ${student.category === "Hosteller" ? "is-hosteller" : ""}`}>{student.category}</span></td>
										<td><span className={`student-status-badge ${student.status === "Active" ? "is-active" : "is-inactive"}`}><span />{student.status}</span></td>
										<td><div className="student-row-actions">
											<button aria-label={`View ${student.fullName}`} onClick={() => setSelectedStudent(student)} title="View details" type="button"><Eye size={16} /></button>
											<button aria-label={`Edit ${student.fullName}`} onClick={() => openEditForm(student)} title="Edit student" type="button"><Pencil size={15} /></button>
											<button aria-label={`Delete ${student.fullName}`} onClick={() => setDeleteTarget(student)} title="Delete student" type="button"><Trash2 size={15} /></button>
										</div></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="students-empty-state">
						<div><Search size={20} /></div>
						<h3>No students found</h3>
						<p>Try a different search or clear your filters to see all demo records.</p>
						<button className="students-secondary-button" onClick={clearFilters} type="button">Clear search and filters</button>
					</div>
				)}
			</section>

			{formOpen && (
				<div className="students-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}>
					<section aria-labelledby="student-form-title" aria-modal="true" className="students-modal students-form-modal" role="dialog">
						<header className="students-modal-header"><div><p className="students-eyebrow">STUDENT RECORD</p><h2 id="student-form-title">{editingUid ? "Edit student" : "Add student"}</h2></div><button aria-label="Close form" className="students-modal-close" onClick={() => setFormOpen(false)} type="button"><X size={18} /></button></header>
						<form noValidate onSubmit={handleSaveStudent}>
							<p className="students-required-note">Fields marked <span>*</span> are required.</p>
							{formError && <p className="students-form-error" role="alert">{formError}</p>}
							<div className="students-form-grid">
								{formFields.map((field) => (
									<div className={`students-form-field${errors[field.name] ? " has-error" : ""}`} key={field.name}>
										<label htmlFor={`student-${field.name}`}>{field.label}{field.required && <span> *</span>}</label>
										{field.options ? (
											<select id={`student-${field.name}`} onChange={(event) => setDraftField(field.name, event.target.value)} value={draft[field.name]}>
												<option value="">Select {field.label.toLowerCase()}</option>
												{field.options.map((option) => <option key={option}>{option}</option>)}
											</select>
										) : (
											<input id={`student-${field.name}`} onChange={(event) => setDraftField(field.name, event.target.value)} placeholder={field.placeholder} type={field.type ?? "text"} value={draft[field.name]} />
										)}
										{errors[field.name] && <small className="students-field-error">{errors[field.name]}</small>}
									</div>
								))}
								<div className="students-form-field students-address-field"><label htmlFor="student-address">Address</label><textarea id="student-address" onChange={(event) => setDraftField("address", event.target.value)} placeholder="Street, city, and postal code" rows="2" value={draft.address} /></div>
							</div>
							<footer className="students-modal-footer"><button className="students-secondary-button" onClick={() => setFormOpen(false)} type="button">Cancel</button><button className="students-primary-button" type="submit"><CirclePlus size={16} />{editingUid ? "Save changes" : "Add student"}</button></footer>
						</form>
					</section>
				</div>
			)}

			{selectedStudent && (
				<div className="students-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedStudent(null); }}>
					<section aria-labelledby="student-details-title" aria-modal="true" className="students-modal students-details-modal" role="dialog">
						<header className="students-modal-header"><div><p className="students-eyebrow">STUDENT PROFILE</p><h2 id="student-details-title">Student details</h2></div><button aria-label="Close details" className="students-modal-close" onClick={() => setSelectedStudent(null)} type="button"><X size={18} /></button></header>
						<div className="students-profile-heading"><span className="student-avatar is-large">{selectedStudent.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><h3>{selectedStudent.fullName}</h3><p>{selectedStudent.studentId}</p></div><span className={`student-status-badge ${selectedStudent.status === "Active" ? "is-active" : "is-inactive"}`}><span />{selectedStudent.status}</span></div>
						<dl className="students-details-grid">
							{[["Email", selectedStudent.email], ["Phone", selectedStudent.phone], ["Department", selectedStudent.department], ["Academic year", selectedStudent.academicYear], ["Section", selectedStudent.section], ["Category", selectedStudent.category], ["Date of birth", selectedStudent.dateOfBirth], ["Gender", selectedStudent.gender], ["Address", selectedStudent.address || "Not provided"]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
						</dl>
						<footer className="students-modal-footer"><button className="students-secondary-button" onClick={() => setSelectedStudent(null)} type="button">Close</button><button className="students-primary-button" onClick={() => openEditForm(selectedStudent)} type="button"><Pencil size={15} />Edit student</button></footer>
					</section>
				</div>
			)}

			{deleteTarget && (
				<div className="students-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}>
					<section aria-labelledby="delete-student-title" aria-modal="true" className="students-modal students-confirm-modal" role="alertdialog">
						<div className="students-delete-icon"><Trash2 size={20} /></div><h2 id="delete-student-title">Delete student?</h2>
						<p>Remove <strong>{deleteTarget.fullName}</strong> ({deleteTarget.studentId}) from this demo list? This change only affects the current page session.</p>
						<footer className="students-modal-footer"><button className="students-secondary-button" onClick={() => setDeleteTarget(null)} type="button">Keep student</button><button className="students-danger-button" onClick={confirmDelete} type="button"><Trash2 size={15} />Delete student</button></footer>
					</section>
				</div>
			)}
		</main>
	);
}
