// App.js — with session-based auth, loading screen, and mobile overflow fix

import React, { useEffect, useState } from "react";
import { CssBaseline, Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Loading from "./pages/Loading";

import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import ServiceRequests from "./pages/ServiceRequests";
import Changes from "./pages/Changes";
import Problems from "./pages/Problems";
import Assets from "./pages/Assets";
import KnowledgeBase from "./pages/KnowledgeBase";
import Reports from "./pages/Reports";
import Approvals from "./pages/Approvals";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate delay before showing dashboard
    if (sessionStorage.getItem("isLoggedIn") === "true") {
      setTimeout(() => setLoading(false), 1500);
    } else {
      setLoading(false);
    }
  }, []);

  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  return (
    <Router>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/loading"
            element={
              isLoggedIn ? (
                loading ? <Loading /> : <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="service-requests" element={<ServiceRequests />} />
            <Route path="changes" element={<Changes />} />
            <Route path="problems" element={<Problems />} />
            <Route path="assets" element={<Assets />} />
            <Route path="knowledge-base" element={<KnowledgeBase />} />
            <Route path="reports" element={<Reports />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Default fallback route */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
