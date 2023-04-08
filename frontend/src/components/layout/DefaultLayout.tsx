import { Box } from "@mui/material";
import React from "react";
import Navbar from "./Navbar";

// ! side panel should add to here too
function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component={"div"}
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* sidepanel */}
      <Navbar />
      <Box component={"div"} sx={{ height: "100%", width: "100%" }}>
        {children}
      </Box>
    </Box>
  );
}

export default DefaultLayout;
