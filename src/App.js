// App.js — with mobile overflow fix

import React from "react";
import { CssBaseline, Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import ServiceRequests from "./pages/ServiceRequests";
import Changes from './pages/Changes';
import Problems from './pages/Problems';
import Assets from './pages/Assets';
import KnowledgeBase from './pages/KnowledgeBase';
import Reports from './pages/Reports';
import Approvals from './pages/Approvals';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';



function App() {
  return (
    <Router>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          overflowX: "hidden", // Prevent horizontal scroll
        }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/service-requests" element={<ServiceRequests />} />
            <Route path="changes" element={<Changes />} />
    <Route path="problems" element={<Problems />} />
    <Route path="assets" element={<Assets />} />
    <Route path="knowledge-base" element={<KnowledgeBase />} />
    <Route path="reports" element={<Reports />} />
    <Route path="approvals" element={<Approvals />} />
    <Route path="profile" element={<UserProfile />} />
    <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
