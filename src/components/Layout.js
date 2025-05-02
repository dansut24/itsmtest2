import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import AppsBar from "./AppsBar";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ReportIcon from "@mui/icons-material/Report";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";

const drawerWidth = 240;
const collapsedWidth = 60;

const routeLabels = {
  "/dashboard": "Dashboard",
  "/incidents": "Incidents",
  "/service-requests": "Service Requests",
  "/profile": "Profile",
};

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tabs, setTabs] = useState(() => {
    const stored = sessionStorage.getItem("tabs");
    return stored ? JSON.parse(stored) : [{ label: "Dashboard", path: "/dashboard" }];
  });
  const [tabIndex, setTabIndex] = useState(() => {
    const storedIndex = sessionStorage.getItem("tabIndex");
    return storedIndex ? parseInt(storedIndex, 10) : 0;
  });

  const sidebarWidth = sidebarOpen ? drawerWidth : collapsedWidth;

  useEffect(() => {
    const currentPath = location.pathname;
    const tabExists = tabs.some((tab) => tab.path === currentPath);
    if (!tabExists) {
      const label = routeLabels[currentPath] || "Unknown";
      const newTabs = [...tabs, { label, path: currentPath }];
      setTabs(newTabs);
      setTabIndex(newTabs.length - 1);
    } else {
      const index = tabs.findIndex((tab) => tab.path === currentPath);
      setTabIndex(index);
    }
  }, [location.pathname]);

  useEffect(() => {
    sessionStorage.setItem("tabs", JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    sessionStorage.setItem("tabIndex", tabIndex.toString());
  }, [tabIndex]);

  const handleTabChange = (e, newIndex) => {
    setTabIndex(newIndex);
    navigate(tabs[newIndex].path);
  };

  const handleTabClose = (path) => {
    const newTabs = tabs.filter((t) => t.path !== path);
    setTabs(newTabs);
    if (location.pathname === path) {
      const fallback = newTabs[newTabs.length - 1] || { path: "/dashboard" };
      navigate(fallback.path);
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        mobileOpen={mobileOpen}
        handleSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        handleMobileSidebarToggle={() => setMobileOpen(!mobileOpen)}
        sidebarWidth={sidebarWidth}
        collapsedWidth={collapsedWidth}
        tabIndex={tabIndex}
        menuItems={Object.entries(routeLabels).map(([path, text]) => ({
          text,
          icon:
            text === "Dashboard"
              ? <DashboardIcon />
              : text === "Incidents"
              ? <ReportIcon />
              : text === "Service Requests"
              ? <AssignmentIcon />
              : <PersonIcon />,
        }))}
        handleSidebarTabClick={(index) => navigate(Object.keys(routeLabels)[index])}
        isMobile={isMobile}
      />

      <Box
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : `${sidebarWidth}px`,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Navbar
          sidebarWidth={sidebarWidth}
          showNavbar={true}
          isMobile={isMobile}
          handleMobileSidebarToggle={() => setMobileOpen(!mobileOpen)}
          sidebarOpen={sidebarOpen}
          collapsedWidth={collapsedWidth}
          handleSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <AppsBar
          tabs={tabs}
          tabIndex={tabIndex}
          handleTabChange={handleTabChange}
          handleTabClose={handleTabClose}
        />

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            px: 2,
            pb:20,
          }}
        >
          <MainContent />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
