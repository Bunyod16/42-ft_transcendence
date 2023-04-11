import React from "react";

import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/router";

export default function LoginPanel() {
  const { isLoggedIn } = useUserStore();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoggedIn) router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "32px",
        alignItems: "center",
        padding: "40px 20px",
        borderRadius: "12px",
        border: "3px solid #93032E",
        height: "260px",
        width: "600px",
        color: "accent.contrastText",
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontSize: "40px",
          fontWeight: "700",
          lineHeight: "59px",
        }}
      >
        RGM PONG
      </Typography>
      <Link
        href={`${process.env.NEXT_PUBLIC_API_URL}/auth/login`}
        style={{ textDecoration: "none" }}
      >
        <Button
          variant="contained"
          sx={{
            padding: "10px 40px",
            backgroundColor: "accent.main",
            transition: "0.3s",
            "&:hover": { backgroundColor: "accent.hover" },
          }}
        >
          <Typography sx={{ color: "accent.text" }}>LOGIN WITH 42</Typography>
        </Button>
      </Link>
    </Box>
  );
}

// https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ba795300d2f101b0a34682e85deea0ae40535de62c86a512e1823c0d33b26033&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code&scope=public
