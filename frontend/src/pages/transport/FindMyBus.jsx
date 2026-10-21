import { useState } from "react";
import { Bus, Search, Plus, Trash2, X, MapPin, Clock } from "lucide-react";
import "./FindMyBus.css";

const buses = [
	{ uid: "b-1", busId: "BUS-001", busNumber: "TN-01", capacity: 40, driver: "Ravi Kumar", contact: "9876543210", status: "Active" },
];
const routes = [
	{ uid: "rt-1", routeId: "RT-001", routeName: "Route A", startPoint: "Main Gate", destination: "City Center", stops: ["Main Gate", "Library", "Hostel", "City Center"], pickupTime: "08:00", dropTime: "09:00", busId: "BUS-001", status: "Active" },
];
const assignments = [
	{ uid: "as-1", studentId: "CMS2026001", studentName: "Aarav Mehta", routeId: "RT-001", busId: "BUS-001", pickupStop: "Library", status: "Active" },
];

export default function FindMyBus() {
	const [tab, setTab] = useState("find");
	const [query, setQuery] = useState("");
	const [selectedStudent, setSelectedStudent] = useState("CMS2026001");

	const assignment = assignments.find((a) => a.studentId === selectedStudent && a.status === "Active");
	const route = assignment ? routes.find((r) => r.routeId === assignment.routeId) : null;
	const bus = assignment ? buses.find((b) => b.busId === assignment.busId) : null;

	const filteredAssignments = assignments.filter((a) =>
		!query || a.studentName.toLowerCase().includes(query.toLowerCase()) || a.studentId.toLowerCase().includes(query.toLowerCase())
	);

	return (
		<main className="findmybus-page">
			<header className="findmybus-page-header">
				<div>
					<p className="findmybus-eyebrow">CAMPUS LIFE / TRANSPORT</p>
					<h1>Transport & Find My Bus</h1>
					<p>Manage transport and help students find their bus.</p>
				</div>
			</header>

			<p className="findmybus-demo-notice">Sample transport data · Scheduled route information only. No live GPS tracking.</p>

			<div className="findmybus-tabs">
				<button className={tab === "manage" ? "is-active" : ""} onClick={() => setTab("manage")} type="button">Transport management</button>
				<button className={tab === "find" ? "is-active" : ""} onClick={() => setTab("find")} type="button">Find my bus</button>
			</div>

			{tab === "manage" && (
				<section className="findmybus-directory">
					<h2>Buses</h2>
					<div className="findmybus-table-wrap">
						<table className="findmybus-table">
							<thead><tr><th>Bus</th><th>Registration</th><th>Capacity</th><th>Driver</th><th>Contact</th><th>Status</th></tr></thead>
							<tbody>
								{buses.map((b) => (
									<tr key={b.uid}><td>{b.busNumber}</td><td>{b.busId}</td><td>{b.capacity}</td><td>{b.driver}</td><td>{b.contact}</td><td>{b.status}</td></tr>
								))}
							</tbody>
						</table>
					</div>

					<h2>Routes</h2>
					<div className="findmybus-table-wrap">
						<table className="findmybus-table">
							<thead><tr><th>Route</th><th>Start</th><th>Destination</th><th>Pickup</th><th>Drop</th><th>Bus</th><th>Status</th></tr></thead>
							<tbody>
								{routes.map((r) => (
									<tr key={r.uid}><td>{r.routeName}</td><td>{r.startPoint}</td><td>{r.destination}</td><td>{r.pickupTime}</td><td>{r.dropTime}</td><td>{r.busId}</td><td>{r.status}</td></tr>
								))}
							</tbody>
						</table>
					</div>

					<h2>Student assignments</h2>
					<label className="findmybus-search"><Search size={17} aria-hidden="true" /><input onChange={(e) => setQuery(e.target.value)} placeholder="Search student" value={query} /></label>
					<div className="findmybus-table-wrap">
						<table className="findmybus-table">
							<thead><tr><th>Student ID</th><th>Name</th><th>Route</th><th>Bus</th><th>Pickup stop</th><th>Status</th></tr></thead>
							<tbody>
								{filteredAssignments.map((a) => (
									<tr key={a.uid}><td>{a.studentId}</td><td>{a.studentName}</td><td>{a.routeId}</td><td>{a.busId}</td><td>{a.pickupStop}</td><td>{a.status}</td></tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			)}

			{tab === "find" && (
				<section className="findmybus-lookup">
					<label>Select student
						<select onChange={(e) => setSelectedStudent(e.target.value)} value={selectedStudent}>
							{assignments.map((a) => <option key={a.uid} value={a.studentId}>{a.studentName} ({a.studentId})</option>)}
						</select>
					</label>

					{assignment && route && bus ? (
						<div className="findmybus-card">
							<h2>{assignment.studentName}</h2>
							<p><Bus size={16} /> Bus: {bus.busNumber} ({bus.busId})</p>
							<p><MapPin size={16} /> Route: {route.routeName} ({route.routeId})</p>
							<p><MapPin size={16} /> Pickup stop: {assignment.pickupStop}</p>
							<p><Clock size={16} /> Scheduled pickup: {route.pickupTime}</p>
							<p><MapPin size={16} /> Destination: {route.destination}</p>
							<h3>Route stops</h3>
							<ol>{route.stops.map((s) => <li key={s}>{s}</li>)}</ol>
							<p className="findmybus-note">Scheduled route information only. No live GPS tracking.</p>
						</div>
					) : (
						<div className="findmybus-empty"><p>No active transport assignment found for this student.</p></div>
					)}
				</section>
			)}
		</main>
	);
}
