import React, { useState, useEffect, useRef } from "react";
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
  Icon,
  useRadioGroup,
} from "@mui/material";
import axios from "axios";
import { ChatChannel, Channel } from "@/types/social-type";
import useUserStore from "@/store/userStore";
import { toast } from "react-hot-toast";
import LockSharpIcon from "@mui/icons-material/LockSharp";
import { channel } from "diagnostics_channel";

interface PasswordModalProp {
  open: boolean;
  setOpen: (boo: boolean) => void;
  returnPassword: (password: string) => void;
}
const PasswordModal = ({
  open,
  setOpen,
  returnPassword,
}: PasswordModalProp) => {
  const handleClose = () => setOpen(false);
  const [password, setPassword] = useState("");

  const handleEnterPassword = () => {
    returnPassword(password);
    handleClose();
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
          width: 300,
          bgcolor: "background.default",
          // border: "2px solid #000",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <TextField
          id="outlined-basic"
          label="Channel password"
          variant="outlined"
          // color="secondary"
          size="small"
          fullWidth
          sx={{ mt: 1, mb: 2 }}
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <Button
          variant="contained"
          fullWidth
          color="secondary"
          onClick={handleEnterPassword}
        >
          Enter Password
        </Button>
      </Box>
    </Modal>
  );
};

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
  const id = useUserStore((state) => state.id);
  const [openPwd, setOpenPwd] = useState(false);
  const [password, setPassword] = useState("");

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
        alert("Created Channel!");
        setOpen(false);
      });
  };

  const handleJoinChannel = (channel: ChatChannel) => {
    if (channel.channel_type === "protected") setOpenPwd(true);
    else
      axios
        .post("/chat-channel-member", {
          userId: id,
          chatChannelId: channel.id,
        })
        .then(() => toast.success(`Joined ${channel.name}!`))
        .catch((err) => {
          toast.error("Something went wrong!");
          console.log(err);
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
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <PasswordModal
          open={openPwd}
          setOpen={setOpenPwd}
          returnPassword={setPassword}
        />
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
                    mb: 1,
                  }}
                >
                  <ListItemText sx={{ alignContent: "center" }}>
                    {channel.name}
                  </ListItemText>
                  <Button
                    color="secondary"
                    onClick={() => handleJoinChannel(channel)}
                    endIcon={
                      channel.channel_type === "protected" && (
                        <LockSharpIcon fontSize="small" />
                      )
                    }
                  >
                    Join
                  </Button>
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
