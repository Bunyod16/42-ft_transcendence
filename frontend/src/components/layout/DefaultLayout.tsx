import { Box } from "@mui/material";
import React from "react";

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
        {children}
      </Box>
    </Box>
  );
}

export default DefaultLayout;
