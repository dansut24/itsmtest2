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
  Select,
  MenuItem,
  Avatar,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  Slide,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = ({ sidebarWidth, collapsedWidth, sidebarOpen, showNavbar, handleSidebarToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchOpen, setSearchOpen] = useState(false);
  const [mode, setMode] = useState("light");
  const [tabHistory, setTabHistory] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState("profile");

  const storedUser = {
    username: "John",
    email: "john.doe@example.com",
    avatar_url: "",
  };

  const goBack = () => {
    if (tabHistory.length > 0) {
      const previousTab = tabHistory.pop();
      setTabHistory([...tabHistory]);
    }
  };

  const handleDrawerOpen = (content) => {
    setDrawerContent(content);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          top: 0,
          left: isMobile ? 0 : `${sidebarOpen ? sidebarWidth : collapsedWidth}px`,
          width: isMobile ? "100%" : `calc(100% - ${sidebarOpen ? sidebarWidth : collapsedWidth}px)`,
          bgcolor: theme.palette.primary.main,
          height: 48,
          transition: "left 0.3s ease, width 0.3s ease, opacity 0.5s, transform 0.5s",
          opacity: showNavbar ? 1 : 0,
          transform: showNavbar ? "translateY(0)" : "translateY(-100%)",
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
                <IconButton size="small" onClick={goBack} sx={{ color: "white" }}>
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
              )}
              <Select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                size="small"
                variant="standard"
                disableUnderline
                sx={{
                  fontSize: "0.75rem",
                  color: "white",
                  mx: 1,
                  ".MuiSelect-icon": { color: "white" },
                }}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System</MenuItem>
                <MenuItem value="ocean">Ocean</MenuItem>
                <MenuItem value="sunset">Sunset</MenuItem>
                <MenuItem value="forest">Forest</MenuItem>
              </Select>
            </>
          )}

          <IconButton size="small" sx={{ color: "white" }} onClick={() => handleDrawerOpen("notifications")}>
            <NotificationsNoneIcon />
          </IconButton>

          <IconButton size="small" sx={{ color: "white" }} onClick={() => handleDrawerOpen("profile")}>
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
              sx={{
                bgcolor: "#ffffff",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: 14,
              }}
            />
          </Box>
        )}
      </AppBar>

      {/* Drawer Content */}
      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 300,
            maxHeight: isMobile ? "60vh" : "100vh",
            borderTopLeftRadius: isMobile ? 16 : 0,
            borderTopRightRadius: isMobile ? 16 : 0,
            p: 2,
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            {drawerContent === "profile" ? "My Profile" : "Notifications"}
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {drawerContent === "profile" ? (
          <Box>
            <Typography variant="body2" gutterBottom>
              <strong>Name:</strong> {storedUser.username}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Email:</strong> {storedUser.email}
            </Typography>
            <List>
              <ListItem button><ListItemText primary="Account Settings" /></ListItem>
              <ListItem button><ListItemText primary="Change Role" /></ListItem>
              <ListItem button><ListItemText primary="Logout" /></ListItem>
            </List>
          </Box>
        ) : (
          <List dense>
            {["System update complete", "New incident assigned", "Password expires soon"].map((note, i) => (
              <ListItem key={i}>
                <ListItemText primary={note} />
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>
    </>
  );
};

export default Navbar;
