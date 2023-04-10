import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { socket } from "./socket/socket";
import React from "react";
import { useRouter } from "next/router";

const Lobby = () => {
  const [isQueueing, setIsQueueing] = React.useState(false);
  const router = useRouter();

  // *start queue here
  const handleQueue = () => {
    // socket.emit("queueEnter");
    setIsQueueing(true);
  };

  //! queue leave function
  const handleQueueLeave = () => {
    // emit something here
    setIsQueueing(false);
  };

  React.useEffect(() => {
    function onMatchFound() {
      alert("match found");
      // router.push("/game");
    }

    function onQueueEnterSuccess() {
      setIsQueueing(true);
    }

    function onQueueLeave() {
      console.log("Quit queue");
    }

    socket.on("queueEnterSuccess", onQueueEnterSuccess);
    socket.on("matchFound", onMatchFound);
    // socket.on("matchFound", onMatchFound);
    // socket.on("matchFound", onMatchFound);

    return () => {
      socket.off("matchFound", onMatchFound);
      socket.off("queueEnterSuccess", onQueueEnterSuccess);
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
          onClick={isQueueing ? handleQueueLeave : handleQueue}
        >
          {isQueueing ? "Cancel" : "Quick Play"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default Lobby;
