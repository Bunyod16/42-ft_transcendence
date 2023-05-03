import {
  Channel,
  ChannelMember,
  ChatChannel,
  UserInfo,
} from "@/types/social-type";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Avatar,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import BlockSharpIcon from "@mui/icons-material/BlockSharp";
import VolumeOffSharpIcon from "@mui/icons-material/VolumeOffSharp";
import EmojiPeopleSharpIcon from "@mui/icons-material/EmojiPeopleSharp";
import { DateTimePicker } from "@mui/x-date-pickers";

import axios from "../../apiClient/apiClient";
import { toast } from "react-hot-toast";
import useUserStore from "@/store/userStore";

interface MemberListItemProps {
  member: ChannelMember;
  chatChannel: ChatChannel;
  setMembers: () => void;
}

const MemberListItem = ({
  member,
  chatChannel,
  setMembers,
}: MemberListItemProps) => {
  const [isBlacklisted, setIsBlacklisted] = useState<boolean>(
    member.isBlacklisted,
  );

  const confirmToast = (action: string, callback: () => void) => {
    toast.loading(
      (t) => (
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>
            Are you sure you want to {action} {member.user.nickName}?
          </Typography>
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Button
              sx={{ ml: 1 }}
              onClick={() => {
                toast.dismiss(t.id);
                callback();
              }}
            >
              Yes
            </Button>
            <Button onClick={() => toast.dismiss(t.id)}>No</Button>
          </span>
        </span>
      ),
      {
        icon: <EmojiPeopleSharpIcon color="error" />,
        id: "leaveConfirm",
      },
    );
  };

  const showMuteOptionsToast = () => {
    toast.loading(
      (t) => (
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>Mute until</Typography>
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <DateTimePicker />
            <Button
              sx={{ ml: 1 }}
              onClick={() => {
                toast.dismiss(t.id);
              }}
            >
              Yes
            </Button>
            <Button onClick={() => toast.dismiss(t.id)}>No</Button>
          </span>
        </span>
      ),
      {
        icon: <EmojiPeopleSharpIcon color="error" />,
        id: "leaveConfirm",
      },
    );
  };

  const handleKick = () => {
    axios
      .delete(`/chat-channel-member/${member.id}`, {
        data: {
          chatChannelId: chatChannel.id,
        },
      })
      .then(() => {
        toast.success(`Member ${member.user.nickName} has been kicked.`);
        console.log(`Member ${member.user.nickName} has been kicked.`);
        setMembers();
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 400) {
          let message: string = err.response.data.message;
          message = message.slice(message.indexOf(":") + 1, message.length);
          toast.error(`${message}`);
        }
      });
  };

  const handleBlacklist = () => {
    axios
      .patch(`chat-channel-member/${member.id}/blacklisted`, {
        isBlacklisted: !member.isBlacklisted,
        chatChannelId: chatChannel.id,
      })
      .then(() => {
        toast.success(`Member ${member.user.nickName} has been blacklisted.`);
        console.log(`Member ${member.user.nickName} has been blacklisted.`);
        setIsBlacklisted(!isBlacklisted);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 400) {
          let message: string = err.response.data.message;
          message = message.slice(message.indexOf(":") + 1, message.length);
          toast.error(`${message}`);
        }
      });
  };

  const handleMute = () => {
    console.log("mute");
  };

  return (
    <ListItem disablePadding>
      <ListItemButton disableTouchRipple sx={{ cursor: "default" }}>
        {/* <ListItemAvatar> */}
        <Avatar
          src={member.user.avatar}
          sx={{ width: 24, height: 24, mr: 2 }}
        />
        {/* </ListItemAvatar> */}

        <ListItemText
          primary={member.user.nickName}
          sx={{
            color: isBlacklisted ? "text.secondary" : "text.primary",
            textDecoration: isBlacklisted ? "line-through" : "none",
          }}
        />

        <Tooltip title="Mute" followCursor>
          <IconButton
            size="small"
            sx={{ ml: 1 }}
            onClick={showMuteOptionsToast}
          >
            <VolumeOffSharpIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Blacklist" followCursor>
          <IconButton
            size="small"
            sx={{ ml: 1 }}
            color={!isBlacklisted ? "default" : "error"}
            onClick={() => confirmToast("blacklist", handleBlacklist)}
          >
            <BlockSharpIcon
              fontSize="inherit"
              color={!isBlacklisted ? "inherit" : "error"}
            />
          </IconButton>
        </Tooltip>

        <Tooltip title="Kick" followCursor>
          <IconButton
            size="small"
            sx={{ ml: 1 }}
            color="error"
            onClick={() => confirmToast("kick", handleKick)}
          >
            <DeleteSharpIcon fontSize="inherit" color="error" />
          </IconButton>
        </Tooltip>
      </ListItemButton>
    </ListItem>
  );
};

interface ManageChannelModalProp {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  channel: Channel;
}

const ManageChannelModal = ({
  open,
  setOpen,
  channel,
}: ManageChannelModalProp) => {
  // const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    toast.dismiss();
  };
  const [members, setMembers] = useState<ChannelMember[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const setPanel = useUserStore((state) => state.setPanel);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const leaveChannel = () => {
    toast.loading(
      (t) => (
        <span>
          Really leaving?
          <Button
            sx={{ ml: 1 }}
            onClick={() => {
              toast.dismiss(t.id);
              axios
                .delete(`/chat-channel-member/${channel.id}`)
                .then(() => toast(`You left ${channel.chatChannel.name}!`));
              setPanel(undefined);
            }}
          >
            Yes
          </Button>
          <Button onClick={() => toast.dismiss(t.id)}>No</Button>
        </span>
      ),
      {
        icon: <EmojiPeopleSharpIcon color="error" />,
        id: "leaveConfirm",
      },
    );
  };

  useEffect(() => {
    axios
      .get(`/chat-channel-member/${channel.chatChannel.id}/usersInChatChannel`)
      .then((res) => setMembers(res.data))
      .catch((err) => console.log(err));
  }, [open]);

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
          height: "70vh",
          bgcolor: "background.default",
          borderRadius: 2,
          boxShadow: 24,
          py: 2,
          px: 4,
          overflow: "auto",
        }}
      >
        <Typography variant="h6" sx={{ display: "inline-block" }}>
          {channel.chatChannel.name}
        </Typography>
        <Tooltip title="Bye bye">
          <IconButton
            color="error"
            sx={{ float: "right" }}
            onClick={leaveChannel}
          >
            <EmojiPeopleSharpIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h6" paddingTop={3}>
          Manage channel
        </Typography>
        {/* <Typography paddingTop={1}>Set a channel name</Typography> */}
        {/* <FormControl sx={{ my: 1 }} variant="outlined" size="small" fullWidth>
          <InputLabel htmlFor="outlined-adornment-password">
            New password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="New password"
          />
        </FormControl> */}

        <TextField
          id="input-with-icon-textfield"
          label="New password"
          type={showPassword ? "text" : "password"}
          sx={{ my: 2 }}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="small"
        />

        <Button color="secondary" variant="contained" fullWidth>
          Change password
        </Button>

        <Typography variant="h6" marginTop={3} marginBottom={1}>
          Channel members
        </Typography>
        {members.map((member, i) => (
          <MemberListItem
            member={member}
            chatChannel={channel.chatChannel}
            setMembers={() => {
              setMembers((previous) => [
                ...previous.filter((m) => {
                  return m.user.id != member.user.id;
                }),
              ]);
            }}
            key={i}
          />
        ))}
      </Box>
    </Modal>
  );
};

export default ManageChannelModal;
