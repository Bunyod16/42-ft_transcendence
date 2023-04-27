import { Box } from "@mui/material";
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
        height: "100vh",
        width: "100vw",
        maxWidth: "100vw",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <SidePanel />
      <Box
        component={"div"}
        sx={{
          // flex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar sx={{}} />
        {children}
      </Box>
    </Box>
  );
}

export default DefaultLayout;
