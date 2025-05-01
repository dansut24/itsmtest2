import CloseIcon from "@mui/icons-material/Close";
import { Tab, Tabs, Box, IconButton } from "@mui/material";

const AppsBar = ({ tabs, tabIndex, handleTabChange, handleTabClose }) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 48, // ⬅️ This should be the height of your Navbar
        zIndex: (theme) => theme.zIndex.appBar - 1,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ minHeight: 32, height: 32 }}
      >
        {tabs.map((tab, i) => (
          <Tab
            key={tab.path}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {tab.label}
                {tab.path !== "/dashboard" && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // prevents tab switch
                      handleTabClose(tab.path);
                    }}
                    size="small"
                    sx={{ ml: 0.5 }}
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
              px: 1,
              textTransform: "none",
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default AppsBar;
