import { Box, Typography } from "@mui/material";
import React from "react";
import Navbar from "./Navbar";
import SidePanel from "../SidePanel";

interface IDefaultLayoutProps {
  children?: React.ReactNode;
}

// ! side panel should add to here too
function DefaultLayout({ children }: IDefaultLayoutProps) {
  return (
    <Box
      component={"div"}
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* sidepanel */}
      <SidePanel sx={{ overflow: "hidden" }} />
      <Box component={"div"} sx={{ width: "100%", height: "100%" }}>
        <Navbar sx={{}} />
        <Typography>You have logged in</Typography>
      </Box>
    </Box>
  );
}

export default DefaultLayout;
