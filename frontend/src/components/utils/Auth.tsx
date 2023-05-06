import useUserStore from "@/store/userStore";
import React, { ReactElement, useState } from "react";
import axios from "axios";
import { socket } from "@/components/socket/socket";
import Login from "@/pages/login";
import PickUsername from "@/pages/pickusername";
import Loading from "./Loading";
import { toast } from "react-hot-toast";
import { Box } from "@mui/material";
import TwoFactorAuthPage from "@/pages/two-factor-auth";

export default function Auth({ children }: { children: ReactElement }) {
  const { isLoggedIn, isAuthenticated, logout, login, authenticate, nickName } =
    useUserStore();
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    function refreshToken() {
      axios
        .get("auth/refresh")
        .then(() => {
          console.log("refreshed token");
          toast("Try login again!");
        })
        .catch(() => {
          console.log("cannot refresh");
          socket.disconnect();
          logout();
        });
    }

    // if (isLoggedIn) return;
    axios
      .get("auth/profile")
      .then((res) => {
        console.log(`IS LOGGED IN ${isLoggedIn}`);
        authenticate(res.data.isAuthenticated);
        if (isLoggedIn) return;
        login(res.data.nickName, res.data.id, res.data.avatar);
        console.log(`user authenticated ${res.data.isAuthenticated}`);
        socket.connect();
      })
      .catch((err) => {
        // try refresh token
        if (err.code === "ERR_NETWORK") {
          console.log("here?");
          setError(`${err.code} | The server is down. Try again later...`);
          return;
        }
        console.log("auth/profile");
        console.log("READ THIS", err);
        refreshToken();
      })
      .finally(() => setIsHydrated(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error)
    return (
      <Box component="div" sx={{ height: "100vh" }}>
        <Loading description={error} />;
      </Box>
    );

  if (!isHydrated) return <Loading />;
  console.log(`user authenticated 2fa ${isAuthenticated}`);
  return (
    <>
      {/* <Toaster /> */}
      {nickName == null ? (
        <PickUsername />
      ) : !isAuthenticated ? (
        <TwoFactorAuthPage />
      ) : isLoggedIn ? (
        children
      ) : (
        <Login />
      )}
    </>
  );
}
