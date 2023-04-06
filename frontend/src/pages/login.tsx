import { Container } from "@mui/material";
import LoginPanel from "../components/LogInPanel";

export default function Login() {
  return (
    <Container
      maxWidth={false}
      sx={{
        background: "#22333B",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <LoginPanel />
    </Container>
  );
}
