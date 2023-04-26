import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import useFriendsStore, { FriendType } from "@/store/friendsStore";

const inlineStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "50px",
};

interface FriendPanelType {
  setPanel: React.Dispatch<React.SetStateAction<FriendType | undefined>>;
}

// data acpt from here, friend msg etc
// socket.on("serverMessage", (data) => {
//   data;
// });
function FriendBox({ setPanel }: FriendPanelType) {
  const friends = useFriendsStore((state) => state.friends);
  return (
    <List
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      aria-label="contacts"
    >
      {/** map new friend state */}
      {friends.map((friend, index) => (
        <ListItem
          key={index}
          disablePadding
          sx={{
            backgroundColor: "#FEFEFE",
            mb: "8px",
            width: "95%",
            color: "black",
            borderRadius: "8px",
          }}
        >
          {/** Need to change src to img thingy */}
          <ListItemButton onClick={() => setPanel(friend)}>
            <Image
              src={"/jakoh_smol.jpg"}
              alt={friend.avatar}
              width={32}
              height={32}
              style={inlineStyle}
            />
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

export default function FriendList({ setPanel }: FriendPanelType) {
  const setFriendList = useFriendsStore((state) => state.setFriendList);
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
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Button
        variant="outlined"
        sx={{
          width: "95%",
          mt: "8px",
          mb: "15px",
          color: "#FEFEFE",
          border: "2px solid #A3A3A3",
          height: "64px",
          "&:hover": {
            border: "2px solid #626262",
          },
        }}
        onClick={handleFriend}
      >
        <Typography variant="h6">ADD FRIENDS</Typography>
      </Button>
      <FriendBox setPanel={setPanel} />
    </Box>
  );
}
