import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // Hide navbar if no user is logged in

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page
  };

  return (
    <AppBar 
      position="fixed" // ✅ Set to fixed so it stays on scroll
      sx={{
        top: 0, 
        zIndex: 1100, // Ensure it stays above other elements
        bgcolor: "#1976d2", // Keep it visible with a background color
      }}
    >
      <Toolbar>
        {/* Logo that redirects to relevant dashboard */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          component={Link}
          to={user.roles.includes("Admin") ? "/admin-dashboard" : "/user-dashboard"}
        >
          IT Helpdesk
        </Typography>

        {/* Navigation Links */}
        <Box>
          <Button component={Link} to="/incidents" color="inherit">
            Incidents
          </Button>
          <Button component={Link} to="/service-requests" color="inherit">
            Service Requests
          </Button>

        {/* ✅ Changes (Visible Only to Admin) */}
        {user.roles.includes("Admin") && (
          <Button component={Link} to="/changes" color="inherit">
            Changes
            </Button>
        )}

          {/* ✅ Knowledge Base (Visible Only to Users) */}
        {user.roles.includes("User") && (
          <Button component={Link} to="/knowledge-base" color="inherit">
            Knowledge Base
            </Button>
        )}



          <Button component={Link} to="/profile" color="inherit">
            Profile
          </Button>
          {/* Admin-only settings option */}
            {user.roles.includes("Admin") && (
          <Button component={Link} to="/settings" color="inherit">
            Settings
        </Button>
)}

        </Box>

        {/* Logout Button */}
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
