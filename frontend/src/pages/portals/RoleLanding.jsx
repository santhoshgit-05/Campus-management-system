import { Construction, ShieldCheck } from "lucide-react";
import { ROLE_CONFIG } from "../../config/roleConfig.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./RoleLanding.css";

const roleDescriptions = {
	collegeAdmin: "Your College Admin demo account is active. The College Admin-specific workspace is not configured yet.",
	otherStaff: "Your Other Staff demo account is active. Staff-specific tasks and campus workflows are not configured yet.",
};

export default function RoleLanding({ role }) {
	const { user } = useAuth();
	const roleName = ROLE_CONFIG[role].label;

	return (
		<main className="role-landing" id="overview">
			<header className="role-landing-header">
				<div><p className="role-landing-kicker">{roleName.toUpperCase()} PORTAL</p><h1>Welcome to your workspace</h1><p>{roleDescriptions[role]}</p></div>
				<span className="role-landing-demo">Frontend demo · Sample session</span>
			</header>
			<section className="role-landing-notice">
				<div className="role-landing-icon"><Construction size={21} /></div>
				<div><p className="role-landing-kicker">ROLE WORKSPACE</p><h2>Role-specific features are not set up yet</h2><p>This account can sign in, but it does not inherit Admin permissions. No Admin management pages or records are exposed in this portal.</p></div>
			</section>
			<p className="role-landing-session"><ShieldCheck size={15} /> Signed in to this local demo as <strong>{user?.id}</strong>. This frontend session is not production security.</p>
		</main>
	);
}