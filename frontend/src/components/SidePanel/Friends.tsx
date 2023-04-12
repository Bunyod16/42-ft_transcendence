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
import { useState } from "react";
import Image from "next/image";

const inlineStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "50px",
};

/**
 * Convert Friends list into array of =
 * {
 * img: .jpg,
 * name: string,
 * status: online | offline
 * }
 *
 * need to add dot icon, green = online | red = offline
 */

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

function friendBox() {
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
          <ListItemButton>
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

export default function Friends() {
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
      {friendBox()}
    </Box>
  );
}
