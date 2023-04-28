import { Button, Box, duration } from "@mui/material";
import { socket } from "./socket/socket";
import React, { useState } from "react";
import useUserStore from "@/store/userStore";
import useGameStore from "@/store/gameStore";
import { MatchInfo } from "@/types/game-type";
import DefaultLayout from "./layout/DefaultLayout";
import { useRouter } from "next/router";
import CustomGameModal from "./customGame/CustomGameModal";
import toast, { Toaster } from "react-hot-toast";
import { UserProfile } from "@/types/user-profile-type";

const Lobby = () => {
  const updateView = useUserStore((state) => state.updateView);
  const setMatchInfo = useGameStore((state) => state.setMatchInfo);
  const updateStatus = useGameStore((state) => state.updateGameStatus);
  const [isQueueing, setIsQueueing] = React.useState(false);
  const router = useRouter();
  const [friendsInvited, setFriendsInvited] = useState<string[]>([]);

  // *start queue here
  const handleQueue = () => {
    socket.emit("queueEnter");

    // updateView("Game");
    // updateStatus("InGame");
    console.log("trying to queue");
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
      isWinner: false,
    };
    setMatchInfo(matchInfo);
    updateView("Game");
    updateStatus("Customize");
    router.push("/game");
  }

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const [progress, setProgress] = useState(0);

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

  React.useEffect(() => {
    function onGameInvite(user: UserProfile) {
      toast(
        (t) => (
          <span>
            <b>{user.nickName}</b> is inviting you to a game
            <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
            <button
              onClick={() => {
                socket.emit("acceptInvite", user);
                toast.dismiss(t.id);
              }}
            >
              Accept
            </button>
          </span>
        ),
        { duration: 15000, style: { width: 10000, margin: "auto" } },
      );
    }

    socket.on("gameInvite", onGameInvite);

    return () => {
      socket.off("gameInvite", onGameInvite);
    };
  }, []);

  React.useEffect(() => {
    function onAcceptInviteRejected() {
      toast.error("Invite no longer valid!");
    }

    socket.on("acceptInviteRejected", onAcceptInviteRejected);

    return () => {
      socket.off("acceptInviteRejected", onAcceptInviteRejected);
    };
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{
              typography: "h4",
              fontWeight: "medium",
              width: "300px",
              padding: 2,
              marginBottom: 5,
            }}
            onClick={isQueueing ? handleQueueLeave : handleQueue}
          >
            {isQueueing ? "Cancel" : "Quick Play"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              typography: "h4",
              fontWeight: "medium",
              width: "300px",
              padding: 2,
            }}
            onClick={handleOpen}
          >
            {isQueueing ? "Cancel" : "Play With Friends"}
          </Button>
          <CustomGameModal open={open} setOpen={setOpen} socket={socket} />
        </Box>
        <Toaster />
      </DefaultLayout>
    </>
  );
};

export default Lobby;
