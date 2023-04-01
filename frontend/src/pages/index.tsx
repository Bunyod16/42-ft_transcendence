import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Material UI - Next.js example in TypeScript
          </Typography>
          <Typography variant="body1">
            This text actually looks huge lol
          </Typography>
          <Stack spacing={2} direction="row">
            <Button variant="contained" color="primary">
              Text
            </Button>
            <Button variant="contained" color="secondary">
              Contained
            </Button>
            <Button variant="contained" color="accent">
              Outlined
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
