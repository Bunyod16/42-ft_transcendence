import { Box } from "@mui/material";
import React from "react";
import Navbar from "./Navbar";
import useUserStore from "@/store/userStore";
import SidePanel from "../SidePanel";

interface IDefaultLayoutProps {
  children?: React.ReactNode;
}

// ! side panel should add to here too
function DefaultLayout({ children }: IDefaultLayoutProps) {
  const view = useUserStore((state) => state.view);

  return (
    <Box
      component={"div"}
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <SidePanel sx={{ overflow: "hidden" }} />
      <Box
        component={"div"}
        sx={{
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
