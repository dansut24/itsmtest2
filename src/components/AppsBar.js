// AppsBar.js — dynamic tabs with sticky scroll behavior

import React from "react";
import { Box, Tabs, Tab, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AppsBar = ({ tabIndex, handleTabChange, handleTabClose, tabs }) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 48,
        bgcolor: "background.paper",
        zIndex: (theme) => theme.zIndex.appBar,
        transition: "transform 0.3s ease",
        borderColor: "divider",
        width: "100%",
        display: "flex",
        alignItems: "center",
        overflowX: "auto",
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 32,
          height: 32,
        }}
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
                    sx={{ ml: 0.5, p: 0.25 }}
                  >
                    <CloseIcon sx={{ fontSize: 12 }} />
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
