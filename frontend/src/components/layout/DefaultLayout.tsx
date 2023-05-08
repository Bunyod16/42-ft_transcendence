import { Box } from "@mui/material";
import Navbar from "./Navbar";
import SidePanel from "../SidePanel";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { socket, chatSocket } from "../socket/socket";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

interface IDefaultLayoutProps {
  children?: React.ReactNode;
}

function DefaultLayout({ children }: IDefaultLayoutProps) {
  const ref = useRef<HTMLDivElement>();
  const router = useRouter();
  useEffect(() => {
    console.log("mounted!!");

    return () => {
      console.log("un- mounted!!");
    };
  }, []);

  return (
    <Box
      ref={ref}
      component={"div"}
      sx={{
        height: "100vh",
        width: "100vw",
        maxWidth: "100vw",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {router.pathname !== "/game" && <SidePanel />}
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
        {router.pathname !== "/game" && <Navbar sx={{}} />}
        {children}
      </Box>

      <Scene
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          display: router.pathname === "/game" ? "block" : "none",
        }}
        // orthographic
        shadows
        eventSource={ref}
        eventPrefix="client"
        camera={{
          position: [0, -4, 2],
          rotation: [Math.PI / 2, 0, 0],
          // zoom: 200,
          // fov: 45,
          near: 0.1,
          far: 1000,
        }}
      />
    </Box>
  );
}

export default DefaultLayout;
