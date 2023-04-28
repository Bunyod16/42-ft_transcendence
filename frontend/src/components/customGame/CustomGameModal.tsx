import {
  Box,
  Button,
  CircularProgress,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";
import CircleIcon from "@mui/icons-material/Circle";
import useFriendsStore from "@/store/friendsStore";
import { Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../socket/socket-types";

const inlineStyle = {};

const sampleData = [
  {
    id: 44,
    img: "/jakoh_smol.jpg",
    username: "Jakoh",
    alt: "some text",
    status: true,
  },
  {
    id: 44,
    img: "/jakoh_smol.jpg",
    username: "Bunyod",
    alt: "some more text",
    status: true,
  },
  {
    id: 44,
    img: "/jakoh_smol.jpg",
    username: "Jaclyn",
    alt: "some more more text",
    status: false,
  },
  {
    id: 44,
    img: "/jakoh_smol.jpg",
    username: "Al Kapitan",
    alt: "some more more more text",
    status: false,
  },
  {
    id: 44,
    img: "/jakoh_smol.jpg",
    username: "Al Pakistan",
    alt: "some more more more text",
    status: true,
  },
  {
    id: 44,
    img: "/jakoh_smol.jpg",
    username: "Davidtos",
    alt: "some more more more more text",
    status: false,
  },
  {
    id: 44,
    img: "/jakoh_smol.jpg",
    username: "Al Lapitan",
    alt: "some more more more text",
    status: false,
  },
  {
    id: 44,
    img: "/jakoh_smol.jpg",
    username: "Doritos",
    alt: "some more more more more text",
    status: false,
  },
  {
    id: 44,
    img: "/jakoh_smol.jpg",
    username: "Al Sapitan",
    alt: "some more more more text",
    status: true,
  },
  {
    id: 44,
    img: "/jakoh_smol.jpg",
    username: "Davidto",
    alt: "some more more more more text",
    status: true,
  },
  {
    id: 44,
    img: "/jakoh_smol.jpg",
    username: "Al Mapitan",
    alt: "some more more more text",
    status: false,
  },
  {
    id: 44,
    img: "/jakoh_smol.jpg",
    username: "Davintito",
    alt: "some more more more more text",
    status: true,
  },
];

interface CustomGameModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

const CustomGameModal = ({ open, setOpen, socket }: CustomGameModalProps) => {
  const [cancelFriends, setCancelFriends] = React.useState(false);
  const friends = useFriendsStore((state) => state.friends);
  const [friendsInvited, setFriendsInvited] = useState<string[]>([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (friendsInvited.length == 0) {
      setOpen(false);
    } else {
      setCancelFriends(true);
    }
  };
  const handleCancelFriends = () => {
    setOpen(false);
    setCancelFriends(false);
    setFriendsInvited([]);
    socket.emit("cancelPlayWithFriend");
  };

  const handleContinueFriends = () => {
    setOpen(true);
    setCancelFriends(false);
  };
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 1 ? -200000 : prevProgress + 5,
      );
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        component="div"
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "accent.dark",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
        style={{ maxHeight: 600, overflow: "auto" }}
      >
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ textAlign: "center" }}
        >
          Invite Friends
        </Typography>
        {cancelFriends ? (
          <Box
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 3,
              gap: 2,
              flexDirection: "column",
            }}
          >
            <Button
              disableRipple
              onClick={handleContinueFriends}
              sx={{
                textAlign: "center",
                backgroundColor: "secondary.main",
                width: 200,
              }}
              variant="contained"
            >
              <ListItemText sx={{ ml: "12px" }} primary={"continue waiting"} />
            </Button>
            <Button
              disableRipple
              onClick={handleCancelFriends}
              sx={{
                textAlign: "center",
                backgroundColor: "accent.main",
                width: 200,
              }}
              variant="contained"
            >
              <ListItemText sx={{ ml: "12px" }} primary={"cancel"} />
            </Button>
          </Box>
        ) : (
          sampleData
            .sort((a, b) => {
              return a.status === b.status ? 0 : a.status ? -1 : 1;
            })
            .map((friend, index) => {
              return (
                <ListItemButton
                  disableRipple
                  disabled={friend.status ? false : true}
                  onClick={() => {
                    socket.emit("inviteFriend", {
                      friendId: friend.id.toString(),
                    });
                    setFriendsInvited((prevFriends) => {
                      return [...prevFriends, friend.username];
                    });
                  }}
                >
                  <ListItem
                    key={index}
                    disablePadding
                    sx={{
                      backgroundColor: "#FEFFFF",
                      mb: "8px",
                      width: "95%",
                      color: "black",
                      borderRadius: "8px",
                      paddingLeft: 2,
                      paddingTop: 1,
                      paddingBottom: 1,
                    }}
                  >
                    <Image
                      src={friend.img}
                      alt={friend.alt}
                      width={32}
                      height={32}
                      style={inlineStyle}
                    />
                    <ListItemText
                      sx={{ ml: "12px" }}
                      primary={friend.username}
                    />
                    <Box component="div">
                      {friendsInvited.includes(friend.username) ? (
                        <CircularProgress
                          size={23}
                          sx={{
                            mr: "12px",
                            width: "12px",
                            height: "12px",
                          }}
                          variant="determinate"
                          value={progress}
                        />
                      ) : (
                        <CircleIcon
                          sx={{
                            fill: friend.status ? "green" : "red",
                            mr: "12px",
                            width: "12px",
                            height: "12px",
                          }}
                        />
                      )}
                    </Box>
                  </ListItem>
                </ListItemButton>
              );
            })
        )}
      </Box>
    </Modal>
  );
};

export default CustomGameModal;
