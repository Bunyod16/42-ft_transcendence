import { Button, Box, Grid } from "@mui/material";
import { socket } from "./socket/socket";
import React from "react";
import useUserStore from "@/store/userStore";
import useGameStore from "@/store/gameStore";
import { MatchInfo } from "@/types/game-types";
import DefaultLayout from "./layout/DefaultLayout";

const Lobby = () => {
  const updateView = useUserStore((state) => state.updateView);
  const view = useUserStore((state) => state.view);
  const setMatchInfo = useGameStore((state) => state.setMatchInfo);
  const updateStatus = useGameStore((state) => state.updateGameStatus);
  const [isQueueing, setIsQueueing] = React.useState(false);

  // *start queue here
  const handleQueue = () => {
    socket.emit("queueEnter");

    // updateView("Game");
    // updateStatus("InGame");
    // setTimeout(() => onMatchFound(null), 3000); // for development
  };

  //! queue leave function
  const handleQueueLeave = () => {
    socket.emit("queueLeave");
    setIsQueueing(false);
  };

  function onMatchFound(data: MatchInfo) {
    alert("match found");

    const matchInfo: MatchInfo = {
      playerOne: data.playerOne,
      playerTwo: data.playerTwo,
      id: data.id,
    };
    setMatchInfo(matchInfo);
    updateView("Game");
    updateStatus("InGame");
    router.push("/game");
  }

  // https://nextjs.org/docs/api-reference/next/router#routerbeforepopstate
  // TODO implement this thing ^^

  React.useEffect(() => {
    function onQueueEnterSuccess() {
      setIsQueueing(true);
    }

    socket.on("queueEnterSuccess", onQueueEnterSuccess);
    socket.on("matchFound", onMatchFound);

    return () => {
      socket.off("queueEnterSuccess", onQueueEnterSuccess);
      socket.off("matchFound", onMatchFound);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DefaultLayout>
        <Box
          // container
          component={"div"}
          sx={{
            // alignContent:"center",
            // justifyContent:"center",
            height: "100%",
            width: "100%",
          }}
        >
          <Grid sx={{ display: view == "Lobby" ? "block" : "none" }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                typography: "h4",
                fontWeight: "medium",
                width: "300px",
                padding: 2,
              }}
              onClick={isQueueing ? handleQueueLeave : handleQueue}
            >
              {isQueueing ? "Cancel" : "Quick Play"}
            </Button>
          </Grid>
        </Box>
      </DefaultLayout>
    </>
  );
};

export default Lobby;
