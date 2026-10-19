import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import "./ThemeToggle.css";

export default function ThemeToggle({ className = "" }) {
	const { mode, toggleMode } = useTheme();
	const isDark = mode === "dark";

	return (
		<button
			aria-checked={isDark}
			aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
			className={`theme-switch ${className}`.trim()}
			onClick={toggleMode}
			role="switch"
			type="button"
		>
			<span className="theme-switch-icon is-sun" aria-hidden="true"><Sun size={13} /></span>
			<span className="theme-switch-track" aria-hidden="true"><span className="theme-switch-thumb">{isDark ? <Moon size={12} /> : <Sun size={12} />}</span></span>
			<span className="theme-switch-icon is-moon" aria-hidden="true"><Moon size={13} /></span>
		</button>
	);
}