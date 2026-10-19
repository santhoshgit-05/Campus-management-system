import { createContext, useContext, useLayoutEffect, useState } from "react";
import { DEMO_STUDENT_PROFILES } from "../config/demoProfiles.js";
import { resolveDepartmentTheme, resolveRoleTheme } from "../config/departmentThemes.js";
import { useAuth } from "./AuthContext.jsx";

const THEME_STORAGE_KEY = "cms-theme-mode";
const ThemeContext = createContext(null);

function getInitialThemeMode() {
	try {
		const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
		if (savedMode === "dark" || savedMode === "light") return savedMode;
	} catch {
		// Fall back to the device preference when storage is unavailable.
	}

	return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }) {
	const { user } = useAuth();
	const [mode, setModeState] = useState(getInitialThemeMode);
	const [previewRole, setPreviewRole] = useState("admin");
	const role = user?.role ?? previewRole;
	const studentProfile = role === "student" ? DEMO_STUDENT_PROFILES[user?.id] : null;
	const accentTheme = role === "student"
		? resolveDepartmentTheme(studentProfile?.department)
		: resolveRoleTheme(role);

	function setMode(nextMode) {
		if (nextMode !== "dark" && nextMode !== "light") return;
		setModeState(nextMode);
		try {
			window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
		} catch {
			// The current page still updates when storage is unavailable.
		}
	}

	function toggleMode() {
		setMode(mode === "dark" ? "light" : "dark");
	}

	useLayoutEffect(() => {
		const root = document.documentElement;
		const [accent, hover, soft, focus] = accentTheme[mode];
		root.dataset.theme = mode;
		root.dataset.role = role;
		root.dataset.accent = accentTheme.key;
		if (studentProfile?.department) root.dataset.department = accentTheme.key;
		else delete root.dataset.department;
		root.style.setProperty("--accent", accent);
		root.style.setProperty("--accent-hover", hover);
		root.style.setProperty("--accent-soft", soft);
		root.style.setProperty("--focus-ring", focus);
	}, [accentTheme, mode, role, studentProfile]);

	return (
		<ThemeContext.Provider value={{ mode, setMode, toggleMode, setPreviewRole, departmentTheme: studentProfile?.department ?? null, accentTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const theme = useContext(ThemeContext);
	if (!theme) throw new Error("useTheme must be used inside ThemeProvider");
	return theme;
}