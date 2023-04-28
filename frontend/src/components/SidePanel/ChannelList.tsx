import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import { Channel, PanelData } from "@/types/social-type";
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

interface AddChannelModalProp {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddChannelModal = ({ open, setOpen }: AddChannelModalProp) => {
  // const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [isProtected, setIsProtected] = useState(false);
  const [channelValue, setChannelValue] = useState({
    name: "",
    password: "",
  });
  const [newChannels, setNewChannels] = useState<Channel[]>([]);

  useEffect(() => {
    axios
      .get("/chat-channels/findAllPublicAndProtectedChannels")
      .then((res) => {
        // setNewChannels(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleCreateChannel = () => {
    if (channelValue.name === "") return alert("Channel name is missing");
    if (isProtected)
      if (channelValue.password === "")
        return alert("Channel password is missing");
    axios
      .post("/chat-channels/groupMessage", { name: channelValue.name })
      .then((res) => {
        const newChannelId = res.data.id;
        if (isProtected)
          axios
            .patch(`/chat-channels/${newChannelId}`, {
              ...channelValue,
              channelType: "Private",
            })
            .then((res) => console.log("success", { res }))
            .catch((err) => console.log(err));
        // console.log("success", { res });
        alert("Created Channel!");
        setOpen(false);
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        component={"div"}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.default",
          // border: "2px solid #000",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6">Create a new channel</Typography>
        {/* <Typography paddingTop={1}>Set a channel name</Typography> */}
        <TextField
          id="outlined-basic"
          label="Channel name"
          variant="outlined"
          color="secondary"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          value={channelValue.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setChannelValue({ ...channelValue, name: e.target.value })
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              color="secondary"
              checked={isProtected}
              onChange={() => setIsProtected(!isProtected)}
            />
          }
          label="Protected"
        />
        {isProtected && (
          <>
            {/* <Typography paddingTop={1}>Set a password</Typography> */}
            <TextField
              id="outlined-basic"
              label="Channel password"
              variant="outlined"
              color="secondary"
              size="small"
              fullWidth
              sx={{ mt: 1, mb: 2 }}
              value={channelValue.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setChannelValue({ ...channelValue, password: e.target.value })
              }
            />
          </>
        )}
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{
            textTransform: "none",
          }}
          onClick={handleCreateChannel}
        >
          Create channel
        </Button>
      </Box>
    </Modal>
  );
};

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
              {/* <CircleIcon
                sx={{
                  fill: channel.online ? "green" : "red",
                  mr: "12px",
                  width: "12px",
                  height: "12px",
                }}
              /> */}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
