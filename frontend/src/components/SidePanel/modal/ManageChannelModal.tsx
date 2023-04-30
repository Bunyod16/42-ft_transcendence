import { Channel, ChannelMember, UserInfo } from "@/types/social-type";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import BlockSharpIcon from "@mui/icons-material/BlockSharp";
import VolumeOffSharpIcon from "@mui/icons-material/VolumeOffSharp";
import EmojiPeopleSharpIcon from "@mui/icons-material/EmojiPeopleSharp";

import axios from "axios";
import { toast } from "react-hot-toast";
import useUserStore from "@/store/userStore";

interface MemberListItemProps {
  member: ChannelMember;
}
const MemberListItem = ({ member }: MemberListItemProps) => {
  const handleKick = (member: UserInfo) => {
    axios.delete(`/chat-channel-member/${member.id}`).then;
  };

  const handleBan = () => {
    console.log("ban");
  };

  const handleMute = () => {
    console.log("mute");
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        disableTouchRipple
        sx={{ borderRadius: 1, cursor: "default" }}
      >
        {/* <ListItemAvatar> */}
        <Avatar
          src={member.user.avatar}
          sx={{ width: 24, height: 24, mr: 2 }}
        />
        {/* </ListItemAvatar> */}

        <ListItemText primary={member.user.nickName} />

        <Tooltip title="Kick" followCursor>
          <IconButton size="small" sx={{ ml: 1 }}>
            <DeleteSharpIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Ban" followCursor>
          <IconButton size="small" sx={{ ml: 1 }}>
            <BlockSharpIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Mute" followCursor>
          <IconButton size="small" sx={{ ml: 1 }}>
            <VolumeOffSharpIcon fontSize="inherit" />
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
  }, []);

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
        <FormControl
          sx={{ my: 1 }}
          variant="outlined"
          size="small"
          color="secondary"
          fullWidth
        >
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
        </FormControl>
        <Button color="secondary" variant="contained" fullWidth>
          Change password
        </Button>

        <Typography variant="h6" marginTop={2} marginBottom={1}>
          Channel members
        </Typography>
        {members.map((member, i) => (
          <MemberListItem member={member} key={i} />
        ))}
      </Box>
    </Modal>
  );
};

export default ManageChannelModal;
