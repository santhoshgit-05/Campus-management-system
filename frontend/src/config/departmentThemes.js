const departmentAliases = Object.freeze({
	cse: "cse",
	"computer science": "cse",
	"computer science engineering": "cse",
	"computer science and engineering": "cse",
	it: "it",
	"information technology": "it",
	ece: "electronics",
	electronics: "electronics",
	"electronics communication": "electronics",
	"electronics and communication": "electronics",
	"electronics communications": "electronics",
	"electronics and communications": "electronics",
	eee: "electrical",
	electrical: "electrical",
	"electrical engineering": "electrical",
	mechanical: "mechanical",
	"mechanical engineering": "mechanical",
	civil: "civil",
	"civil engineering": "civil",
});

export const DEPARTMENT_THEMES = Object.freeze({
	cse: Object.freeze({ label: "Computer Science", light: ["#15803D", "#166534", "rgba(21, 128, 61, 0.12)", "rgba(21, 128, 61, 0.32)"], dark: ["#22C55E", "#4ADE80", "rgba(34, 197, 94, 0.14)", "rgba(34, 197, 94, 0.42)"] }),
	it: Object.freeze({ label: "Information Technology", light: ["#BE185D", "#9D174D", "rgba(190, 24, 93, 0.11)", "rgba(190, 24, 93, 0.3)"], dark: ["#EC4899", "#F472B6", "rgba(236, 72, 153, 0.14)", "rgba(236, 72, 153, 0.4)"] }),
	electronics: Object.freeze({ label: "Electronics", light: ["#6D28D9", "#5B21B6", "rgba(109, 40, 217, 0.11)", "rgba(109, 40, 217, 0.3)"], dark: ["#8B5CF6", "#A78BFA", "rgba(139, 92, 246, 0.15)", "rgba(139, 92, 246, 0.42)"] }),
	electrical: Object.freeze({ label: "Electrical", light: ["#B45309", "#92400E", "rgba(180, 83, 9, 0.12)", "rgba(180, 83, 9, 0.32)"], dark: ["#F59E0B", "#FBBF24", "rgba(245, 158, 11, 0.14)", "rgba(245, 158, 11, 0.42)"] }),
	mechanical: Object.freeze({ label: "Mechanical", light: ["#C2410C", "#9A3412", "rgba(194, 65, 12, 0.12)", "rgba(194, 65, 12, 0.32)"], dark: ["#F97316", "#FB923C", "rgba(249, 115, 22, 0.14)", "rgba(249, 115, 22, 0.42)"] }),
	civil: Object.freeze({ label: "Civil", light: ["#0F766E", "#115E59", "rgba(15, 118, 110, 0.12)", "rgba(15, 118, 110, 0.32)"], dark: ["#14B8A6", "#2DD4BF", "rgba(20, 184, 166, 0.14)", "rgba(20, 184, 166, 0.42)"] }),
	other: Object.freeze({ label: "Other / Unknown", light: ["#2563EB", "#1D4ED8", "rgba(37, 99, 235, 0.11)", "rgba(37, 99, 235, 0.32)"], dark: ["#3B82F6", "#60A5FA", "rgba(59, 130, 246, 0.14)", "rgba(59, 130, 246, 0.42)"] }),
});

export const ROLE_THEMES = Object.freeze({
	admin: Object.freeze({ key: "admin", label: "Administration", light: ["#6D4BD1", "#5B3BB8", "rgba(109, 75, 209, 0.12)", "rgba(109, 75, 209, 0.32)"], dark: ["#8B7CFF", "#A99CFF", "rgba(139, 124, 255, 0.15)", "rgba(139, 124, 255, 0.42)"] }),
	collegeAdmin: Object.freeze({ key: "college-admin", label: "College Administration", light: ["#0F766E", "#115E59", "rgba(15, 118, 110, 0.12)", "rgba(15, 118, 110, 0.32)"], dark: ["#2DD4BF", "#5EEAD4", "rgba(45, 212, 191, 0.14)", "rgba(45, 212, 191, 0.42)"] }),
	otherStaff: Object.freeze({ key: "other-staff", label: "Campus Services", light: ["#0E7490", "#155E75", "rgba(14, 116, 144, 0.12)", "rgba(14, 116, 144, 0.32)"], dark: ["#22D3EE", "#67E8F9", "rgba(34, 211, 238, 0.13)", "rgba(34, 211, 238, 0.4)"] }),
	faculty: Object.freeze({ key: "faculty", label: "Faculty", light: ["#0F766E", "#115E59", "rgba(15, 118, 110, 0.12)", "rgba(15, 118, 110, 0.32)"], dark: ["#2DD4BF", "#5EEAD4", "rgba(45, 212, 191, 0.14)", "rgba(45, 212, 191, 0.42)"] }),
});

const subjectThemeKeys = Object.freeze({
	algorithms: "logic",
	"algorithms lab": "logic",
	"data structures": "data",
});

export function resolveSubjectTheme(subject) {
	const normalized = normalizeDepartmentName(subject);
	return subjectThemeKeys[normalized] ?? "neutral";
}

export function normalizeDepartmentName(department) {
	return String(department ?? "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

export function resolveDepartmentTheme(department) {
	const normalized = normalizeDepartmentName(department);
	const key = departmentAliases[normalized] ?? "other";
	return { key, ...DEPARTMENT_THEMES[key] };
}

export function resolveRoleTheme(role) {
	return ROLE_THEMES[role] ?? { key: "other", ...DEPARTMENT_THEMES.other };
}