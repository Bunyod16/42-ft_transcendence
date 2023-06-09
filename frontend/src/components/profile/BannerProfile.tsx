import { UserProfile } from "@/types/user-profile-type";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Avatar, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import useUserStore from "@/store/userStore";
import axios from "../utils/apiClient";
import { toast } from "react-hot-toast";

function handleAddFriend(nickName: string) {
  axios
    .post("/friend-request/addFriendByNickName", {
      nickName: nickName,
    })
    .then((response) => {
      console.log(response);
      toast.success("Request successful!");
    })
    .catch((err) => {
      toast.error("Request failed!");
      console.log(err);
    });
}

function CustomAddButton({
  personalNickName,
  userNickName,
}: {
  personalNickName: string;
  userNickName: string;
}) {
  if (personalNickName === userNickName) return <></>;
  return (
    <Button
      onClick={() => handleAddFriend(userNickName)}
      sx={{
        textTransform: "uppercase",
        textAlign: "center",
        lineHeight: "50px",
        backgroundColor: "primary.200",
        borderRadius: "8px",
        padding: "15px 5px",
        width: "150px",
        fontWeight: "700",
        fontSize: "1.5em",
        margin: "0px",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "primary.main",
        },
        "&:active": {
          transform: "scale(0.9)",
        },
      }}
    >
      <PersonAddIcon sx={{ fill: "white" }} />
    </Button>
  );
}

export default function BannerProfile(user: UserProfile) {
  const nickName = useUserStore((state) => state.nickName);
  const router = useRouter();
  /*
   * Wins worth 2 points
   * Losses worth 1 point
   *
   * expIncreasePerLevel means
   * level 1 -> 2 points
   * level 2 -> 4 points
   * level 3 -> 6 points
   * ...
   *
   * extra points left gets turned into fraction over next level.
   * */

  const calculateUserLevel = (wins: number, losses: number): string => {
    let totalPoints: number = wins * 2 + losses;
    let finalLevel = 0.0;
    let expIncreasePerLevel = 2;

    while (totalPoints > 0) {
      totalPoints -= expIncreasePerLevel;
      expIncreasePerLevel++;
      finalLevel++;
    }

    //calculate float if theres extra exp
    if (totalPoints !== 0) {
      finalLevel +=
        (totalPoints + (expIncreasePerLevel - 1)) / expIncreasePerLevel;
    }

    //round to 3dp
    return finalLevel.toFixed(3);
  };

  const calculateUserMMR = (wins: number, losses: number): number => {
    const mmr = wins - losses > 0 ? (wins - losses) * 25 : 0;
    return mmr;
  };

  return (
    <Box
      component="div"
      sx={{ padding: "10px 50px", backgroundColor: "primary.100" }}
    >
      <Box
        component="div"
        sx={{ display: "flex", flexDirection: "row", marginBottom: "10px" }}
      >
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          sx={{ color: "text.primary" }}
          onClick={() => router.push("/")}
        >
          <Typography
            variant="h5"
            sx={{
              textTransform: "uppercase",
            }}
          >
            Player Profile
          </Typography>
        </Button>
      </Box>
      <Box component="div" sx={{ display: "flex", flexDirection: "row" }}>
        <Avatar
          sx={{ width: "120px", height: "120px", borderRadius: "8px" }}
          src={
            user.avatar === "default-stormtrooper.png"
              ? `https://source.boringavatars.com/beam/40/${user.id}?square`
              : user.avatar
          }
        ></Avatar>
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginLeft: "20px",
            padding: "0px",
            width: "100%",
          }}
        >
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: "3em",
                fontWeight: "800",
                margin: "0px",
                lineHeight: "0.8em",
                color: "text.primary",
                textTransform: "uppercase",
                textOverflow: "ellipsis",
              }}
            >
              {user.nickName}
            </Typography>
            <CustomAddButton
              personalNickName={nickName}
              userNickName={user.nickName}
            />
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                textTransform: "uppercase",
                textAlign: "center",
                lineHeight: "50px",
                backgroundColor: "primary.200",
                borderRadius: "8px",
                padding: "5px 5px",
                width: "150px",
                fontWeight: "700",
                fontSize: "1.5em",
                margin: "0px",
              }}
            >
              Lvl {calculateUserLevel(user.wins, user.losses)}
            </Typography>
            <Typography
              sx={{
                textTransform: "uppercase",
                textAlign: "center",
                lineHeight: "50px",
                backgroundColor: "primary.200",
                borderRadius: "8px",
                padding: "5px 5px",
                width: "150px",
                fontWeight: "700",
                fontSize: "1.5em",
                margin: "0px",
              }}
            >
              {calculateUserMMR(user.wins, user.losses)} MMR
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
