// AppsBar.js — Tabbed bar component

import React from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AppsBar = ({
  tabs = [],
  selectedTab,
  setSelectedTab,
  closeTab,
  sidebarWidth,
  isMobile,
}) => {
  const renderedTabs = ["Dashboard", ...tabs.filter((t) => t !== "Dashboard")];

  return (
    <Box
      sx={{
        position: "fixed",
        top: 48,
        left: isMobile ? 0 : `${sidebarWidth}px`,
        width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
        display: "flex",
        alignItems: "center",
        height: 44,
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        px: 1,
        zIndex: 1200,
        overflowX: "auto",
        transition: "left 0.3s ease, width 0.3s ease",
        gap: 1,
      }}
    >
      {renderedTabs.map((tab) => (
        <Box
          key={tab}
          sx={{
            px: 2,
            py: 0.5,
            display: "flex",
            alignItems: "center",
            borderRadius: 999,
            height: 32,
            bgcolor:
              selectedTab === tab ? "primary.light" : "action.hover",
            cursor: "pointer",
            whiteSpace: "nowrap",
            fontSize: 14,
          }}
          onClick={() => setSelectedTab(tab)}
        >
          {tab}
          {tab !== "Dashboard" && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab);
              }}
              sx={{ p: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default AppsBar;


