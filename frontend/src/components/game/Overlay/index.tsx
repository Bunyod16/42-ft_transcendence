import { Box } from "@mui/material";
import useGameStore from "@/store/gameStore";

import GameResult from "./GameResult";
import Score from "./Score";
import Customize from "./Customize";
import { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "@/store/userStore";

export interface Avatars {
  p1: string;
  p2: string;
}

const Overlay = () => {
  const [matchInfo, gameStatus] = useGameStore((store) => [
    store.matchInfo,
    store.gameStatus,
  ]);
  const [nickName, avatar] = useUserStore((state) => [
    state.nickName,
    state.avatar,
  ]);
  const [avatars, setAvatars] = useState<Avatars>({ p1: "", p2: "" });

  useEffect(() => {
    const otherPlayer =
      matchInfo.playerOne.nickName !== nickName
        ? matchInfo.playerOne.nickName
        : matchInfo.playerTwo.nickName;

    axios
      .get(`/user/findOneProfileByUsername/${otherPlayer}`)
      .then((res) => {
        const opponent = res.data;
        setAvatars({
          p1:
            matchInfo.playerOne.nickName === nickName
              ? avatar
              : opponent.avatar,

          p2:
            matchInfo.playerTwo.nickName === nickName
              ? avatar
              : opponent.avatar,
        });
      })
      .catch(() =>
        setAvatars({
          p1: "https://source.boringavatars.com/pixel/80/",
          p2: "https://source.boringavatars.com/pixel/80/",
        }),
      );
  }, []);

  if (gameStatus == "NoGame") return <></>;
  return (
    <Box
      component={"div"}
      sx={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 999,
      }}
    >
      <Customize />
      <Score avatars={avatars} />
      <GameResult avatars={avatars} />
    </Box>
  );
};

export default Overlay;
