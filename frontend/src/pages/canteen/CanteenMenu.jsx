import { useState } from "react";
import { CirclePlus, Eye, FilterX, Pencil, Plus, Search, Trash2, X, ShoppingCart, Utensils } from "lucide-react";
import "./CanteenMenu.css";

const categories = ["Breakfast", "Lunch", "Snacks", "Beverages"];
const allowedTransitions = { Pending: ["Preparing", "Cancelled"], Preparing: ["Ready", "Cancelled"], Ready: ["Completed"], Completed: [], Cancelled: [] };

const initialMenu = [
	{ uid: "m-1", itemId: "ITM-001", name: "Veg Sandwich", description: "Fresh veg sandwich", category: "Snacks", price: 60, available: true },
	{ uid: "m-2", itemId: "ITM-002", name: "Coffee", description: "Hot coffee", category: "Beverages", price: 40, available: true },
];

const initialOrders = [
	{ uid: "o-1", orderId: "ORD-001", studentName: "Aarav Mehta", items: [{ itemId: "ITM-001", name: "Veg Sandwich", quantity: 2, price: 60 }], total: 120, status: "Pending", createdAt: "2026-10-20 10:00" },
];

const blankItem = { itemId: "", name: "", description: "", category: "Snacks", price: "", available: true };

function newUid(p) { return `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

export default function CanteenMenu() {
	const [menu, setMenu] = useState(initialMenu);
	const [orders, setOrders] = useState(initialOrders);
	const [cart, setCart] = useState([]);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ category: "", availability: "" });
	const [formOpen, setFormOpen] = useState(false);
	const [editingUid, setEditingUid] = useState(null);
	const [draft, setDraft] = useState(blankItem);
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState("");
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [feedback, setFeedback] = useState(null);
	const [orderFilter, setOrderFilter] = useState("");
	const [orderSearch, setOrderSearch] = useState("");

	const normalizedSearch = search.trim().toLowerCase();
	const visibleMenu = menu.filter((m) => {
		const matchesSearch = !normalizedSearch || [m.itemId, m.name, m.description].some((v) => v.toLowerCase().includes(normalizedSearch));
		return matchesSearch &&
			(!filters.category || m.category === filters.category) &&
			(filters.availability === "" || String(m.available) === filters.availability);
	});

	const cartTotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
	const hasFilters = Boolean(normalizedSearch || Object.values(filters).some(Boolean));

	function addToCart(item) {
		if (!item.available) { setFeedback({ type: "error", message: "Item unavailable." }); return; }
		setCart((c) => {
			const existing = c.find((x) => x.itemId === item.itemId);
			if (existing) return c.map((x) => x.itemId === item.itemId ? { ...x, quantity: x.quantity + 1 } : x);
			return [...c, { itemId: item.itemId, name: item.name, quantity: 1, price: item.price }];
		});
	}
	function updateQty(itemId, qty) {
		const q = Number(qty);
		if (q <= 0) { setCart((c) => c.filter((x) => x.itemId !== itemId)); return; }
		setCart((c) => c.map((x) => x.itemId === itemId ? { ...x, quantity: q } : x));
	}
	function checkout() {
		if (!cart.length) { setFeedback({ type: "error", message: "Cart is empty." }); return; }
		const order = { uid: newUid("o"), orderId: `ORD-${Date.now().toString().slice(-6)}`, studentName: "Aarav Mehta", items: [...cart], total: cartTotal, status: "Pending", createdAt: new Date().toLocaleString() };
		setOrders((c) => [order, ...c]);
		setCart([]);
		setFeedback({ type: "success", message: `Order ${order.orderId} placed.` });
	}

	function validateDraft() {
		const nextErrors = {};
		if (!draft.itemId.trim()) nextErrors.itemId = "Item ID required.";
		if (!draft.name.trim()) nextErrors.name = "Name required.";
		if (!draft.category) nextErrors.category = "Category required.";
		const price = Number(draft.price);
		if (!draft.price || isNaN(price) || price < 0) nextErrors.price = "Price must be non-negative.";
		const duplicate = menu.find((m) => m.uid !== editingUid && m.itemId.toLowerCase() === draft.itemId.trim().toLowerCase());
		if (duplicate) nextErrors.itemId = "Item ID already in use.";
		return nextErrors;
	}

	function handleSave(event) {
		event.preventDefault();
		const nextErrors = validateDraft();
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) { setFormError("Review the highlighted fields and try again."); return; }
		const record = { ...draft, uid: editingUid ?? newUid("m"), itemId: draft.itemId.trim(), name: draft.name.trim(), description: draft.description.trim(), price: Number(draft.price), available: draft.available };
		if (editingUid) {
			setMenu((c) => c.map((m) => m.uid === editingUid ? record : m));
			setFeedback({ type: "success", message: `${record.name} updated.` });
		} else {
			setMenu((c) => [record, ...c]);
			setFeedback({ type: "success", message: `${record.name} added.` });
		}
		setFormOpen(false);
		setDraft(blankItem);
	}

	function openEditForm(m) {
		setEditingUid(m.uid);
		setDraft({ ...m, price: String(m.price) });
		setErrors({});
		setFormError("");
		setFormOpen(true);
	}

	function updateStatus(order, newStatus) {
		if (!allowedTransitions[order.status]?.includes(newStatus)) return;
		setOrders((c) => c.map((o) => o.uid === order.uid ? { ...o, status: newStatus } : o));
		setFeedback({ type: "success", message: `Order ${order.orderId} updated to ${newStatus}.` });
	}

	function cancelOrder(order) {
		if (order.status === "Completed" || order.status === "Cancelled") return;
		updateStatus(order, "Cancelled");
	}

	const visibleOrders = orders.filter((o) =>
		(!orderSearch || o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) || o.studentName.toLowerCase().includes(orderSearch.toLowerCase())) &&
		(!orderFilter || o.status === orderFilter)
	);

	return (
		<main className="canteen-page">
			<header className="canteen-page-header">
				<div>
					<p className="canteen-eyebrow">CAMPUS LIFE / CANTEEN</p>
					<h1>Canteen management</h1>
					<p>Manage menu items and student orders.</p>
				</div>
				<button className="canteen-primary-button" onClick={() => { setEditingUid(null); setDraft(blankItem); setErrors({}); setFormError(""); setFormOpen(true); }} type="button"><Plus size={17} /> Add item</button>
			</header>

			<p className="canteen-demo-notice">Sample canteen data · Orders are not permanently saved or paid.</p>

			{feedback && (
				<div className={`canteen-feedback is-${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
					<span>{feedback.message}</span>
					<button onClick={() => setFeedback(null)} type="button" aria-label="Dismiss message"><X size={16} /></button>
				</div>
			)}

			<section className="canteen-directory">
				<div className="canteen-directory-heading">
					<div><h2>Menu</h2><p>Showing {visibleMenu.length} of {menu.length} items</p></div>
				</div>
				<div className="canteen-toolbar">
					<label className="canteen-search"><Search size={17} aria-hidden="true" /><input aria-label="Search menu" onChange={(e) => setSearch(e.target.value)} placeholder="Search item ID or name" value={search} /></label>
					<div className="canteen-filters">
						<select aria-label="Filter by category" onChange={(e) => setFilters((c) => ({ ...c, category: e.target.value }))} value={filters.category}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
						<select aria-label="Filter by availability" onChange={(e) => setFilters((c) => ({ ...c, availability: e.target.value }))} value={filters.availability}><option value="">All</option><option value="true">Available</option><option value="false">Unavailable</option></select>
					</div>
					<button className="canteen-clear-button" disabled={!hasFilters} onClick={() => { setSearch(""); setFilters({ category: "", availability: "" }); }} type="button"><FilterX size={15} />Clear filters</button>
				</div>

				<div className="canteen-table-wrap">
					<table className="canteen-table">
						<thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Available</th><th>Cart</th><th>Actions</th></tr></thead>
						<tbody>
							{visibleMenu.map((m) => (
								<tr key={m.uid}>
									<td><div className="canteen-name-cell"><span className="canteen-avatar"><Utensils size={14} /></span><span><strong>{m.name}</strong><small>{m.itemId} · {m.description}</small></span></div></td>
									<td>{m.category}</td>
									<td>{m.price}</td>
									<td>{m.available ? "Yes" : "No"}</td>
									<td><button disabled={!m.available} onClick={() => addToCart(m)} type="button"><ShoppingCart size={14} /> Add</button></td>
									<td><div className="canteen-row-actions">
										<button onClick={() => openEditForm(m)} title="Edit" type="button"><Pencil size={15} /></button>
										<button onClick={() => { setMenu((c) => c.filter((x) => x.uid !== m.uid)); setFeedback({ type: "success", message: `${m.name} removed.` }); }} title="Delete" type="button"><Trash2 size={15} /></button>
									</div></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section className="canteen-directory">
				<div className="canteen-directory-heading">
					<div><h2>Cart</h2><p>{cart.length} items · Total {cartTotal}</p></div>
					<button className="canteen-primary-button" onClick={checkout} type="button"><ShoppingCart size={17} /> Checkout</button>
				</div>
				{cart.length ? (
					<div className="canteen-table-wrap">
						<table className="canteen-table">
							<thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th><th>Remove</th></tr></thead>
							<tbody>
								{cart.map((c) => (
									<tr key={c.itemId}>
										<td>{c.name}</td>
										<td><input min="1" onChange={(e) => updateQty(c.itemId, e.target.value)} type="number" value={c.quantity} /></td>
										<td>{c.price}</td>
										<td>{c.price * c.quantity}</td>
										<td><button onClick={() => updateQty(c.itemId, 0)} type="button"><Trash2 size={14} /></button></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : <p className="canteen-no-slots">Cart is empty.</p>}
			</section>

			<section className="canteen-directory">
				<div className="canteen-directory-heading">
					<div><h2>Orders</h2><p>Showing {visibleOrders.length} of {orders.length} orders</p></div>
				</div>
				<div className="canteen-toolbar">
					<label className="canteen-search"><Search size={17} aria-hidden="true" /><input onChange={(e) => setOrderSearch(e.target.value)} placeholder="Search order ID or student" value={orderSearch} /></label>
					<select onChange={(e) => setOrderFilter(e.target.value)} value={orderFilter}><option value="">All statuses</option>{["Pending", "Preparing", "Ready", "Completed", "Cancelled"].map((s) => <option key={s}>{s}</option>)}</select>
				</div>
				<div className="canteen-table-wrap">
					<table className="canteen-table">
						<thead><tr><th>Order</th><th>Student</th><th>Total</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
						<tbody>
							{visibleOrders.map((o) => (
								<tr key={o.uid}>
									<td>{o.orderId}</td>
									<td>{o.studentName}</td>
									<td>{o.total}</td>
									<td>{o.status}</td>
									<td>{o.createdAt}</td>
									<td><div className="canteen-row-actions">
										<button onClick={() => setSelectedOrder(o)} title="View" type="button"><Eye size={14} /></button>
										{allowedTransitions[o.status]?.map((s) => (
											<button key={s} onClick={() => updateStatus(o, s)} type="button">{s}</button>
										))}
										{o.status !== "Completed" && o.status !== "Cancelled" && (
											<button onClick={() => cancelOrder(o)} type="button">Cancel</button>
										)}
									</div></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{formOpen && (
				<div className="canteen-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}>
					<section aria-labelledby="canteen-form-title" aria-modal="true" className="canteen-modal canteen-form-modal" role="dialog">
						<header className="canteen-modal-header"><div><p className="canteen-eyebrow">MENU ITEM</p><h2 id="canteen-form-title">{editingUid ? "Edit item" : "Add item"}</h2></div><button aria-label="Close form" className="canteen-modal-close" onClick={() => setFormOpen(false)} type="button"><X size={18} /></button></header>
						<form noValidate onSubmit={handleSave}>
							<p className="canteen-required-note">Fields marked <span>*</span> are required.</p>
							{formError && <p className="canteen-form-error" role="alert">{formError}</p>}
							<div className="canteen-form-grid">
								<div className={`canteen-form-field${errors.itemId ? " has-error" : ""}`}><label htmlFor="ci-id">Item ID<span> *</span></label><input id="ci-id" onChange={(e) => setDraft((c) => ({ ...c, itemId: e.target.value }))} placeholder="e.g. ITM-010" value={draft.itemId} />{errors.itemId && <small className="canteen-field-error">{errors.itemId}</small>}</div>
								<div className={`canteen-form-field${errors.name ? " has-error" : ""}`}><label htmlFor="ci-name">Name<span> *</span></label><input id="ci-name" onChange={(e) => setDraft((c) => ({ ...c, name: e.target.value }))} placeholder="Item name" value={draft.name} />{errors.name && <small className="canteen-field-error">{errors.name}</small>}</div>
								<div className="canteen-form-field"><label htmlFor="ci-desc">Description</label><input id="ci-desc" onChange={(e) => setDraft((c) => ({ ...c, description: e.target.value }))} placeholder="Description" value={draft.description} /></div>
								<div className={`canteen-form-field${errors.category ? " has-error" : ""}`}><label htmlFor="ci-cat">Category<span> *</span></label><select id="ci-cat" onChange={(e) => setDraft((c) => ({ ...c, category: e.target.value }))} value={draft.category}><option value="">Select</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>{errors.category && <small className="canteen-field-error">{errors.category}</small>}</div>
								<div className={`canteen-form-field${errors.price ? " has-error" : ""}`}><label htmlFor="ci-price">Price<span> *</span></label><input id="ci-price" onChange={(e) => setDraft((c) => ({ ...c, price: e.target.value }))} placeholder="e.g. 60" type="number" value={draft.price} />{errors.price && <small className="canteen-field-error">{errors.price}</small>}</div>
								<div className="canteen-form-field"><label htmlFor="ci-avail">Available</label><select id="ci-avail" onChange={(e) => setDraft((c) => ({ ...c, available: e.target.value === "true" }))} value={String(draft.available)}><option value="true">Yes</option><option value="false">No</option></select></div>
							</div>
							<footer className="canteen-modal-footer"><button className="canteen-secondary-button" onClick={() => setFormOpen(false)} type="button">Cancel</button><button className="canteen-primary-button" type="submit"><CirclePlus size={16} />{editingUid ? "Save changes" : "Add item"}</button></footer>
						</form>
					</section>
				</div>
			)}

			{selectedOrder && (
				<div className="canteen-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedOrder(null); }}>
					<section aria-labelledby="order-details-title" aria-modal="true" className="canteen-modal canteen-details-modal" role="dialog">
						<header className="canteen-modal-header"><div><p className="canteen-eyebrow">ORDER</p><h2 id="order-details-title">Order details</h2></div><button aria-label="Close details" className="canteen-modal-close" onClick={() => setSelectedOrder(null)} type="button"><X size={18} /></button></header>
						<dl className="canteen-details-grid">{[["Order ID", selectedOrder.orderId], ["Student", selectedOrder.studentName], ["Status", selectedOrder.status], ["Created", selectedOrder.createdAt], ["Total", selectedOrder.total]].map(([l, v]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}</dl>
						<h3>Items</h3>
						<ul>{selectedOrder.items.map((it) => <li key={it.itemId}>{it.name} × {it.quantity} = {it.price * it.quantity}</li>)}</ul>
						<footer className="canteen-modal-footer"><button className="canteen-secondary-button" onClick={() => setSelectedOrder(null)} type="button">Close</button></footer>
					</section>
				</div>
			)}

			{deleteTarget && (
				<div className="canteen-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
					<section aria-labelledby="delete-item-title" aria-modal="true" className="canteen-modal canteen-confirm-modal" role="alertdialog">
						<div className="canteen-delete-icon"><Trash2 size={20} /></div><h2 id="delete-item-title">Delete menu item?</h2>
						<p>Remove <strong>{deleteTarget.name}</strong> ({deleteTarget.itemId}) from this demo list? This change only affects the current page session.</p>
						<footer className="canteen-modal-footer"><button className="canteen-secondary-button" onClick={() => setDeleteTarget(null)} type="button">Keep item</button><button className="canteen-danger-button" onClick={() => { setMenu((c) => c.filter((m) => m.uid !== deleteTarget.uid)); setFeedback({ type: "success", message: `${deleteTarget.name} removed.` }); setDeleteTarget(null); }} type="button"><Trash2 size={15} />Delete item</button></footer>
					</section>
				</div>
			)}
		</main>
	);
}
