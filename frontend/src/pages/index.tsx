import React from "react";

import useUserStore from "@/store/userStore";
import axios from "axios";
import { socket } from "@/components/socket/socket";
import Login from "./login";
import Lobby from "@/components/Lobby";
import PickUsername from "./pickusername";

export default function Home() {
  const { isLoggedIn, nickName, logout, login } = useUserStore();
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);
  React.useEffect(() => {
    // login("not login");

    function refreshToken() {
      axios
        .get("auth/refresh")
        .then(() => {
          console.log("refreshed token");
          axios.get("auth/profile").then((res) => {
            login(res.data.nickName, res.data.id);
            socket.connect();
          });
        })
        .catch(() => {
          socket.disconnect();
          logout();
        });
    }

    axios
      .get("auth/profile")
      .then((res) => {
        console.log(res.data);
        login(res.data.nickName, res.data.id);
        console.log("user authenticated");
        socket.connect();
      })
      .catch(() => {
        refreshToken();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log(isLoggedIn);
  }, [isLoggedIn]);

  React.useEffect(() => {
    function onConnect() {
      console.log("Socket connected....");
      socket.emit("authenticateUser");
    }

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  if (!isHydrated) return <></>;
  return (
    <>
      {nickName == null ? <PickUsername /> : isLoggedIn ? <Lobby /> : <Login />}
    </>
  );
}
