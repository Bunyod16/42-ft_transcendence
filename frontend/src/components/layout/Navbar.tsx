import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useUserStore from "@/store/userStore";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";
import { SxProps } from "@mui/material";
import { socket } from "../socket/socket";

export default function Navbar({ sx }: { sx: SxProps }) {
  const { name, isLoggedIn, logout, login } = useUserStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleLogout = () => {
    axios
      .post("/auth/log-out")
      .then()
      .catch((err) => console.log(err));
    logout();
  };

  if (!isHydrated) return <></>;

  return (
    <Box component={"div"} sx={{ ...sx }}>
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
              <Avatar src="/jakoh_smol.jpg" variant="rounded" />
            </Button>
            <IconButton>
              <SettingsIcon />
            </IconButton>
            <IconButton onClick={handleLogout}>
              <LogoutSharpIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
