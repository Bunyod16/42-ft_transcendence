import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { socket } from "./socket/socket";
import React from "react";
import useUserStore from "@/store/userStore";

const Lobby = () => {
  const { updateState } = useUserStore();
  const [isQueueing, setIsQueueing] = React.useState(false);
  const [matchFound, setMatchFound] = React.useState(false);

  // *start queue here
  const handleQueue = () => {
    socket.emit("queueEnter");
    setIsQueueing(true);
  };

  //! queue leave function
  const handleQueueLeave = () => {
    // emit something here
    setIsQueueing(false);
  };

  React.useEffect(() => {
    function onMatchFound(data: any) {
      alert("match found");
      console.log(data);
      setMatchFound(true);
      updateState("InGame");
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
    </Grid>
  );
};

export default Lobby;
