import React from "react";

import useUserStore from "@/store/userStore";
import Lobby from "@/components/Lobby";

export default function Home() {
  const { isLoggedIn } = useUserStore();
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return <></>;

  return <>{isLoggedIn ? <Lobby /> : <div>Loading...</div>}</>;
}
