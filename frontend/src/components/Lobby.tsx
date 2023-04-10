import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { gameSocket } from "./socket";
import React from "react";
import { useRouter } from "next/router";

const Lobby = () => {
  const [isQueueing, setIsQueueing] = React.useState(false);
  const router = useRouter();

  // *start queue here
  const handleQueue = () => {
  //   gameSocket.connect();
  // };

  React.useEffect(() => {
    function onMatchFound() {
      router.push("/game");
    }

    function onConnect() {
      setIsQueueing(true);
    }

    gameSocket.on("connect", onConnect);
    gameSocket.on("matchFound", onMatchFound);

    return () => {
      gameSocket.off("matchFound", onMatchFound);
    };
  }, [router]);

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
          onClick={handleQueue}
        >
          {isQueueing ? "Queueing" : "Quick Play"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default Lobby;
