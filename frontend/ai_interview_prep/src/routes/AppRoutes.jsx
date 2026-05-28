// src/routes/AppRoutes.jsx

import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";

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

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* INTERVIEW */}
      <Route
        path="/interview/history"
        element={
          <ProtectedRoute>
            <SessionHistoryPage />
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
        path="/interview/details/:sessionId"
        element={
          <ProtectedRoute>
            <SessionDetailPage />
          </ProtectedRoute>
        }
      />

      {/* RESUME */}
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

      {/* ANALYTICS */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      {/* DEFAULT */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;