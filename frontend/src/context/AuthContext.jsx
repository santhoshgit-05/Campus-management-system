import { createContext, useContext, useState } from "react";
import { ROLE_CONFIG } from "../config/roleConfig.js";

export const DEMO_CREDENTIALS = Object.freeze({
	admin: Object.freeze({ id: "ADMIN001", password: "Admin123!" }),
	student: Object.freeze({ id: "STU2026001", password: "Student123!" }),
	faculty: Object.freeze({ id: "FAC2026001", password: "Faculty123!" }),
	collegeAdmin: Object.freeze({ id: "COLLEGE001", password: "College123!" }),
	otherStaff: Object.freeze({ id: "STAFF001", password: "Staff123!" }),
});

const SESSION_KEY = "cms-demo-user";
const AuthContext = createContext(null);

function readSessionUser() {
	try {
		const saved = window.sessionStorage.getItem(SESSION_KEY);
		if (!saved) return null;
		const user = JSON.parse(saved);
		const expectedAccount = DEMO_CREDENTIALS[user.role];
		return expectedAccount && user.id === expectedAccount.id
			? { role: user.role, id: user.id }
			: null;
	} catch {
		return null;
	}
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState(readSessionUser);

	function login(role, id, password) {
		const credentials = DEMO_CREDENTIALS[role];
		const credentialsAreValid = credentials &&
			id.trim().toUpperCase() === credentials.id &&
			password === credentials.password;

		if (!credentialsAreValid || !ROLE_CONFIG[role]) return false;

		const nextUser = { role, id: credentials.id };
		try {
			window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
		} catch {
			// Keep the demo usable if browser storage is unavailable.
		}
		setUser(nextUser);

		return true;
	}

	function logout() {
		try {
			window.sessionStorage.removeItem(SESSION_KEY);
		} catch {
			// The in-memory session is still cleared below.
		}
		setUser(null);
	}

	return (
		<AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const auth = useContext(AuthContext);

	if (!auth) {
		throw new Error("useAuth must be used inside AuthProvider");
	}

	return auth;
}
