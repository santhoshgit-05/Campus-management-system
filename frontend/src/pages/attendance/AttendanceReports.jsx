import { useState } from "react";
import { Download, FilterX, Search, X } from "lucide-react";
import "./AttendanceReports.css";

const departments = ["Biotechnology", "Business Administration", "Computer Science", "Electrical Engineering", "Mechanical Engineering"];
const statuses = ["Present", "Absent", "Late"];

const studentRecords = [
	{ uid: "sr-1", type: "Student", recordId: "ATT-2026-001", personId: "CMS2026001", fullName: "Aarav Mehta", department: "Computer Science", date: "2026-10-20", status: "Present", remarks: "" },
	{ uid: "sr-2", type: "Student", recordId: "ATT-2026-002", personId: "CMS2026002", fullName: "Sofia Bennett", department: "Electrical Engineering", date: "2026-10-20", status: "Absent", remarks: "Medical leave" },
	{ uid: "sr-3", type: "Student", recordId: "ATT-2026-003", personId: "CMS2026003", fullName: "Noah Williams", department: "Business Administration", date: "2026-10-19", status: "Late", remarks: "Arrived 15 min late" },
];

const facultyRecords = [
	{ uid: "fr-1", type: "Faculty", recordId: "FAT-2026-001", personId: "FAC-2026-001", fullName: "Dr. Maya Chen", department: "Computer Science", date: "2026-10-20", status: "Present", remarks: "" },
	{ uid: "fr-2", type: "Faculty", recordId: "FAT-2026-002", personId: "FAC-2026-002", fullName: "Prof. Daniel Brooks", department: "Electrical Engineering", date: "2026-10-20", status: "Late", remarks: "Traffic delay" },
	{ uid: "fr-3", type: "Faculty", recordId: "FAT-2026-003", personId: "FAC-2026-003", fullName: "Aisha Rahman", department: "Biotechnology", date: "2026-10-19", status: "Absent", remarks: "Conference" },
];

export default function AttendanceReports() {
	const [reportType, setReportType] = useState("Student");
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ department: "", status: "", dateFrom: "", dateTo: "" });
	const [feedback, setFeedback] = useState(null);

	const source = reportType === "Student" ? studentRecords : facultyRecords;
	const normalizedSearch = search.trim().toLowerCase();
	const visible = source.filter((r) => {
		const matchesSearch = !normalizedSearch || [r.recordId, r.personId, r.fullName].some((v) => v.toLowerCase().includes(normalizedSearch));
		const inRange = (!filters.dateFrom || r.date >= filters.dateFrom) && (!filters.dateTo || r.date <= filters.dateTo);
		return matchesSearch && inRange &&
			(!filters.department || r.department === filters.department) &&
			(!filters.status || r.status === filters.status);
	});

	const total = visible.length;
	const present = visible.filter((r) => r.status === "Present").length;
	const absent = visible.filter((r) => r.status === "Absent").length;
	const late = visible.filter((r) => r.status === "Late").length;
	const rate = total ? Math.round((present / total) * 100) : 0;
	const hasFilters = Boolean(normalizedSearch || Object.values(filters).some(Boolean));

	function updateFilter(name, value) { setFilters((c) => ({ ...c, [name]: value })); }
	function clearFilters() { setSearch(""); setFilters({ department: "", status: "", dateFrom: "", dateTo: "" }); }

	function exportCsv() {
		const header = ["Type", "Record ID", "Person ID", "Name", "Department", "Date", "Status", "Remarks"];
		const rows = visible.map((r) => [r.type, r.recordId, r.personId, r.fullName, r.department, r.date, r.status, r.remarks]);
		const csv = [header, ...rows].map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `attendance-report-${reportType.toLowerCase()}.csv`;
		link.click();
		URL.revokeObjectURL(url);
		setFeedback({ type: "success", message: "CSV report downloaded." });
	}

	return (
		<main className="attendance-page">
			<header className="attendance-page-header">
				<div>
					<p className="attendance-eyebrow">ACADEMICS / REPORTS</p>
					<h1>Attendance reports</h1>
					<p>Review attendance summaries and export filtered records.</p>
				</div>
				<button className="attendance-primary-button" onClick={exportCsv} type="button"><Download size={17} /> Export CSV</button>
			</header>

			<p className="attendance-demo-notice">Sample attendance report data · Not connected to live records.</p>

			{feedback && (
				<div className={`attendance-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="attendance-summary" aria-label="Report counts">
				<div><span className="attendance-summary-icon"><Search size={17} /></span><span>Total records</span><strong>{total}</strong></div>
				<div><span className="attendance-summary-icon is-active"><Search size={17} /></span><span>Present</span><strong>{present}</strong></div>
				<div><span className="attendance-summary-icon is-inactive"><Search size={17} /></span><span>Absent</span><strong>{absent}</strong></div>
				<div><span className="attendance-summary-icon"><Search size={17} /></span><span>Late</span><strong>{late}</strong></div>
				<div><span className="attendance-summary-icon"><Search size={17} /></span><span>Attendance rate</span><strong>{rate}%</strong></div>
			</section>

			<section className="attendance-directory">
				<div className="attendance-directory-heading">
					<div><h2>Report filters</h2><p>Showing {visible.length} of {source.length} records</p></div>
				</div>
				<div className="attendance-toolbar">
					<label className="attendance-search"><Search size={17} aria-hidden="true" /><input aria-label="Search report" onChange={(e) => setSearch(e.target.value)} placeholder="Search record, ID, or name" value={search} /></label>
					<div className="attendance-filters">
						<select aria-label="Report type" onChange={(e) => setReportType(e.target.value)} value={reportType}><option>Student</option><option>Faculty</option></select>
						<select aria-label="Filter by department" onChange={(e) => updateFilter("department", e.target.value)} value={filters.department}><option value="">All departments</option>{departments.map((d) => <option key={d}>{d}</option>)}</select>
						<select aria-label="Filter by status" onChange={(e) => updateFilter("status", e.target.value)} value={filters.status}><option value="">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
						<input aria-label="From date" onChange={(e) => updateFilter("dateFrom", e.target.value)} type="date" value={filters.dateFrom} />
						<input aria-label="To date" onChange={(e) => updateFilter("dateTo", e.target.value)} type="date" value={filters.dateTo} />
					</div>
					<button className="attendance-clear-button" disabled={!hasFilters} onClick={clearFilters} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				{visible.length ? (
					<div className="attendance-table-wrap">
						<table className="attendance-table">
							<thead><tr><th>Type</th><th>Record</th><th>Person ID</th><th>Name</th><th>Department</th><th>Date</th><th>Status</th><th>Remarks</th></tr></thead>
							<tbody>
								{visible.map((r) => (
									<tr key={r.uid}>
										<td>{r.type}</td>
										<td className="attendance-id-cell">{r.recordId}</td>
										<td>{r.personId}</td>
										<td><div className="attendance-name-cell"><span className="attendance-avatar">{r.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span><span><strong>{r.fullName}</strong></span></div></td>
										<td>{r.department}</td>
										<td>{r.date}</td>
										<td><span className={`attendance-status-badge ${r.status === "Present" ? "is-active" : r.status === "Absent" ? "is-inactive" : ""}`}><span />{r.status}</span></td>
										<td>{r.remarks || "—"}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="attendance-empty-state"><div><Search size={20} /></div><h3>No report records found</h3><p>Try a different search or clear your filters.</p><button className="attendance-secondary-button" onClick={clearFilters} type="button">Clear search and filters</button></div>
				)}
			</section>
		</main>
	);
}
