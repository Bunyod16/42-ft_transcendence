import React from "react";

import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

export default function LoginPanel() {
  const router = useRouter();
  return (
    <Box
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        border: "3px solid #93032E",
        // height: "260px",
        maxWidth: "600px",
        width: "100%",
        padding: "40px 32px",
        color: "accent.contrastText",
        bgcolor: "primary.100",
        boxshadow: 2,
      }}
    >
      <Typography>Welcome to</Typography>
      <Typography
        variant="h3"
        padding={2}
        sx={{
          // fontSize: "40px",
          fontWeight: "700",
          // lineHeight: "59px",
        }}
      >
        RGM PONG
      </Typography>
      {/* <Link
        href={`${process.env.NEXT_PUBLIC_API_URL}/auth/login`}
        style={{ textDecoration: "none" }}
      > */}
      <Button
        variant="contained"
        color="accent"
        sx={{
          padding: "10px 40px",
          // textDecoration: "none",
          mt: 4,
          // backgroundColor: "accent.main",
          // transition: "0.3s",
          // "&:hover": { backgroundColor: "accent.hover" },
        }}
        onClick={() => {
          router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`);
          console.log(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`);
        }}
      >
        {/* <Typography sx={{ color: "accent.text" }}>LOGIN WITH 42</Typography> */}
        Login with 42
      </Button>
      {/* </Link> */}
    </Box>
  );
}

// https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ba795300d2f101b0a34682e85deea0ae40535de62c86a512e1823c0d33b26033&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code&scope=public
