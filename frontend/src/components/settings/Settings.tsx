import { Box, IconButton, Typography, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AvatarSettings from "./AvatarSettings";
import UsernameSettings from "./UsernameSettings";
import TwoFactorSettings from "./TwoFactorSettings";
import { useRouter } from "next/router";

export default function Settings() {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const router = useRouter();

  const theme = useTheme();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return !isHydrated ? (
    <></>
  ) : (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "10px 50px 10px 50px",
        backgroundColor: "primary.100",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "row",
          marginBottom: "10px",
        }}
      >
        <IconButton
          sx={{
            padding: "0px",
          }}
          onClick={() => {
            router.back();
          }}
        >
          <ArrowBackIcon
            sx={{
              height: "30px",
              width: "30px",
              marginRight: "20px",
              color: "text.primary",
            }}
          />
        </IconButton>
        <Typography
          variant="h2"
          sx={{
            color: "text.secondary",
            fontSize: "1.5em",
            fontWeight: "500",
            textTransform: "uppercase",
          }}
        >
          Settings
        </Typography>
      </Box>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          height: "100%",
        }}
      >
        <AvatarSettings />
        <UsernameSettings />
        <TwoFactorSettings />
      </Box>
      <Toaster
        toastOptions={{
          style: {
            background: "green",
            color: `${theme.palette.text.primary}`,
          },
          success: {
            style: {
              background: "green",
              color: `${theme.palette.text.primary}`,
            },
          },
          error: {
            style: {
              background: `${theme.palette.accent?.main}`,
            },
          },
        }}
      />
    </Box>
  );
}
