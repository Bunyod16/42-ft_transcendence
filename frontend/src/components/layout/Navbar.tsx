import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import useUserStore from "@/store/userStore";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import axios from "axios";

export default function Navbar() {
  const { name, logout } = useUserStore();
  // const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tmpname, setName] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setAuth(event.target.checked);
    console.log("meow");
  };

  React.useEffect(() => {
    axios
      .get("/auth/profile")
      .then((res) => {
        setName(res.data.nickName);
      })
      .catch((err) => console.log(err));
  });

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    axios
      .post("/auth/log-out")
      .then(() => logout())
      .catch((err) => console.log(err));
  };

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
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.3)", width: "240px" }}
              onClick={handleMenu}
            >
              <Typography sx={{ flexGrow: 1, textAlign: "left" }}>
                {tmpname}
              </Typography>
              <Avatar src="/static/images/avatar/1.jpg" variant="rounded" />
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              // sx={{
              //   "& .MuiPaper-root": {
              //     backgroundColor: "pink",
              //   },
              // }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
