import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { socket } from "./socket/socket";
import React from "react";
import useUserStore from "@/store/userStore";

const Lobby = () => {
  const { updateState } = useUserStore();
  const [isQueueing, setIsQueueing] = React.useState(false);

  // *start queue here
  const handleQueue = () => {
    socket.emit("queueEnter");
    setIsQueueing(true);
    // setTimeout(() => onMatchFound(null), 3000); // for development
  };

  //! queue leave function
  const handleQueueLeave = () => {
    // emit something here
    setIsQueueing(false);
  };

  function onMatchFound(data: unknown) {
    alert("match found");
    console.log(data);
    updateState("InGame");
  }

  React.useEffect(() => {
    function onQueueEnterSuccess() {
      setIsQueueing(true);
    }

    // function onQueueLeave() {
    //   console.log("Quit queue");
    // }

    socket.on("queueEnterSuccess", onQueueEnterSuccess);
    socket.on("matchFound", onMatchFound);
    // socket.on("fuck", () => {
    //   console.log("fuck");
    // });
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
    </Grid>
  );
};

export default Lobby;
