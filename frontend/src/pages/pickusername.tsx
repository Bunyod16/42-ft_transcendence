import { Container } from "@mui/material";
import PickUsernamePanel from "@/components/PickUsername";

export default function PickUsername() {
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
      <PickUsernamePanel />
    </Container>
  );
}
