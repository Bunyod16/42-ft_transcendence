import * as React from "react";

import Game from "@/components/game/Game";
import DefaultLayout from "@/components/layout/DefaultLayout";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";

export default function Home() {
  const { isLoggedIn } = useUserStore();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoggedIn === false) router.push("/login");
  });
  return (
    <DefaultLayout>
      {isLoggedIn && (
        // {/* <Game /> */}
        <Typography>Welcome to RGM</Typography>
      )}
    </DefaultLayout>
  );
}
