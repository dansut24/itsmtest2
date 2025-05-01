// AppsBar.js — simplified to single dynamic tab

import React from "react";
import { Box, Tabs, Tab } from "@mui/material";

const AppsBar = ({ tabIndex, handleTabChange, tabs }) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        bgcolor: "background.paper",
        zIndex: (theme) => theme.zIndex.appBar,
        transition: "transform 0.3s ease",
        borderColor: "divider",
        width: "100%",
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
            key={index}
            label={tab.label}
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
