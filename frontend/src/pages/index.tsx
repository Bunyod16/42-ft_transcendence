import React from "react";

import DefaultLayout from "@/components/layout/DefaultLayout";
import useUserStore from "@/store/userStore";
import { Typography } from "@mui/material";
import Lobby from "@/components/Lobby";

export default function Home() {
  const { isLoggedIn } = useUserStore();
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return <></>;

  return (
    <DefaultLayout>
      {isLoggedIn ? <Lobby /> : <div>Loading...</div>}
    </DefaultLayout>
  );
}
