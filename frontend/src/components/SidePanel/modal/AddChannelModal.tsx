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
import { ChatChannel, Channel } from "@/types/social-type";

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
  const [newChannels, setNewChannels] = useState<ChatChannel[]>([]);

  function getAllChannels() {
    return axios.get("/chat-channels/findAllPublicAndProtectedChannels");
  }

  function getUserChannels() {
    return axios.get("/chat-channel-member/usersGroupMessages");
  }

  useEffect(() => {
    Promise.all([getAllChannels(), getUserChannels()]).then(function ([
      allChannelsRes,
      userChannelsRes,
    ]) {
      const tmps: ChatChannel[] = allChannelsRes.data;
      const userChannels: Channel[] = userChannelsRes.data;
      setNewChannels(
        tmps.filter(
          (tmp) => !userChannels.find((arr) => arr.chatChannel.id === tmp.id),
        ),
      );
    });
  }, [open]);

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
        <Typography variant="h6">Join a channel</Typography>
        <List sx={{ maxHeight: 300, overflow: "auto", mb: 2, pr: 1 }}>
          {newChannels.length ? (
            newChannels.map((channel, i) => (
              <ListItem disablePadding key={i}>
                <ListItemButton
                  disableTouchRipple
                  sx={{
                    borderRadius: 1,
                    cursor: "default",
                    bgcolor: "#00000010",
                    // border: "1px solid #00000020",
                    mb: 1,
                  }}
                >
                  <ListItemText primary={channel.name} />
                  <Button color="secondary">Join</Button>
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <Typography>{`No new channesl :')`}</Typography>
          )}
        </List>
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

export default AddChannelModal;