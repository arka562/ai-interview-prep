import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import SessionPage from "../pages/interview/SessionPage.jsx";
import SessionHistoryPage from "../pages/interview/SessionHistoryPage.jsx";
import SessionDetailPage from "../pages/interview/SessionDetailPage.jsx";
import ResumeUploadPage from "../pages/resume/ResumeUploadPage.jsx";
import ResumeProfilePage from "../pages/resume/ResumeProfilePage.jsx";
import AnalyticsPage from "../pages/analytics/AnalyticsPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/session/:sessionId"
        element={
          <ProtectedRoute>
            <SessionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/history"
        element={
          <ProtectedRoute>
            <SessionHistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/history/:sessionId"
        element={
          <ProtectedRoute>
            <SessionDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume/upload"
        element={
          <ProtectedRoute>
            <ResumeUploadPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume/:sessionId"
        element={
          <ProtectedRoute>
            <ResumeProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;