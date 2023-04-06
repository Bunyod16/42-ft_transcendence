import * as React from "react";
import Button from "@mui/material/Button";
import { io } from "socket.io-client";

import Game from "@/components/game/Game";
import DefaultLayout from "@/components/layout/DefaultLayout";

export default function Home() {
  const [start, setStart] = React.useState(false);

  const startGame = () => {
    // queue for a game here
    socketInitializer();
  };

  const socketInitializer = () => {
    // We just call it because we don't need anything else out of it
    // await fetch("/api/socket");

    // const socket = io();
    const socket = io({
      transports: ["websocket"],
      upgrade: false,
    });

    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("match-found", () => {
      console.log("match found!");
      setStart(true);
    });
  };

  return (
    <DefaultLayout>
      {start ? (
        <Game />
      ) : (
        <Button variant="contained" onClick={startGame}>
          Start
        </Button>
      )}
    </DefaultLayout>
  );
}
