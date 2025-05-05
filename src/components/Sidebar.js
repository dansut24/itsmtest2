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
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme } from "@mui/material/styles";

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
          justifyContent: !isMobile && sidebarOpen ? "flex-end" : "center",
          flexShrink: 0,
        }}
      >
        {!isMobile && (
          <IconButton onClick={handleSidebarToggle}>
            {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </Toolbar>

      <Box
        sx={{
          overflowY: "auto",
          flexGrow: 1,
          WebkitOverflowScrolling: "touch",
          pr: 1,
          pb: 4,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          "&::-webkit-scrollbar": {
            width: 0,
            height: 0,
          },
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
                justifyContent: !isMobile && !sidebarOpen ? "center" : "initial",
                "&.Mui-selected": {
                  backgroundColor: theme.palette.action.selected,
                  color: theme.palette.primary.main,
                },
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: !isMobile && sidebarOpen ? 2 : "auto",
                  justifyContent: "center",
                  color: theme.palette.text.primary,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {(sidebarOpen || isMobile) && <ListItemText primary={item.text} />}
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
            backgroundColor: theme.palette.background.paper,
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
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
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
