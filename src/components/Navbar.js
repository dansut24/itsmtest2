// Navbar.js — responsive full-width with sticky position and mobile-aware layout

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
  Box,
  Tooltip,
  Select,
  MenuItem,
  Avatar,
  Drawer,
  Slide,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = ({ sidebarWidth, collapsedWidth, sidebarOpen, showNavbar, handleSidebarToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchOpen, setSearchOpen] = useState(false);
  const [mode, setMode] = useState("light");
  const [tabHistory, setTabHistory] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [storedUser] = useState({ username: "John", avatar_url: "" });

  const goBack = () => {
    if (tabHistory.length > 0) {
      const previousTab = tabHistory.pop();
      setTabHistory([...tabHistory]);
    }
  };

  const toggleDrawer = (setter) => () => setter((prev) => !prev);

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        left: isMobile ? 0 : `${sidebarOpen ? sidebarWidth : collapsedWidth}px`,
        width: isMobile ? "100%" : `calc(100% - ${sidebarOpen ? sidebarWidth : collapsedWidth}px)`,
        bgcolor: theme.palette.primary.main,
        height: 48,
        zIndex: (theme) => theme.zIndex.drawer + 2,
        transition: "left 0.3s ease, width 0.3s ease",
        pointerEvents: showNavbar ? "auto" : "none",
        borderTopRightRadius: isMobile ? 0 : 12,
        boxSizing: "border-box",
      }}
    >
      <Toolbar variant="dense" sx={{ px: 1, minHeight: 48 }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ flexShrink: 0 }}>
          {isMobile && (
            <IconButton size="small" sx={{ color: "white" }} onClick={handleSidebarToggle}>
              <MenuIcon fontSize="small" />
            </IconButton>
          )}
          <img src="/logo192.png" alt="Logo" style={{ height: 24 }} />
          {!isMobile && (
            <Typography variant="h6" noWrap sx={{ fontSize: 16, color: "#fff" }}>
              Hi5Tech ITSM
            </Typography>
          )}
        </Box>

        <Box flexGrow={1} />

        {isMobile ? (
          <IconButton size="small" sx={{ color: "white" }} onClick={() => setSearchOpen((prev) => !prev)}>
            <SearchIcon fontSize="small" />
          </IconButton>
        ) : (
          <>
            <InputBase
              placeholder="Search…"
              sx={{
                bgcolor: "#ffffff22",
                color: "white",
                px: 1,
                borderRadius: 1,
                fontSize: 14,
                width: 180,
                mr: 1,
              }}
            />
            {tabHistory.length > 0 && (
              <Tooltip title="Go Back">
                <IconButton size="small" onClick={goBack} sx={{ color: "white" }}>
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Theme">
              <Select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                size="small"
                variant="standard"
                disableUnderline
                sx={{ fontSize: "0.75rem", color: "white", mx: 1, ".MuiSelect-icon": { color: "white" } }}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System</MenuItem>
                <MenuItem value="ocean">Ocean</MenuItem>
                <MenuItem value="sunset">Sunset</MenuItem>
                <MenuItem value="forest">Forest</MenuItem>
              </Select>
            </Tooltip>
          </>
        )}

        <IconButton size="small" sx={{ color: "white" }} onClick={toggleDrawer(setNotificationsOpen)}>
          <NotificationsNoneIcon fontSize="small" />
        </IconButton>

        <IconButton size="small" sx={{ color: "white" }} onClick={toggleDrawer(setProfileOpen)}>
          <Avatar
            src={storedUser.avatar_url?.startsWith("http") ? storedUser.avatar_url : storedUser.avatar_url ? `http://localhost:5000${storedUser.avatar_url}` : ""}
            sx={{ width: 28, height: 28 }}
          >
            {storedUser.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
        </IconButton>
      </Toolbar>

      {isMobile && searchOpen && (
        <Box sx={{ px: 2, pb: 1, backgroundColor: theme.palette.primary.main }}>
          <InputBase
            placeholder="Search..."
            fullWidth
            sx={{ bgcolor: "#ffffff", px: 1, py: 0.5, borderRadius: 1, fontSize: 14 }}
          />
        </Box>
      )}

      {/* Drawers */}
      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={profileOpen}
        onClose={toggleDrawer(setProfileOpen)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: isMobile ? "100%" : 280, height: isMobile ? "50%" : "100%", p: 2 } }}
      >
        <Typography variant="h6">Profile</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>Name: {storedUser.username}</Typography>
        <Typography variant="body2">Email: john.doe@example.com</Typography>
        <Typography variant="body2">Role: Admin</Typography>
      </Drawer>

      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={notificationsOpen}
        onClose={toggleDrawer(setNotificationsOpen)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: isMobile ? "100%" : 280, height: isMobile ? "50%" : "100%", p: 2 } }}
      >
        <Typography variant="h6">Notifications</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          No new notifications.
        </Typography>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
