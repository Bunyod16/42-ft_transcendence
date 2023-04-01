import { Box, Button, Typography } from "@mui/material";

export default function LoginPanel() {
  return (
    <Box
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
    </Box>
  );
}
