// AppsBar.js — dynamic tabs with closable functionality

import React from "react";
import { Box, Tabs, Tab, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AppsBar = ({ tabs, tabIndex, handleTabChange, handleTabClose }) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        bgcolor: "background.paper",
        zIndex: (theme) => theme.zIndex.appBar,
        borderColor: "divider",
        width: "100%",
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ minHeight: 32, height: 32 }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={tab.path}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {tab.label}
                {tab.path !== "/dashboard" && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTabClose(tab.path);
                    }}
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            }
            sx={{
              minHeight: 32,
              height: 32,
              fontSize: 12,
              px: 1.5,
              textTransform: "none",
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default AppsBar;
