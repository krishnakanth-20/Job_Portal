
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SeekerDashboard from "./pages/SeekerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Jobs from "./pages/Jobs";
import CreateJob from "./pages/CreateJob";
import ManageJobs from "./pages/ManageJobs";
import JobDetails from "./pages/JobDetails";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === "recruiter" ? "/recruiter-dashboard" : "/seeker-dashboard"} replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/seeker-dashboard"
          element={
            <ProtectedRoute allowedRole="seeker">
              <SeekerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRole="seeker">
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-job"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-jobs"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <ManageJobs />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
  }
/>
    </BrowserRouter>
  );
}
