import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, ChevronDown, Check, ShieldCheck, UsersRound, GraduationCap, BookOpen, Building2, BriefcaseBusiness, Bus } from "lucide-react";
import { LOGIN_ROLES, ROLE_CONFIG } from "../../config/roleConfig.js";
import { DEMO_CREDENTIALS, useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import ThemeToggle from "../../components/ThemeToggle.jsx";
import "./Login.css";

const roleIcons = {
	student: GraduationCap,
	faculty: BookOpen,
	admin: ShieldCheck,
	collegeAdmin: Building2,
	otherStaff: BriefcaseBusiness,
};

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const { mode, setPreviewRole } = useTheme();
	const [error, setError] = useState("");
	const [selectedRole, setSelectedRole] = useState("admin");
	const [showPassword, setShowPassword] = useState(false);
	const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
	const [activeRoleIndex, setActiveRoleIndex] = useState(2);
	const roleConfig = ROLE_CONFIG[selectedRole];
	const selectedRoleIndex = LOGIN_ROLES.findIndex((role) => role.value === selectedRole);

	function chooseRole(roleValue) {
		setSelectedRole(roleValue);
		setActiveRoleIndex(LOGIN_ROLES.findIndex((role) => role.value === roleValue));
		setIsRoleMenuOpen(false);
		setError("");
	}

	function handleRoleKeyDown(event) {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			if (!isRoleMenuOpen) {
				setActiveRoleIndex(selectedRoleIndex);
				setIsRoleMenuOpen(true);
				return;
			}
			const direction = event.key === "ArrowDown" ? 1 : -1;
			setActiveRoleIndex((current) => (current + direction + LOGIN_ROLES.length) % LOGIN_ROLES.length);
			return;
		}

		if (event.key === "Home" || event.key === "End") {
			event.preventDefault();
			setIsRoleMenuOpen(true);
			setActiveRoleIndex(event.key === "Home" ? 0 : LOGIN_ROLES.length - 1);
			return;
		}

		if (event.key === "Escape") {
			setIsRoleMenuOpen(false);
			return;
		}

		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			if (isRoleMenuOpen) {
				chooseRole(LOGIN_ROLES[activeRoleIndex].value);
			} else {
				setActiveRoleIndex(selectedRoleIndex);
				setIsRoleMenuOpen(true);
			}
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const id = String(formData.get("id") ?? "").trim();
		const password = String(formData.get("password") ?? "");

		if (!roleConfig.demoSupported) {
			setError(`${roleConfig.label} sign-in is not configured in this development demo.`);
			return;
		}

		if (login(selectedRole, id, password)) {
			navigate(roleConfig.dashboardPath, { replace: true });
			return;
		}

		setError(`Incorrect ${roleConfig.label} ID or password. Use the matching development demo credentials.`);
	}

	return (
		<main className="login-page" data-theme={mode}>
			<ThemeToggle className="login-theme-toggle" />
			<section className="login-brand-panel" aria-label="Campus Management System">
				<div className="login-brand-icon" aria-hidden="true"><Building2 size={24} strokeWidth={1.8} /><span>CMS</span></div>
				<p className="login-brand-label">CAMPUS MANAGEMENT SYSTEM</p>
				<h1>Campus life, clearly connected.</h1>
				<p className="login-brand-description">
					One thoughtful workspace for learning, campus services, and the people who keep them moving.
				</p>
				<div className="login-campus-highlights" aria-label="Campus services">
					<div><BookOpen size={17} /><span>Academic programs</span></div>
					<div><UsersRound size={17} /><span>People &amp; departments</span></div>
					<div><Bus size={17} /><span>Campus services</span></div>
				</div>
				<div className="login-brand-footer">
					<span className="login-status-dot" aria-hidden="true" />
					Campus portal
				</div>
			</section>

			<section className="login-form-panel">
				<div className="login-form-container">
					<div className="login-mobile-icon" aria-hidden="true"><Building2 size={22} /><span>CMS</span></div>
					<p className="login-eyebrow">WELCOME BACK</p>
					<h2>Sign in to your campus</h2>
					<p className="login-subtitle">Select your role and use its local demo account.</p>
					<section className="login-demo-credentials" aria-label="Local development demo credentials">
						<p>Development demo credentials · Do not use in production</p>
						{LOGIN_ROLES.filter((role) => DEMO_CREDENTIALS[role.value]).map((role) => (
							<div key={role.value}>
								<strong>{role.label}</strong>
								<span><code>{DEMO_CREDENTIALS[role.value].id}</code> / <code>{DEMO_CREDENTIALS[role.value].password}</code></span>
							</div>
						))}
						<small>All five accounts are local development demos only; do not use them in production.</small>
					</section>

					{error && <p className="login-error" role="alert">{error}</p>}

					<form className="login-form" onSubmit={handleSubmit}>
						<div className="login-role-field">
							<label id="login-role-label">Login As</label>
							<button
								aria-activedescendant={isRoleMenuOpen ? `login-role-option-${LOGIN_ROLES[activeRoleIndex].value}` : undefined}
								aria-controls="login-role-options"
								aria-expanded={isRoleMenuOpen}
								aria-haspopup="listbox"
								aria-labelledby="login-role-label"
								className={`login-role-select${isRoleMenuOpen ? " is-open" : ""}`}
								id="login-role"
								onClick={() => {
									setActiveRoleIndex(selectedRoleIndex);
									setIsRoleMenuOpen((open) => !open);
								}}
								onKeyDown={handleRoleKeyDown}
								role="combobox"
								type="button"
							>
								{(() => {
									const SelectedRoleIcon = roleIcons[selectedRole];
									return <span className={`login-role-choice-icon is-${selectedRole}`}><SelectedRoleIcon size={17} /></span>;
								})()}
								<span className="login-role-selected-label">{roleConfig.label}</span>
								<ChevronDown className="login-role-chevron" size={17} />
							</button>
							{isRoleMenuOpen && (
								<div className="login-role-options" id="login-role-options" role="listbox" aria-labelledby="login-role-label">
									{LOGIN_ROLES.map((role, index) => {
										const RoleIcon = roleIcons[role.value];
										const isSelected = role.value === selectedRole;
										return (
											<button
												aria-selected={isSelected}
												className={`login-role-option${isSelected ? " is-selected" : ""}${index === activeRoleIndex ? " is-active" : ""}`}
												id={`login-role-option-${role.value}`}
												key={role.value}
												onClick={() => chooseRole(role.value)}
												onMouseEnter={() => setActiveRoleIndex(index)}
												role="option"
												tabIndex={-1}
												type="button"
											>
												<span className={`login-role-choice-icon is-${role.value}`}><RoleIcon size={17} /></span>
												<span className="login-role-option-copy"><strong>{role.label}</strong><small>{role.idLabel}</small></span>
												{isSelected && <Check className="login-role-check" size={17} />}
											</button>
										);
									})}
								</div>
							)}
						</div>
						<p className={`login-role-note${roleConfig.demoSupported ? " is-supported" : ""}`}>
							{roleConfig.demoSupported
								? "Development-only frontend demo. Backend authorization is required for production."
								: `${roleConfig.label} access is a placeholder; selecting this role does not grant access.`}
						</p>

						<label htmlFor="login-id">{roleConfig.idLabel}</label>
						<div className="login-input-group">
							<input
								id="login-id"
								name="id"
								type="text"
								placeholder={roleConfig.idPlaceholder}
								autoComplete="username"
								required
							/>
						</div>

						<label htmlFor="password">Password</label>
						<div className="login-input-group">
							<input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								autoComplete="current-password"
								required
							/>
							<button
								aria-label={showPassword ? "Hide password" : "Show password"}
								aria-pressed={showPassword}
								className="login-password-toggle"
								onClick={() => setShowPassword((visible) => !visible)}
								type="button"
							>
								{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
							</button>
						</div>

						<button className="login-submit-button" type="submit">Sign In</button>
					</form>

					<p className="login-security-note">Demo only. No credentials are sent or stored.</p>
				</div>
			</section>
		</main>
	);
}
