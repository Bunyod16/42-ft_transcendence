import { Button, Grid } from "@mui/material";
import { socket } from "./socket/socket";
import React from "react";
import useUserStore from "@/store/userStore";
import useGameStore from "@/store/gameStore";
import { useRouter } from "next/router";
import { MatchInfo } from "@/types/game-types";
import GameComponent from "./game/GameComponent";

const Lobby = () => {
  const { updateView } = useUserStore();
  const { setMatchInfo } = useGameStore();
  const [isQueueing, setIsQueueing] = React.useState(false);
  const router = useRouter();

  // *start queue here
  const handleQueue = () => {
    socket.emit("queueEnter");
    // setTimeout(() => onMatchFound(null), 3000); // for development
  };

  //! queue leave function
  const handleQueueLeave = () => {
    socket.emit("queueLeave");
    setIsQueueing(false);
  };

  function onMatchFound(data: MatchInfo) {
    alert("match found");

    const state: MatchInfo = {
      playerOne: data.playerOne,
      playerTwo: data.playerTwo,
      id: data.id,
    };
    setMatchInfo(state);
    updateView("Game");
    router.push("/game");
  }

  React.useEffect(() => {
    function onQueueEnterSuccess() {
      setIsQueueing(true);
    }

    socket.on("queueEnterSuccess", onQueueEnterSuccess);
    socket.on("matchFound", onMatchFound);
    // socket.on("matchFound", onMatchFound);
    // socket.on("matchFound", onMatchFound);

    return () => {
      socket.off("queueEnterSuccess", onQueueEnterSuccess);
      socket.off("matchFound", onMatchFound);
    };
  }, []);

  return (
    <Grid
      container
      alignContent="center"
      justifyContent={"center"}
      height={"100%"}
    >
      <Grid>
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
      {/* <GameComponent /> */}
    </Grid>
  );
};

export default Lobby;
