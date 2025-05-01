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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = ({
  sidebarWidth,
  collapsedWidth,
  sidebarOpen,
  showNavbar,
  handleSidebarToggle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchOpen, setSearchOpen] = useState(false);
  const [mode, setMode] = useState("light");
  const [tabHistory, setTabHistory] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState("profile"); // 'profile' or 'notifications'

  const [storedUser] = useState({ username: "John", avatar_url: "" });

  const goBack = () => {
    if (tabHistory.length > 0) {
      const previousTab = tabHistory.pop();
      setTabHistory([...tabHistory]);
    }
  };

  const openDrawer = (type) => {
    setDrawerType(type);
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const renderDrawerContent = () => {
    if (drawerType === "profile") {
      return (
        <>
          <Typography variant="h6">Profile</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>Name: {storedUser.username}</Typography>
          <Typography variant="body2">Email: john.doe@example.com</Typography>
          <Typography variant="body2">Role: Admin</Typography>
        </>
      );
    }

    if (drawerType === "notifications") {
      return (
        <>
          <Typography variant="h6">Notifications</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            No new notifications.
          </Typography>
        </>
      );
    }

    return null;
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        left: isMobile ? 0 : `${sidebarOpen ? sidebarWidth : collapsedWidth}px`,
        width: isMobile ? "100%" : `calc(100% - ${sidebarOpen ? sidebarWidth : collapsedWidth}px)`,
        bgcolor: theme.palette.primary.main,
        height: 48,
        zIndex: (theme) => theme.zIndex.drawer + 3, // Ensure on top of other drawers
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

        <IconButton size="small" sx={{ color: "white" }} onClick={() => openDrawer("notifications")}>
          <NotificationsNoneIcon fontSize="small" />
        </IconButton>

        <IconButton size="small" sx={{ color: "white" }} onClick={() => openDrawer("profile")}>
          <Avatar
            src={
              storedUser.avatar_url?.startsWith("http")
                ? storedUser.avatar_url
                : storedUser.avatar_url
                ? `http://localhost:5000${storedUser.avatar_url}`
                : ""
            }
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

      {/* Shared Drawer */}
      <Drawer
  anchor={isMobile ? "bottom" : "right"}
  open={drawerOpen}
  onClose={closeDrawer}
  ModalProps={{
    keepMounted: true,
    hideBackdrop: false,
    sx: {
      zIndex: (theme) => theme.zIndex.modal + 3, // Highest possible layering
    },
  }}
  PaperProps={{
    sx: {
      position: "fixed",
      top: 0,
      right: 0,
      width: isMobile ? "100%" : 320,
      height: "100vh",
      zIndex: (theme) => theme.zIndex.modal + 4,
      backgroundColor: "background.paper",
      p: 2,
      display: "flex",
      flexDirection: "column",
    },
  }}
  BackdropProps={{
    sx: {
      zIndex: (theme) => theme.zIndex.modal + 2,
    },
  }}
>

        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={closeDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        {renderDrawerContent()}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
