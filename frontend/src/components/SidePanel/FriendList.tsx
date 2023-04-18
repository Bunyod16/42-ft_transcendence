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
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { io } from "socket.io-client";
const inlineStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "50px",
};

const sampleData = [
  {
    img: "/jakoh_smol.jpg",
    username: "Jakoh",
    alt: "some text",
    status: true,
  },
  {
    img: "/jakoh_smol.jpg",
    username: "Bunyod",
    alt: "some more text",
    status: true,
  },
  {
    img: "/jakoh_smol.jpg",
    username: "Jaclyn",
    alt: "some more more text",
    status: false,
  },
  {
    img: "/jakoh_smol.jpg",
    username: "Al Kapitan",
    alt: "some more more more text",
    status: false,
  },
  {
    img: "/jakoh_smol.jpg",
    username: "Davidto",
    alt: "some more more more more text",
    status: true,
  },
];

// not sure something.
// data acpt from here, friend msg etc
// socket.on("serverMessage", (data) => {
//   data;
// });
function FriendBox({
  setPanel,
}: {
  setPanel: React.Dispatch<React.SetStateAction<string>>;
}) {
  /**
   * useState to store friend;
   */
  // const socket = io();
  function handleDirectMessage() {
    // socket.emit("joinRoomDirectMessage", {
    //   // have to check if id is me or not for resquester and responder
    //   friendId: directMessage.id | friend.id,
    // });
  }

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
      {sampleData.map((friend, index) => (
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
          <ListItemButton onClick={() => setPanel(friend.username)}>
            <Image
              src={friend.img}
              alt={friend.alt}
              width={32}
              height={32}
              style={inlineStyle}
            />
            <ListItemText sx={{ ml: "12px" }} primary={friend.username} />
            <CircleIcon
              sx={{
                fill: friend.status ? "green" : "red",
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

export default function Friends({
  setPanel,
}: {
  setPanel: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [friend, setFriend] = useState<string>("");
  function handleFriend() {
    const promptFriend: string = prompt("Enter friend Name") || "";
    setFriend(promptFriend);
    console.log(friend);
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
