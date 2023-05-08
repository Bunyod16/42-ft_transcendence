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
import axios from "../../apiClient/apiClient";
import { ChatChannel, Channel } from "@/types/social-type";
import useUserStore from "@/store/userStore";
import { toast } from "react-hot-toast";
import LockSharpIcon from "@mui/icons-material/LockSharp";

interface PasswordModalProp {
  modalData: { open: boolean; channel: ChatChannel; id: number };
  setModalData: (data: any) => void;
}
const PasswordModal = ({ modalData, setModalData }: PasswordModalProp) => {
  const handleClose = () => setModalData({ open: false });
  const [password, setPassword] = useState("");

  const handleEnterPassword = () => {
    axios
      .post("/chat-channel-member/protected", {
        userId: modalData.id,
        chatChannelId: modalData.channel.id,
        password: password,
      })
      .then(() => toast.success(`Joined ${modalData.channel.name}!`))
      .catch((err) => {
        toast.error(err.response.data.message);
        console.log(err.response);
      });
    handleClose();
  };

  return (
    <Modal
      open={modalData.open}
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
  // onUpdateChannel: (channels: Channel[]) => void;
}
const AddChannelModal = ({ open, setOpen }: AddChannelModalProp) => {
  // for creating channel
  const handleClose = () => setOpen(false);
  const [isProtected, setIsProtected] = useState(false);
  const [channelValue, setChannelValue] = useState({
    name: "",
    password: "",
  });

  // for join channel
  const [newChannels, setNewChannels] = useState<ChatChannel[]>([]);
  const id = useUserStore((state) => state.id);
  const [openPwd, setOpenPwd] = useState({
    open: false,
    channel: newChannels[0],
    id: id || 0,
  });
  const [password, setPassword] = useState("");
  const [isValidChannelName, setIsValidChannelName] = useState<boolean>(false);

  function getAllChannels() {
    return axios.get("/chat-channels/findAllPublicAndProtectedChannels");
  }

  function getUserChannels() {
    return axios.get("/chat-channel-member/usersGroupMessages");
  }

  // get lists of availble channels to join
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
    if (channelValue.name === "")
      return toast.error("Channel name is missing!", { id: "createChannel" });

    if (isProtected) {
      if (channelValue.password === "")
        return toast.error("Channel password is missing!", {
          id: "createChannel",
        });

      axios
        .post("/chat-channels/protectedGroupMessage", {
          name: channelValue.name,
          password: channelValue.password,
        })
        .then(() => {
          toast.success(`Created ${channelValue.name}!`, {
            icon: "🔒",
            id: "createChannel",
          });
        })
        .catch((err) => {
          // console.log(err.response);
          if (err?.statusCode === 400) {
            let message: string = err.message;
            console.log(message);
            message = message.slice(message.indexOf(":") + 1, message.length);
            toast.error(`${message}`);
          }
          // toast.error(err.response.data.message, { id: "createChannel" });
        })
        .finally(() => setOpen(false));
    } else {
      axios
        .post("/chat-channels/groupMessage", {
          name: channelValue.name,
        })
        .then(() =>
          toast.success(`Created ${channelValue.name}!`, {
            id: "createChannel",
          }),
        )
        .catch((err) => {
          if (err?.statusCode === 400) {
            let message: string = err.message;
            console.log(message);
            message = message.slice(message.indexOf(":") + 1, message.length);
            toast.error(`${message}`);
          }
          // toast.error(err.response.data.message, { id: "createChannel" }),
        })
        .finally(() => setOpen(false));
    }
  };

  const handleJoinChannel = (channel: ChatChannel) => {
    if (channel.channel_type === "protected") {
      // getPassword().then();
      setOpenPwd({ open: true, channel: channel, id: id || -1 });
    } else
      axios
        .post("/chat-channel-member", {
          userId: id,
          chatChannelId: channel.id,
        })
        .then(() => toast.success(`Joined ${channel.name}!`))
        .catch((err) => {
          toast.error(err.response.data.message);
          console.log(err.response);
        });
  };

  useEffect(() => {
    const reg = /^[a-z0-9]{1,10}$/i;
    setIsValidChannelName(reg.test(channelValue.name));
  }, [channelValue.name]);

  console.log(isValidChannelName);
  console.log(channelValue.name);

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
        <PasswordModal modalData={openPwd} setModalData={setOpenPwd} />
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
          sx={{ mt: 2 }}
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
              sx={{ mb: 2 }}
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
            color: "text.primary",
            mt: 2,
            backgroundColor: !isValidChannelName
              ? "accent.main"
              : "accent.light",
          }}
          onClick={handleCreateChannel}
          disabled={!isValidChannelName}
        >
          Create channel
        </Button>
      </Box>
    </Modal>
  );
};

export default AddChannelModal;
