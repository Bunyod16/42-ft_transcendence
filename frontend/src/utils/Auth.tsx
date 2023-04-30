import useUserStore from "@/store/userStore";
import React, { ReactElement } from "react";
import axios from "axios";
import { socket } from "@/components/socket/socket";
import Login from "@/pages/login";
import PickUsername from "@/pages/pickusername";
import Loading from "./Loading";

export default function Auth({ children }: { children: ReactElement }) {
  const { isLoggedIn, logout, login, nickName } = useUserStore();
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  React.useEffect(() => {
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
          console.log("not log in ");
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
  }, [isLoggedIn]);

  if (!isHydrated) return <Loading />;

  return (
    <>
      {nickName == null ? <PickUsername /> : isLoggedIn ? children : <Login />}
    </>
  );
}
