import React from "react";
import { Box, Drawer, Toolbar, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar = ({ sidebarOpen, mobileOpen, handleSidebarToggle, handleMobileSidebarToggle, sidebarWidth, tabIndex, menuItems, handleSidebarTabClick, isMobile, }) => {
  const drawerContent = (
    <>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: sidebarOpen ? "flex-end" : "center",
        }}
      >
        <IconButton onClick={isMobile ? handleMobileSidebarToggle : handleSidebarToggle}>
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>

      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={item.text}
            selected={tabIndex === index}
            onClick={() => handleSidebarTabClick(index)}
            sx={{ justifyContent: sidebarOpen ? "initial" : "center" }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: sidebarOpen ? 2 : "auto",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileSidebarToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: sidebarWidth,
        height: "100vh",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease",
        zIndex: (theme) => theme.zIndex.drawer,
      }}
    >
      {drawerContent}
    </Box>
  );
};

export default Sidebar;
