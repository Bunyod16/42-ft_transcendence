import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useUserStore from "@/store/userStore";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";
import { socket } from "../socket/socket";

export default function Navbar() {
  const { name, isLoggedIn, logout, login } = useUserStore();
  const router = useRouter();

  const handleLogout = () => {
    axios
      .post("/auth/log-out")
      .then()
      .catch((err) => console.log(err));
    logout();
  };

  React.useEffect(() => {
    // login("not login");

    function refreshToken() {
      axios
        .get("auth/refresh")
        .then(() => {
          console.log("refreshed token");
          axios.get("auth/profile").then((res) => {
            login(res.data.nickName);
            socket.connect();
          });
        })
        .catch(() => {
          socket.disconnect();
          logout();
          router.push("/login");
        });
    }

    if (!isLoggedIn) {
      axios
        .get("auth/profile")
        .then((res) => {
          login(res.data.nickName);
          socket.connect();
        })
        .catch(() => {
          refreshToken();
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoggedIn) return <></>;
  return (
    <Box component={"div"} sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "accent.main" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: "typography.oswald",
              fontWeight: 500,
            }}
          >
            RGM PONG
          </Typography>
          <div>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                width: "200px",
                mr: 2,
              }}
              onClick={() => router.push("/profile")}
            >
              <Typography sx={{ flexGrow: 1, textAlign: "left" }}>
                {name}
              </Typography>
              <Avatar src="" variant="rounded" />
            </Button>
            <IconButton onClick={handleLogout}>
              <LogoutSharpIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
