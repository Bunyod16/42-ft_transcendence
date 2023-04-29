import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { Channel, PanelData } from "@/types/social-type";
import AddChannelModal from "./modal/AddChannelModal";
/**
 * Chat Data Array of =
 * {
 * 	user: string,
 * 	message: string,
 * 	time?: UDT | string
 * }
 *
 * Need to add channel list on top
 */

interface ChannelPanelProp {
  setPanel: React.Dispatch<React.SetStateAction<PanelData | undefined>>;
}
export default function ChannelList({ setPanel }: ChannelPanelProp) {
  // const [chats, setChats] = useState<ChatType[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  // const [curChannel, setCurChannel] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);

  const handleAddChannel = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    axios
      .get("/chat-channel-member/usersGroupMessages")
      .then((response) => {
        setChannels(response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, [openModal]);

  return (
    <Box
      component="div"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        alignItems: "center",
        px: 1,
      }}
    >
      <AddChannelModal open={openModal} setOpen={setOpenModal} />
      <Button
        variant="outlined"
        fullWidth
        sx={{
          // width: "95%",
          mt: 2,
          // mb: "15px",
          color: "#FEFEFE",
          border: "2px solid #A3A3A3",
          height: "48px",
          "&:hover": {
            border: "2px solid #626262",
          },
        }}
        onClick={handleAddChannel}
      >
        Add Channel
      </Button>

      <List
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          overflow: "auto",
          pr: 0.5,
          my: 1,
        }}
        aria-label="contacts"
      >
        {/** map new channels state */}
        {channels.map((channel, index) => (
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
              onClick={() =>
                setPanel({ friendInfo: null, chatChannel: channel })
              }
            >
              <ListItemText
                sx={{ ml: "12px" }}
                primary={channel.chatChannel.name}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
1;
