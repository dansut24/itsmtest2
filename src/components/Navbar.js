import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        zIndex: 1100,
        bgcolor: "#1976d2",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          component={Link}
          to="/dashboard"
        >
          IT Helpdesk
        </Typography>

        <Box>
          <Button component={Link} to="/incidents" color="inherit">
            Incidents
          </Button>
          <Button component={Link} to="/service-requests" color="inherit">
            Service Requests
          </Button>
          <Button component={Link} to="/profile" color="inherit">
            Profile
          </Button>
          <Button component={Link} to="/settings" color="inherit">
            Settings
          </Button>
        </Box>

        <Button color="inherit">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
