import { Box } from "@mui/material";
import React from "react";
import Navbar from "./Navbar";
import useUserStore from "@/store/userStore";

interface IDefaultLayoutProps {
  children: React.ReactNode;
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
        display: view != "Game" ? "flex" : "none",
        flexDirection: "column",
      }}
    >
      {/* sidepanel */}
      <Navbar />
      <Box component={"div"} sx={{ height: "100%", width: "100%", p: 4 }}>
        {children}
      </Box>
    </Box>
  );
}

export default DefaultLayout;
