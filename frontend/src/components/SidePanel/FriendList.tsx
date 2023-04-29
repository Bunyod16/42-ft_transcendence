import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useEffect, useState } from "react";
import axios from "axios";
import useFriendsStore from "@/store/friendsStore";
import PendingBox from "./PendingBox";
import { PanelData } from "@/types/social-type";
import useUserStore from "@/store/userStore";

// interface FriendPanelType {
//   setPanel: React.Dispatch<React.SetStateAction<PanelData | undefined>>;
// }
function FriendBox() {
  const [friends] = useFriendsStore((state) => [state.friends]);
  const setPanel = useUserStore((state) => state.setPanel);

  return (
    <List
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // height: "100%",
        overflow: "auto",
        pr: 1,
        flex: 1,
      }}
      aria-label="contacts"
    >
      {/** map new friend state */}
      {friends.map((friend, index) => (
        <ListItem
          key={index}
          disablePadding
          sx={{
            backgroundColor: "#00000020",
            mb: 1,
            borderRadius: "4px",
          }}
        >
          {/** Need to change src to img thingy */}
          <ListItemButton
            onClick={() => {
              setPanel({
                friendInfo: friend,
                chatChannel: friend.chatChannel,
              });
            }}
          >
            <Avatar src={"/jakoh_smol.jpg"} sx={{ width: 32, height: 32 }} />
            <ListItemText sx={{ ml: "12px" }} primary={friend.nickName} />
            <CircleIcon
              sx={{
                fill: friend.online ? "green" : "red",
                mr: "12px",
                width: "12px",
                height: "12px",
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default function FriendList() {
  const setFriendList = useFriendsStore((state) => state.setFriendList);
  const [pendingActive, setPendingActive] = useState(false);
  useEffect(() => {
    axios
      .get("/friend-request/findUserFriendsWithDirectMessage")
      .then((response) => {
        setFriendList(response.data);
        // alert("YOU NOW HAVE FRENS");
      })
      .catch((error) => {
        console.log("error: ", error);
        // alert("KENOT SET FRIEND");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFriend() {
    const promptFriend: string = prompt("Enter friend Name") || "";
    axios
      .post("/friend-request/addFriendByNickName", {
        nickName: promptFriend,
      })
      .then((response) => {
        alert("BEFRIENDING SUCCESSFUL");
        console.log(response);
      })
      .catch((err) => {
        alert("BEFRIENDING FAIL");
        console.log(err);
      });
  }

  return (
    <Box
      component="div"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 1,
        gap: 1,
        my: 2,
      }}
    >
      <Button
        variant="outlined"
        fullWidth
        sx={{
          // mt: 2,
          color: "#FEFEFE",
          border: "2px solid #A3A3A3",
          height: "48px",
          "&:hover": {
            border: "2px solid #626262",
          },
        }}
        onClick={handleFriend}
      >
        Add Friend
      </Button>

      <FriendBox />
      {/* <Typography>Pending</Typography> */}
      <Button
        // variant="outlined"
        // color="primary"
        fullWidth
        sx={{
          mt: "8px",
          color: "#FEFEFE",
          // border: "2px solid #A3A3A3",
          justifyContent: "start",
          "&:hover": {
            backgroundColor: "#00000050",
          },
        }}
        onClick={() => setPendingActive(!pendingActive)}
      >
        Pending
      </Button>
      {pendingActive && <PendingBox />}
    </Box>
  );
}
