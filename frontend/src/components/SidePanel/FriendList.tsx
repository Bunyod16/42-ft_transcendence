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
import { useEffect } from "react";
import axios from "../apiClient/apiClient";
import useFriendsStore from "@/store/friendsStore";
import useUserStore from "@/store/userStore";
import { FriendType } from "@/types/social-type";
import { chatSocket } from "../socket/socket";
import ManageFriendAccordian from "./ManageFriendAccordian";

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
        overflow: "auto",
        pr: 1,
        flex: 1,
      }}
      aria-label="contacts"
    >
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
            <Avatar src={friend.avatar} sx={{ width: 32, height: 32 }} />
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
  const [setFriendList, setOnline, setOffline] = useFriendsStore((state) => [
    state.setFriendList,
    state.setOnline,
    state.setOffline,
  ]);
  // const [pendingActive, setPendingActive] = useState(false);
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

  useEffect(() => {
    function handleFriendOnline(friend: FriendType) {
      setOnline(friend);
    }

    function handleFriendOffline(friend: FriendType) {
      setOffline(friend);
    }

    chatSocket.on("friendOnline", handleFriendOnline);
    chatSocket.on("friendOffline", handleFriendOffline);
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
      {/* <Button
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
        onChange={handlePendingActive("hello")}
      >
        Blocked
      </Button> */}

      {/* {pendingActive && <PendingBox />} */}
      <ManageFriendAccordian />
    </Box>
  );
}
