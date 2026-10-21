
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import RolePortalLayout from "./layouts/RolePortalLayout.jsx";
import Login from "./pages/auth/Login.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ModulePage from "./pages/admin/ModulePage.jsx";
import Students from "./pages/students/Students.jsx";
import Faculty from "./pages/faculty/Faculty.jsx";
import Departments from "./pages/departments/Departments.jsx";
import StudentAttendance from "./pages/attendance/StudentAttendance.jsx";
import FacultyAttendance from "./pages/attendance/FacultyAttendance.jsx";
import AttendanceReports from "./pages/attendance/AttendanceReports.jsx";
import LeaveManagement from "./pages/leave/LeaveManagement.jsx";
import Timetable from "./pages/timetable/Timetable.jsx";
import ExamTimetable from "./pages/examinations/ExamTimetable.jsx";
import Results from "./pages/examinations/Results.jsx";
import Fees from "./pages/fees/Fees.jsx";
import HostelDashboard from "./pages/hostel/HostelDashboard.jsx";
import FindMyBus from "./pages/transport/FindMyBus.jsx";
import Events from "./pages/events/Events.jsx";
import CanteenMenu from "./pages/canteen/CanteenMenu.jsx";
import Notifications from "./pages/notifications/Notifications.jsx";
import StudentDashboard from "./pages/students/StudentDashboard.jsx";
import FacultyDashboard from "./pages/faculty/FacultyDashboard.jsx";
import RoleLanding from "./pages/portals/RoleLanding.jsx";

const moduleRoutes = [
  ["departments", "departments"],
  ["subjects", "subjects"],
  ["timetable", "timetable"],
  ["attendance", "attendance"],
  ["leave", "leave"],
  ["transport/find-my-bus", "transport"],
  ["hostel", "hostel"],
  ["canteen", "canteen"],
  ["examinations", "examinations"],
  ["events", "events"],
  ["fees", "fees"],
  ["library", "library"],
  ["placements", "placements"],
  ["complaints", "complaints"],
  ["notifications", "notifications"],
  ["reports", "reports"],
  ["settings", "settings"],
];

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<AdminDashboard />} />
<Route path="/students" element={<Students />} />
<Route path="/faculty" element={<Faculty />} />
<Route path="/departments" element={<Departments />} />
<Route path="/attendance" element={<StudentAttendance />} />
<Route path="/faculty-attendance" element={<FacultyAttendance />} />
<Route path="/attendance-reports" element={<AttendanceReports />} />
<Route path="/leave" element={<LeaveManagement />} />
<Route path="/timetable" element={<Timetable />} />
<Route path="/examinations" element={<ExamTimetable />} />
<Route path="/results" element={<Results />} />
<Route path="/fees" element={<Fees />} />
<Route path="/hostel" element={<HostelDashboard />} />
<Route path="/transport/find-my-bus" element={<FindMyBus />} />
<Route path="/events" element={<Events />} />
<Route path="/canteen" element={<CanteenMenu />} />
<Route path="/notifications" element={<Notifications />} />
            {moduleRoutes.map(([path, moduleKey]) => (
              <Route
                element={<ModulePage moduleKey={moduleKey} />}
                key={path}
                path={`/${path}`}
              />
            ))}
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["student"]}><RolePortalLayout role="student" /></ProtectedRoute>}>
            <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["faculty"]}><RolePortalLayout role="faculty" /></ProtectedRoute>}>
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["collegeAdmin"]}><RolePortalLayout role="collegeAdmin" /></ProtectedRoute>}>
            <Route path="/college-admin/dashboard" element={<RoleLanding role="collegeAdmin" />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["otherStaff"]}><RolePortalLayout role="otherStaff" /></ProtectedRoute>}>
            <Route path="/staff/dashboard" element={<RoleLanding role="otherStaff" />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
