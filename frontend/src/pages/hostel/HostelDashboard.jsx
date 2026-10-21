import { useState } from "react";
import { CirclePlus, Eye, FilterX, Pencil, Plus, Search, Trash2, X, House, BedDouble } from "lucide-react";
import "./HostelDashboard.css";

const hostelTypes = ["Boys", "Girls", "Mixed"];
const roomTypes = ["Single", "Double", "Triple", "Dormitory"];

const initialHostels = [
	{ uid: "h-1", hostelId: "HST-001", name: "North Residence", type: "Boys", address: "North Campus", warden: "Mr. Ravi Kumar", roomCount: 2 },
];

const initialRooms = [
	{ uid: "r-1", roomId: "RM-101", hostelId: "HST-001", roomNumber: "101", roomType: "Double", capacity: 2, occupied: 1 },
	{ uid: "r-2", roomId: "RM-102", hostelId: "HST-001", roomNumber: "102", roomType: "Triple", capacity: 3, occupied: 2 },
];

const initialAllocations = [
	{ uid: "a-1", allocationId: "AL-001", studentName: "Aarav Mehta", rollNumber: "CMS2026001", hostelId: "HST-001", roomId: "RM-101", bedNumber: "1" },
];

const blankHostel = { hostelId: "", name: "", type: "Boys", address: "", warden: "", roomCount: "" };
const blankRoom = { roomId: "", hostelId: "", roomNumber: "", roomType: "Double", capacity: "", occupied: "0" };
const blankAllocation = { allocationId: "", studentName: "", rollNumber: "", hostelId: "", roomId: "", bedNumber: "" };

function newUid(p) { return `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

export default function HostelDashboard() {
	const [hostels, setHostels] = useState(initialHostels);
	const [rooms, setRooms] = useState(initialRooms);
	const [allocations, setAllocations] = useState(initialAllocations);
	const [hostelFormOpen, setHostelFormOpen] = useState(false);
	const [roomFormOpen, setRoomFormOpen] = useState(false);
	const [allocationFormOpen, setAllocationFormOpen] = useState(false);
	const [hostelDraft, setHostelDraft] = useState(blankHostel);
	const [roomDraft, setRoomDraft] = useState(blankRoom);
	const [allocationDraft, setAllocationDraft] = useState(blankAllocation);
	const [hostelErrors, setHostelErrors] = useState({});
	const [roomErrors, setRoomErrors] = useState({});
	const [allocationErrors, setAllocationErrors] = useState({});
	const [feedback, setFeedback] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);

	const totalRooms = rooms.length;
	const totalBeds = rooms.reduce((s, r) => s + Number(r.capacity), 0);
	const occupiedBeds = rooms.reduce((s, r) => s + Number(r.occupied), 0);
	const availableBeds = totalBeds - occupiedBeds;
	const occupancy = totalBeds ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

	function saveHostel(e) {
		e.preventDefault();
		const errs = {};
		if (!hostelDraft.hostelId.trim()) errs.hostelId = "Hostel ID required.";
		if (!hostelDraft.name.trim()) errs.name = "Name required.";
		if (!hostelDraft.address.trim()) errs.address = "Address required.";
		if (!hostelDraft.warden.trim()) errs.warden = "Warden required.";
		if (Object.keys(errs).length) { setHostelErrors(errs); return; }
		const record = { ...hostelDraft, uid: newUid("h"), hostelId: hostelDraft.hostelId.trim(), name: hostelDraft.name.trim(), address: hostelDraft.address.trim(), warden: hostelDraft.warden.trim(), roomCount: hostelDraft.roomCount || "0" };
		setHostels((c) => [record, ...c]);
		setFeedback({ type: "success", message: `${record.name} hostel added.` });
		setHostelFormOpen(false);
		setHostelDraft(blankHostel);
	}

	function saveRoom(e) {
		e.preventDefault();
		const errs = {};
		if (!roomDraft.roomId.trim()) errs.roomId = "Room ID required.";
		if (!roomDraft.hostelId) errs.hostelId = "Hostel required.";
		if (!roomDraft.roomNumber.trim()) errs.roomNumber = "Room number required.";
		const cap = Number(roomDraft.capacity);
		const occ = Number(roomDraft.occupied || 0);
		if (!roomDraft.capacity || isNaN(cap) || cap <= 0) errs.capacity = "Capacity must be > 0.";
		if (isNaN(occ) || occ < 0 || occ > cap) errs.occupied = "Occupied must be between 0 and capacity.";
		if (Object.keys(errs).length) { setRoomErrors(errs); return; }
		const record = { ...roomDraft, uid: newUid("r"), roomId: roomDraft.roomId.trim(), roomNumber: roomDraft.roomNumber.trim(), capacity: String(cap), occupied: String(occ) };
		setRooms((c) => [record, ...c]);
		setFeedback({ type: "success", message: `Room ${record.roomNumber} added.` });
		setRoomFormOpen(false);
		setRoomDraft(blankRoom);
	}

	function saveAllocation(e) {
		e.preventDefault();
		const errs = {};
		if (!allocationDraft.allocationId.trim()) errs.allocationId = "Allocation ID required.";
		if (!allocationDraft.studentName.trim()) errs.studentName = "Student name required.";
		if (!allocationDraft.rollNumber.trim()) errs.rollNumber = "Roll number required.";
		if (!allocationDraft.hostelId) errs.hostelId = "Hostel required.";
		if (!allocationDraft.roomId) errs.roomId = "Room required.";
		if (!allocationDraft.bedNumber.trim()) errs.bedNumber = "Bed number required.";
		if (Object.keys(errs).length) { setAllocationErrors(errs); return; }
		const record = { ...allocationDraft, uid: newUid("a"), allocationId: allocationDraft.allocationId.trim(), studentName: allocationDraft.studentName.trim(), rollNumber: allocationDraft.rollNumber.trim(), bedNumber: allocationDraft.bedNumber.trim() };
		setAllocations((c) => [record, ...c]);
		// increment occupied
		setRooms((c) => c.map((r) => r.uid === record.roomId ? { ...r, occupied: String(Number(r.occupied) + 1) } : r));
		setFeedback({ type: "success", message: `${record.studentName} allocated.` });
		setAllocationFormOpen(false);
		setAllocationDraft(blankAllocation);
	}

	function removeAllocation(a) {
		setAllocations((c) => c.filter((x) => x.uid !== a.uid));
		setRooms((c) => c.map((r) => r.uid === a.roomId ? { ...r, occupied: String(Math.max(0, Number(r.occupied) - 1)) } : r));
		setFeedback({ type: "success", message: `${a.studentName} allocation removed.` });
	}

	return (
		<main className="hostel-page">
			<header className="hostel-page-header">
				<div>
					<p className="hostel-eyebrow">CAMPUS LIFE / HOSTEL</p>
					<h1>Hostel management</h1>
					<p>Manage hostels, rooms, and student accommodation.</p>
				</div>
			</header>

			<p className="hostel-demo-notice">Sample hostel records · Changes stay in this page's demo session and are not saved permanently.</p>

			{feedback && (
				<div className={`hostel-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="hostel-summary" aria-label="Hostel counts">
				<div><span className="hostel-summary-icon"><House size={17} /></span><span>Total hostels</span><strong>{hostels.length}</strong></div>
				<div><span className="hostel-summary-icon"><BedDouble size={17} /></span><span>Total rooms</span><strong>{totalRooms}</strong></div>
				<div><span className="hostel-summary-icon"><BedDouble size={17} /></span><span>Total beds</span><strong>{totalBeds}</strong></div>
				<div><span className="hostel-summary-icon"><BedDouble size={17} /></span><span>Occupied</span><strong>{occupiedBeds}</strong></div>
				<div><span className="hostel-summary-icon"><BedDouble size={17} /></span><span>Available</span><strong>{availableBeds}</strong></div>
				<div><span className="hostel-summary-icon"><BedDouble size={17} /></span><span>Occupancy</span><strong>{occupancy}%</strong></div>
			</section>

			<section className="hostel-directory">
				<div className="hostel-directory-heading">
					<div><h2>Hostels</h2><p>{hostels.length} hostels</p></div>
					<button className="hostel-primary-button" onClick={() => setHostelFormOpen((v) => !v)} type="button"><Plus size={17} /> {hostelFormOpen ? "Close" : "Add hostel"}</button>
				</div>
				{hostelFormOpen && (
					<form className="hostel-inline-form" onSubmit={saveHostel}>
						<input placeholder="Hostel ID" value={hostelDraft.hostelId} onChange={(e) => setHostelDraft((c) => ({ ...c, hostelId: e.target.value }))} />
						<input placeholder="Name" value={hostelDraft.name} onChange={(e) => setHostelDraft((c) => ({ ...c, name: e.target.value }))} />
						<select value={hostelDraft.type} onChange={(e) => setHostelDraft((c) => ({ ...c, type: e.target.value }))}>{hostelTypes.map((t) => <option key={t}>{t}</option>)}</select>
						<input placeholder="Address" value={hostelDraft.address} onChange={(e) => setHostelDraft((c) => ({ ...c, address: e.target.value }))} />
						<input placeholder="Warden" value={hostelDraft.warden} onChange={(e) => setHostelDraft((c) => ({ ...c, warden: e.target.value }))} />
						<button className="hostel-primary-button" type="submit"><CirclePlus size={16} /> Save</button>
					</form>
				)}
				<div className="hostel-table-wrap">
					<table className="hostel-table">
						<thead><tr><th>Hostel</th><th>Type</th><th>Address</th><th>Warden</th><th>Rooms</th><th>Actions</th></tr></thead>
						<tbody>
							{hostels.map((h) => (
								<tr key={h.uid}>
									<td><strong>{h.name}</strong><br /><small>{h.hostelId}</small></td>
									<td>{h.type}</td>
									<td>{h.address}</td>
									<td>{h.warden}</td>
									<td>{rooms.filter((r) => r.hostelId === h.hostelId).length}</td>
									<td><button onClick={() => { setHostels((c) => c.filter((x) => x.uid !== h.uid)); setFeedback({ type: "success", message: `${h.name} removed.` }); }} type="button"><Trash2 size={15} /></button></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section className="hostel-directory">
				<div className="hostel-directory-heading">
					<div><h2>Rooms</h2><p>{rooms.length} rooms</p></div>
					<button className="hostel-primary-button" onClick={() => setRoomFormOpen((v) => !v)} type="button"><Plus size={17} /> {roomFormOpen ? "Close" : "Add room"}</button>
				</div>
				{roomFormOpen && (
					<form className="hostel-inline-form" onSubmit={saveRoom}>
						<input placeholder="Room ID" value={roomDraft.roomId} onChange={(e) => setRoomDraft((c) => ({ ...c, roomId: e.target.value }))} />
						<select value={roomDraft.hostelId} onChange={(e) => setRoomDraft((c) => ({ ...c, hostelId: e.target.value }))}><option value="">Select hostel</option>{hostels.map((h) => <option key={h.uid} value={h.hostelId}>{h.name}</option>)}</select>
						<input placeholder="Room number" value={roomDraft.roomNumber} onChange={(e) => setRoomDraft((c) => ({ ...c, roomNumber: e.target.value }))} />
						<select value={roomDraft.roomType} onChange={(e) => setRoomDraft((c) => ({ ...c, roomType: e.target.value }))}>{roomTypes.map((t) => <option key={t}>{t}</option>)}</select>
						<input placeholder="Capacity" type="number" value={roomDraft.capacity} onChange={(e) => setRoomDraft((c) => ({ ...c, capacity: e.target.value }))} />
						<input placeholder="Occupied" type="number" value={roomDraft.occupied} onChange={(e) => setRoomDraft((c) => ({ ...c, occupied: e.target.value }))} />
						<button className="hostel-primary-button" type="submit"><CirclePlus size={16} /> Save</button>
					</form>
				)}
				<div className="hostel-table-wrap">
					<table className="hostel-table">
						<thead><tr><th>Room</th><th>Hostel</th><th>Type</th><th>Capacity</th><th>Occupied</th><th>Available</th><th>Actions</th></tr></thead>
						<tbody>
							{rooms.map((r) => {
								const hostel = hostels.find((h) => h.hostelId === r.hostelId);
								return (
									<tr key={r.uid}>
										<td><strong>{r.roomNumber}</strong><br /><small>{r.roomId}</small></td>
										<td>{hostel?.name || r.hostelId}</td>
										<td>{r.roomType}</td>
										<td>{r.capacity}</td>
										<td>{r.occupied}</td>
										<td>{Number(r.capacity) - Number(r.occupied)}</td>
										<td><button onClick={() => { setRooms((c) => c.filter((x) => x.uid !== r.uid)); setFeedback({ type: "success", message: `Room ${r.roomNumber} removed.` }); }} type="button"><Trash2 size={15} /></button></td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</section>

			<section className="hostel-directory">
				<div className="hostel-directory-heading">
					<div><h2>Student accommodation</h2><p>{allocations.length} allocations</p></div>
					<button className="hostel-primary-button" onClick={() => setAllocationFormOpen((v) => !v)} type="button"><Plus size={17} /> {allocationFormOpen ? "Close" : "Assign student"}</button>
				</div>
				{allocationFormOpen && (
					<form className="hostel-inline-form" onSubmit={saveAllocation}>
						<input placeholder="Allocation ID" value={allocationDraft.allocationId} onChange={(e) => setAllocationDraft((c) => ({ ...c, allocationId: e.target.value }))} />
						<input placeholder="Student name" value={allocationDraft.studentName} onChange={(e) => setAllocationDraft((c) => ({ ...c, studentName: e.target.value }))} />
						<input placeholder="Roll number" value={allocationDraft.rollNumber} onChange={(e) => setAllocationDraft((c) => ({ ...c, rollNumber: e.target.value }))} />
						<select value={allocationDraft.hostelId} onChange={(e) => setAllocationDraft((c) => ({ ...c, hostelId: e.target.value, roomId: "" }))}><option value="">Select hostel</option>{hostels.map((h) => <option key={h.uid} value={h.hostelId}>{h.name}</option>)}</select>
						<select value={allocationDraft.roomId} onChange={(e) => setAllocationDraft((c) => ({ ...c, roomId: e.target.value }))}><option value="">Select room</option>{rooms.filter((r) => r.hostelId === allocationDraft.hostelId).map((r) => <option key={r.uid} value={r.uid}>{r.roomNumber}</option>)}</select>
						<input placeholder="Bed number" value={allocationDraft.bedNumber} onChange={(e) => setAllocationDraft((c) => ({ ...c, bedNumber: e.target.value }))} />
						<button className="hostel-primary-button" type="submit"><CirclePlus size={16} /> Assign</button>
					</form>
				)}
				<div className="hostel-table-wrap">
					<table className="hostel-table">
						<thead><tr><th>Allocation</th><th>Student</th><th>Roll no.</th><th>Hostel</th><th>Room</th><th>Bed</th><th>Actions</th></tr></thead>
						<tbody>
							{allocations.map((a) => {
								const hostel = hostels.find((h) => h.hostelId === a.hostelId);
								const room = rooms.find((r) => r.uid === a.roomId);
								return (
									<tr key={a.uid}>
										<td>{a.allocationId}</td>
										<td>{a.studentName}</td>
										<td>{a.rollNumber}</td>
										<td>{hostel?.name || a.hostelId}</td>
										<td>{room?.roomNumber || "—"}</td>
										<td>{a.bedNumber}</td>
										<td><button onClick={() => removeAllocation(a)} type="button"><Trash2 size={15} /></button></td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</section>
		</main>
	);
}
