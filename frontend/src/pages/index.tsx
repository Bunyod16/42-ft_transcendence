import React from "react";

import DefaultLayout from "@/components/layout/DefaultLayout";
import useUserStore from "@/store/userStore";
import Lobby from "@/components/Lobby";
import Game from "@/components/game/Game";

export default function Home() {
  const { isLoggedIn, state } = useUserStore();
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return <></>;

  return (
    <>
      {state == "InGame" ? (
        <Game />
      ) : (
        <DefaultLayout>
          {isLoggedIn ? <Lobby /> : <div>Loading...</div>}
        </DefaultLayout>
      )}
    </>
  );
}

// move game and lobby to render here
