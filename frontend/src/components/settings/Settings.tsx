import { Box, Button, Typography, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AvatarSettings from "./AvatarSettings";
import UsernameSettings from "./UsernameSettings";
import TwoFactorSettings from "./TwoFactorSettings";

export default function Settings() {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

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
        padding: "20px 20px 20px 20px",
        backgroundColor: "primary.100",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <ArrowBackIcon sx={{ width: "30px", height: "30px" }}></ArrowBackIcon>
        <Typography
          variant="h2"
          sx={{
            color: "text.secondary",
            fontSize: "1.5em",
            fontWeight: "500",
            textTransform: "uppercase",
            marginLeft: "15px",
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
        }}
      />
    </Box>
  );
}
