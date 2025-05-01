// App.js with background gradient across the entire site

import React from "react";
import { CssBaseline, Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents"
import ServiceRequests from "./pages/ServiceRequests"

function App() {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/service-requests" element={<ServiceRequests />} />
          </Route>
        </Routes>
  
    </Router>
  );
}

export default App;
