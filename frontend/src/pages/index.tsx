import React from "react";

import Game from "@/components/game/Game";
import DefaultLayout from "@/components/layout/DefaultLayout";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/router";
import { Button, Typography } from "@mui/material";

export default function Home() {
  const { isLoggedIn } = useUserStore();
  const router = useRouter();
  // const [pushCalled, setPushCalled] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    if (isLoggedIn === false) {
      router.push("/login");
    }
  }, []);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <DefaultLayout>
      {isLoggedIn && isHydrated && (
        // {/* <Game /> */}
        <>
          <Typography>Welcome to RGM</Typography>
          <Button variant="contained" onClick={() => router.push("/profile")}>
            Profile
          </Button>
          <Button variant="contained" onClick={() => router.push("/side")}>
            Side
          </Button>
        </>
      )}
    </DefaultLayout>
  );
}
