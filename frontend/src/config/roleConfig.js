// UI routing metadata only. Production authorization must be enforced by the backend.
export const ROLE_CONFIG = Object.freeze({
	student: Object.freeze({
		label: "Student",
		idLabel: "Student Register Number",
		idPlaceholder: "STU2026001",
		dashboardPath: "/student/dashboard",
		demoSupported: true,
	}),
	faculty: Object.freeze({
		label: "Faculty",
		idLabel: "Faculty ID",
		idPlaceholder: "FAC2026001",
		dashboardPath: "/faculty/dashboard",
		demoSupported: true,
	}),
	admin: Object.freeze({
		label: "Super Admin",
		idLabel: "Admin ID",
		idPlaceholder: "ADMIN001",
		dashboardPath: "/dashboard",
		demoSupported: true,
	}),
	collegeAdmin: Object.freeze({
		label: "College Admin",
		idLabel: "Admin ID",
		idPlaceholder: "COLLEGE001",
		dashboardPath: "/college-admin/dashboard",
		demoSupported: true,
	}),
	otherStaff: Object.freeze({
		label: "Other Staff",
		idLabel: "Staff ID",
		idPlaceholder: "STAFF001",
		dashboardPath: "/staff/dashboard",
		demoSupported: true,
	}),
});

export const LOGIN_ROLES = Object.entries(ROLE_CONFIG).map(([value, config]) => ({ value, ...config }));