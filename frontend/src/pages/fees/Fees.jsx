import { useState } from "react";
import { CirclePlus, Eye, FilterX, Plus, Search, Trash2, X, CreditCard, Printer } from "lucide-react";
import "./Fees.css";

const departments = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Biotechnology", "Business Administration"];
const classes = ["CS-3A", "CS-2B", "EE-2A", "ME-2B", "BT-3A"];
const academicYears = ["2025-2026", "2026-2027"];
const feeCategories = ["Tuition", "Hostel", "Transport", "Exam"];
const paymentMethods = ["Cash", "Card", "UPI", "Bank Transfer"];
const statuses = ["Pending", "Partial", "Paid"];

const initialFees = [
	{ uid: "fee-1", feeId: "FEE-2026-001", studentName: "Aarav Mehta", rollNumber: "CMS2026001", department: "Computer Science", className: "CS-3A", academicYear: "2026-2027", feeCategory: "Tuition", totalDue: 50000, payments: [{ paymentId: "PAY-001", date: "2026-10-10", amount: 20000, method: "UPI", reference: "UPI123" }] },
	{ uid: "fee-2", feeId: "FEE-2026-002", studentName: "Sofia Bennett", rollNumber: "CMS2026002", department: "Electrical Engineering", className: "EE-2A", academicYear: "2026-2027", feeCategory: "Hostel", totalDue: 30000, payments: [] },
];

const blankFee = { feeId: "", studentName: "", rollNumber: "", department: "", className: "", academicYear: "2026-2027", feeCategory: "Tuition", totalDue: "" };

const blankPayment = { amount: "", method: "Cash", reference: "", date: new Date().toISOString().slice(0, 10) };

function newUid() { return `fee-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function newPayId() { return `PAY-${Date.now().toString().slice(-6)}`; }

function paidTotal(fee) { return fee.payments.reduce((s, p) => s + Number(p.amount || 0), 0); }
function outstanding(fee) { return Math.max(0, Number(fee.totalDue) - paidTotal(fee)); }
function statusOf(fee) { const o = outstanding(fee); if (o <= 0) return "Paid"; if (paidTotal(fee) > 0) return "Partial"; return "Pending"; }

export default function Fees() {
	const [fees, setFees] = useState(initialFees);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ department: "", academicYear: "", feeCategory: "", status: "" });
	const [formOpen, setFormOpen] = useState(false);
	const [editingUid, setEditingUid] = useState(null);
	const [draft, setDraft] = useState(blankFee);
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [selectedFee, setSelectedFee] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [paymentTarget, setPaymentTarget] = useState(null);
	const [paymentDraft, setPaymentDraft] = useState(blankPayment);
	const [paymentErrors, setPaymentErrors] = useState({});
	const [receiptFee, setReceiptFee] = useState(null);
	const [receiptPayment, setReceiptPayment] = useState(null);
	const [feedback, setFeedback] = useState(null);

	const normalizedSearch = search.trim().toLowerCase();
	const visible = fees.filter((f) => {
		const matchesSearch = !normalizedSearch || [f.feeId, f.studentName, f.rollNumber].some((v) => v.toLowerCase().includes(normalizedSearch));
		const st = statusOf(f);
		return matchesSearch &&
			(!filters.department || f.department === filters.department) &&
			(!filters.academicYear || f.academicYear === filters.academicYear) &&
			(!filters.feeCategory || f.feeCategory === filters.feeCategory) &&
			(!filters.status || st === filters.status);
	});

	const totalAssessed = fees.reduce((s, f) => s + Number(f.totalDue), 0);
	const totalCollected = fees.reduce((s, f) => s + paidTotal(f), 0);
	const totalOutstanding = fees.reduce((s, f) => s + outstanding(f), 0);
	const pendingStudents = fees.filter((f) => statusOf(f) !== "Paid").length;
	const hasFilters = Boolean(normalizedSearch || Object.values(filters).some(Boolean));

	function updateFilter(name, value) { setFilters((c) => ({ ...c, [name]: value })); }
	function clearFilters() { setSearch(""); setFilters({ department: "", academicYear: "", feeCategory: "", status: "" }); }
	function openCreateForm() { setEditingUid(null); setDraft(blankFee); setErrors({}); setFormError(""); setFormOpen(true); }
	function openEditForm(f) { setSelectedFee(null); setEditingUid(f.uid); setDraft({ ...f, totalDue: String(f.totalDue) }); setErrors({}); setFormError(""); setFormOpen(true); }

	function validateDraft() {
		const nextErrors = {};
		if (!draft.feeId.trim()) nextErrors.feeId = "Fee ID is required.";
		if (!draft.studentName.trim()) nextErrors.studentName = "Student name is required.";
		if (!draft.rollNumber.trim()) nextErrors.rollNumber = "Roll number is required.";
		if (!draft.department) nextErrors.department = "Department is required.";
		if (!draft.className) nextErrors.className = "Class is required.";
		if (!draft.academicYear) nextErrors.academicYear = "Academic year is required.";
		if (!draft.feeCategory) nextErrors.feeCategory = "Fee category is required.";
		const total = Number(draft.totalDue);
		if (!draft.totalDue || isNaN(total) || total <= 0) nextErrors.totalDue = "Total due must be a positive number.";
		const duplicate = fees.find((f) => f.uid !== editingUid && f.feeId.toLowerCase() === draft.feeId.trim().toLowerCase());
		if (duplicate) nextErrors.feeId = "This fee ID is already in use.";
		return nextErrors;
	}

	function handleSave(event) {
		event.preventDefault();
		const nextErrors = validateDraft();
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) { setFormError("Review the highlighted fields and try again."); return; }
		const record = { ...draft, uid: editingUid ?? newUid(), feeId: draft.feeId.trim(), studentName: draft.studentName.trim(), rollNumber: draft.rollNumber.trim(), totalDue: Number(draft.totalDue), payments: editingUid ? fees.find((f) => f.uid === editingUid)?.payments ?? [] : [] };
		if (editingUid) {
			setFees((c) => c.map((f) => f.uid === editingUid ? { ...record, payments: f.payments } : f));
			setFeedback({ type: "success", message: `${record.studentName} fee record updated in this demo session.` });
		} else {
			setFees((c) => [record, ...c]);
			setFeedback({ type: "success", message: `${record.studentName} fee record added to this demo session.` });
		}
		setFormOpen(false);
	}

	function validatePayment() {
		const nextErrors = {};
		const amount = Number(paymentDraft.amount);
		const outstandingBalance = outstanding(paymentTarget);
		if (!paymentDraft.amount || isNaN(amount) || amount <= 0) nextErrors.amount = "Amount must be greater than zero.";
		if (amount > outstandingBalance) nextErrors.amount = "Amount cannot exceed outstanding balance.";
		if (!paymentDraft.date) nextErrors.date = "Payment date is required.";
		return nextErrors;
	}

	function submitPayment(event) {
		event.preventDefault();
		const nextErrors = validatePayment();
		setPaymentErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;
		const payment = { paymentId: newPayId(), date: paymentDraft.date, amount: Number(paymentDraft.amount), method: paymentDraft.method, reference: paymentDraft.reference.trim() };
		setFees((c) => c.map((f) => f.uid === paymentTarget.uid ? { ...f, payments: [...f.payments, payment] } : f));
		setReceiptFee(paymentTarget);
		setReceiptPayment(payment);
		setPaymentTarget(null);
		setPaymentDraft(blankPayment);
		setFeedback({ type: "success", message: `Payment of ${payment.amount} recorded in this demo session.` });
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		setFees((c) => c.filter((f) => f.uid !== deleteTarget.uid));
		setFeedback({ type: "success", message: `${deleteTarget.studentName} fee record removed from this demo session.` });
		setDeleteTarget(null);
		if (selectedFee?.uid === deleteTarget.uid) setSelectedFee(null);
	}

	function setDraftField(name, value) {
		setDraft((c) => ({ ...c, [name]: value }));
		setErrors((c) => { if (!c[name]) return c; const n = { ...c }; delete n[name]; return n; });
	}

	return (
		<main className="fees-page">
			<header className="fees-page-header">
				<div>
					<p className="fees-eyebrow">ADMINISTRATION / FEES</p>
					<h1>Fee management</h1>
					<p>Track fee assessments, payments, and outstanding balances.</p>
				</div>
				<button className="fees-primary-button" onClick={openCreateForm} type="button"><Plus size={17} /> Add fee record</button>
			</header>

			<p className="fees-demo-notice">Sample fee records · Changes stay in this page's demo session and are not saved permanently. No real payment processing is performed.</p>

			{feedback && (
				<div className={`fees-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="fees-summary" aria-label="Fee counts">
				<div><span className="fees-summary-icon"><CreditCard size={17} /></span><span>Total assessed</span><strong>{totalAssessed.toLocaleString()}</strong></div>
				<div><span className="fees-summary-icon"><CreditCard size={17} /></span><span>Total collected</span><strong>{totalCollected.toLocaleString()}</strong></div>
				<div><span className="fees-summary-icon"><CreditCard size={17} /></span><span>Outstanding</span><strong>{totalOutstanding.toLocaleString()}</strong></div>
				<div><span className="fees-summary-icon"><CreditCard size={17} /></span><span>Pending students</span><strong>{pendingStudents}</strong></div>
			</section>

			<section className="fees-directory">
				<div className="fees-directory-heading">
					<div><h2>Fee records</h2><p>Showing {visible.length} of {fees.length} records</p></div>
				</div>
				<div className="fees-toolbar">
					<label className="fees-search"><Search size={17} aria-hidden="true" /><input aria-label="Search fees" onChange={(e) => setSearch(e.target.value)} placeholder="Search fee ID, student, or roll" value={search} /></label>
					<div className="fees-filters">
						<select aria-label="Filter by department" onChange={(e) => updateFilter("department", e.target.value)} value={filters.department}><option value="">All departments</option>{departments.map((d) => <option key={d}>{d}</option>)}</select>
						<select aria-label="Filter by academic year" onChange={(e) => updateFilter("academicYear", e.target.value)} value={filters.academicYear}><option value="">All years</option>{academicYears.map((y) => <option key={y}>{y}</option>)}</select>
						<select aria-label="Filter by fee category" onChange={(e) => updateFilter("feeCategory", e.target.value)} value={filters.feeCategory}><option value="">All categories</option>{feeCategories.map((c) => <option key={c}>{c}</option>)}</select>
						<select aria-label="Filter by status" onChange={(e) => updateFilter("status", e.target.value)} value={filters.status}><option value="">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
					</div>
					<button className="fees-clear-button" disabled={!hasFilters} onClick={clearFilters} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				{visible.length ? (
					<div className="fees-table-wrap">
						<table className="fees-table">
							<thead><tr><th>Fee</th><th>Student</th><th>Department</th><th>Class</th><th>Year</th><th>Category</th><th>Total due</th><th>Paid</th><th>Outstanding</th><th>Status</th><th><span className="fees-visually-hidden">Actions</span></th></tr></thead>
							<tbody>
								{visible.map((f) => (
									<tr key={f.uid}>
										<td className="fees-id-cell">{f.feeId}</td>
										<td><div className="fees-name-cell"><span className="fees-avatar">{f.studentName.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span><span><strong>{f.studentName}</strong><small>{f.rollNumber}</small></span></div></td>
										<td>{f.department}</td>
										<td>{f.className}</td>
										<td>{f.academicYear}</td>
										<td>{f.feeCategory}</td>
										<td>{Number(f.totalDue).toLocaleString()}</td>
										<td>{paidTotal(f).toLocaleString()}</td>
										<td>{outstanding(f).toLocaleString()}</td>
										<td><span className={`fees-status-badge ${statusOf(f) === "Paid" ? "is-active" : statusOf(f) === "Partial" ? "" : "is-inactive"}`}><span />{statusOf(f)}</span></td>
										<td><div className="fees-row-actions">
											<button aria-label={`View ${f.studentName}`} onClick={() => setSelectedFee(f)} title="View details" type="button"><Eye size={16} /></button>
											<button aria-label={`Edit ${f.studentName}`} onClick={() => openEditForm(f)} title="Edit fee" type="button"><Pencil size={15} /></button>
											<button aria-label={`Record payment for ${f.studentName}`} onClick={() => { setPaymentTarget(f); setPaymentDraft(blankPayment); setPaymentErrors({}); }} title="Record payment" type="button"><CreditCard size={15} /></button>
											<button aria-label={`Delete ${f.studentName}`} onClick={() => setDeleteTarget(f)} title="Delete fee" type="button"><Trash2 size={15} /></button>
										</div></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="fees-empty-state"><div><Search size={20} /></div><h3>No fee records found</h3><p>Try a different search or clear your filters.</p><button className="fees-secondary-button" onClick={clearFilters} type="button">Clear search and filters</button></div>
				)}
			</section>

			{formOpen && (
				<div className="fees-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}>
					<section aria-labelledby="fee-form-title" aria-modal="true" className="fees-modal fees-form-modal" role="dialog">
						<header className="fees-modal-header"><div><p className="fees-eyebrow">FEE RECORD</p><h2 id="fee-form-title">{editingUid ? "Edit fee record" : "Add fee record"}</h2></div><button aria-label="Close form" className="fees-modal-close" onClick={() => setFormOpen(false)} type="button"><X size={18} /></button></header>
						<form noValidate onSubmit={handleSave}>
							<p className="fees-required-note">Fields marked <span>*</span> are required.</p>
							{formError && <p className="fees-form-error" role="alert">{formError}</p>}
							<div className="fees-form-grid">
								{["feeId", "studentName", "rollNumber"].map((name) => {
									const labels = { feeId: "Fee ID", studentName: "Student name", rollNumber: "Roll number" };
									const placeholders = { feeId: "e.g. FEE-2026-010", studentName: "Student's full name", rollNumber: "e.g. CMS2026010" };
									return (
										<div className={`fees-form-field${errors[name] ? " has-error" : ""}`} key={name}>
											<label htmlFor={`fee-${name}`}>{labels[name]}<span> *</span></label>
											<input id={`fee-${name}`} onChange={(e) => setDraftField(name, e.target.value)} placeholder={placeholders[name]} type="text" value={draft[name]} />
											{errors[name] && <small className="fees-field-error">{errors[name]}</small>}
										</div>
									);
								})}
								{[["department", "Department", departments], ["className", "Class / Section", classes], ["academicYear", "Academic year", academicYears], ["feeCategory", "Fee category", feeCategories]].map(([name, label, opts]) => (
									<div className={`fees-form-field${errors[name] ? " has-error" : ""}`} key={name}>
										<label htmlFor={`fee-${name}`}>{label}<span> *</span></label>
										<select id={`fee-${name}`} onChange={(e) => setDraftField(name, e.target.value)} value={draft[name]}><option value="">Select {label.toLowerCase()}</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>
										{errors[name] && <small className="fees-field-error">{errors[name]}</small>}
									</div>
								))}
								<div className={`fees-form-field${errors.totalDue ? " has-error" : ""}`}>
									<label htmlFor="fee-totalDue">Total due<span> *</span></label>
									<input id="fee-totalDue" onChange={(e) => setDraftField("totalDue", e.target.value)} placeholder="e.g. 50000" type="number" value={draft.totalDue} />
									{errors.totalDue && <small className="fees-field-error">{errors.totalDue}</small>}
								</div>
							</div>
							<footer className="fees-modal-footer"><button className="fees-secondary-button" onClick={() => setFormOpen(false)} type="button">Cancel</button><button className="fees-primary-button" type="submit"><CirclePlus size={16} />{editingUid ? "Save changes" : "Add fee record"}</button></footer>
						</form>
					</section>
				</div>
			)}

			{selectedFee && (
				<div className="fees-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedFee(null); }}>
					<section aria-labelledby="fee-details-title" aria-modal="true" className="fees-modal fees-details-modal" role="dialog">
						<header className="fees-modal-header"><div><p className="fees-eyebrow">FEE RECORD</p><h2 id="fee-details-title">Fee details</h2></div><button aria-label="Close details" className="fees-modal-close" onClick={() => setSelectedFee(null)} type="button"><X size={18} /></button></header>
						<dl className="fees-details-grid">{[["Fee ID", selectedFee.feeId], ["Student", selectedFee.studentName], ["Roll no.", selectedFee.rollNumber], ["Department", selectedFee.department], ["Class", selectedFee.className], ["Academic year", selectedFee.academicYear], ["Category", selectedFee.feeCategory], ["Total due", selectedFee.totalDue.toLocaleString()], ["Paid", paidTotal(selectedFee).toLocaleString()], ["Outstanding", outstanding(selectedFee).toLocaleString()], ["Status", statusOf(selectedFee)]] .map(([l, v]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}</dl>
						<h3>Payment history</h3>
						{selectedFee.payments.length ? (
							<table className="fees-table"><thead><tr><th>Payment ID</th><th>Date</th><th>Amount</th><th>Method</th><th>Reference</th><th>Receipt</th></tr></thead><tbody>
								{selectedFee.payments.map((p) => (
									<tr key={p.paymentId}><td>{p.paymentId}</td><td>{p.date}</td><td>{p.amount.toLocaleString()}</td><td>{p.method}</td><td>{p.reference || "—"}</td><td><button className="fees-secondary-button" onClick={() => { setReceiptFee(selectedFee); setReceiptPayment(p); }} type="button"><Printer size={14} /> Print</button></td></tr>
								))}
							</tbody></table>
						) : <p className="fees-no-slots">No payments recorded.</p>}
						<footer className="fees-modal-footer"><button className="fees-secondary-button" onClick={() => setSelectedFee(null)} type="button">Close</button><button className="fees-primary-button" onClick={() => openEditForm(selectedFee)} type="button"><Pencil size={15} />Edit fee</button></footer>
					</section>
				</div>
			)}

			{paymentTarget && (
				<div className="fees-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setPaymentTarget(null); }}>
					<section aria-labelledby="payment-title" aria-modal="true" className="fees-modal fees-form-modal" role="dialog">
						<header className="fees-modal-header"><div><p className="fees-eyebrow">PAYMENT</p><h2 id="payment-title">Record payment</h2></div><button aria-label="Close form" className="fees-modal-close" onClick={() => setPaymentTarget(null)} type="button"><X size={18} /></button></header>
						<p>Outstanding balance: {outstanding(paymentTarget).toLocaleString()}</p>
						<form noValidate onSubmit={submitPayment}>
							{paymentErrors.amount && <p className="fees-form-error" role="alert">{paymentErrors.amount}</p>}
							{paymentErrors.date && <p className="fees-form-error" role="alert">{paymentErrors.date}</p>}
							<div className="fees-form-grid">
								<div className={`fees-form-field${paymentErrors.amount ? " has-error" : ""}`}>
									<label htmlFor="payment-amount">Amount<span> *</span></label>
									<input id="payment-amount" onChange={(e) => setPaymentDraft((c) => ({ ...c, amount: e.target.value }))} placeholder="e.g. 10000" type="number" value={paymentDraft.amount} />
								</div>
								<div className="fees-form-field">
									<label htmlFor="payment-method">Payment method</label>
									<select id="payment-method" onChange={(e) => setPaymentDraft((c) => ({ ...c, method: e.target.value }))} value={paymentDraft.method}>{paymentMethods.map((m) => <option key={m}>{m}</option>)}</select>
								</div>
								<div className={`fees-form-field${paymentErrors.date ? " has-error" : ""}`}>
									<label htmlFor="payment-date">Payment date<span> *</span></label>
									<input id="payment-date" onChange={(e) => setPaymentDraft((c) => ({ ...c, date: e.target.value }))} type="date" value={paymentDraft.date} />
								</div>
								<div className="fees-form-field">
									<label htmlFor="payment-reference">Reference / receipt no.</label>
									<input id="payment-reference" onChange={(e) => setPaymentDraft((c) => ({ ...c, reference: e.target.value }))} placeholder="e.g. UPI123" type="text" value={paymentDraft.reference} />
								</div>
							</div>
							<footer className="fees-modal-footer"><button className="fees-secondary-button" onClick={() => setPaymentTarget(null)} type="button">Cancel</button><button className="fees-primary-button" type="submit"><CreditCard size={16} /> Record payment</button></footer>
						</form>
					</section>
				</div>
			)}

			{deleteTarget && (
				<div className="fees-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
					<section aria-labelledby="delete-fee-title" aria-modal="true" className="fees-modal fees-confirm-modal" role="alertdialog">
						<div className="fees-delete-icon"><Trash2 size={20} /></div><h2 id="delete-fee-title">Delete fee record?</h2>
						<p>Remove <strong>{deleteTarget.studentName}</strong> ({deleteTarget.feeId}) from this demo list? This change only affects the current page session.</p>
						<footer className="fees-modal-footer"><button className="fees-secondary-button" onClick={() => setDeleteTarget(null)} type="button">Keep record</button><button className="fees-danger-button" onClick={confirmDelete} type="button"><Trash2 size={15} />Delete record</button></footer>
					</section>
				</div>
			)}

			{receiptFee && receiptPayment && (
				<div className="fees-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) { setReceiptFee(null); setReceiptPayment(null); } }}>
					<section aria-labelledby="receipt-title" aria-modal="true" className="fees-modal fees-details-modal" role="dialog">
						<header className="fees-modal-header"><div><p className="fees-eyebrow">RECEIPT</p><h2 id="receipt-title">Payment receipt</h2></div><button aria-label="Close receipt" className="fees-modal-close" onClick={() => { setReceiptFee(null); setReceiptPayment(null); }} type="button"><X size={18} /></button></header>
						<div className="fees-receipt">
							<p><strong>Receipt no.:</strong> {receiptPayment.paymentId}</p>
							<p><strong>Student:</strong> {receiptFee.studentName} ({receiptFee.rollNumber})</p>
							<p><strong>Fee category:</strong> {receiptFee.feeCategory}</p>
							<p><strong>Payment date:</strong> {receiptPayment.date}</p>
							<p><strong>Amount paid:</strong> {receiptPayment.amount.toLocaleString()}</p>
							<p><strong>Method:</strong> {receiptPayment.method}</p>
							<p><strong>Reference:</strong> {receiptPayment.reference || "N/A"}</p>
							<p><strong>Remaining balance:</strong> {outstanding(receiptFee).toLocaleString()}</p>
							<p className="fees-demo-notice">Sample receipt · Not a verified financial transaction.</p>
						</div>
						<footer className="fees-modal-footer"><button className="fees-secondary-button" onClick={() => { setReceiptFee(null); setReceiptPayment(null); }} type="button">Close</button><button className="fees-primary-button" onClick={() => window.print()} type="button"><Printer size={15} /> Print</button></footer>
					</section>
				</div>
			)}
		</main>
	);
}
