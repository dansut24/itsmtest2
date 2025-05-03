import React from "react";
import {
  Box,
  Drawer,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar = ({
  sidebarOpen,
  mobileOpen,
  handleSidebarToggle,
  handleMobileSidebarToggle,
  sidebarWidth,
  tabIndex,
  menuItems,
  handleSidebarTabClick,
  isMobile,
}) => {
  const theme = useTheme();

  const drawerContent = (
    <>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: sidebarOpen ? "flex-end" : "center",
          flexShrink: 0,
        }}
      >
        <IconButton onClick={isMobile ? handleMobileSidebarToggle : handleSidebarToggle}>
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>

      <Box
        sx={{
          overflowY: "auto",
          flexGrow: 1,
          WebkitOverflowScrolling: "touch",
          pr: 1,
          pb: 4,
          "&::-webkit-scrollbar": { width: 0, height: 0 },
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={item.text}
              selected={tabIndex === index}
              onClick={() => handleSidebarTabClick(index)}
              sx={{
                justifyContent: sidebarOpen ? "initial" : "center",
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                bgcolor: tabIndex === index ? theme.palette.action.selected : "transparent",
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: sidebarOpen ? 2 : "auto",
                  justifyContent: "center",
                  color: "text.primary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {sidebarOpen && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ color: "text.primary" }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Box>
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
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
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
        bgcolor: theme.palette.background.default,
        borderRight: `1px solid ${theme.palette.divider}`,
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease",
        zIndex: theme.zIndex.drawer,
        color: theme.palette.text.primary,
      }}
    >
      {drawerContent}
    </Box>
  );
};

export default Sidebar;
