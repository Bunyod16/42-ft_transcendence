import { Channel, ChannelMember, UserInfo } from "@/types/social-type";
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
import { use, useEffect, useState } from "react";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import BlockSharpIcon from "@mui/icons-material/BlockSharp";
import VolumeOffSharpIcon from "@mui/icons-material/VolumeOffSharp";
import EmojiPeopleSharpIcon from "@mui/icons-material/EmojiPeopleSharp";
import GrassSharpIcon from "@mui/icons-material/GrassSharp";
import LocalFireDepartmentSharpIcon from "@mui/icons-material/LocalFireDepartmentSharp";
import axios from "../../apiClient/apiClient";
import { toast } from "react-hot-toast";
import useUserStore from "@/store/userStore";
import OwnerAccordian from "./OwnerAccordian";

interface MemberListItemProps {
  member: ChannelMember;
  ownerId: number;
  isAdmin: boolean;
}
const MemberListItem = ({ member, ownerId, isAdmin }: MemberListItemProps) => {
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
      <ListItemButton disableTouchRipple sx={{ cursor: "default" }}>
        {/* <ListItemAvatar> */}

        <Avatar
          src={member.user.avatar}
          sx={{ width: 24, height: 24, mr: 1 }}
        />
        {/* </ListItemAvatar> */}

        <ListItemText
          disableTypography
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography marginRight={1}>{member.user.nickName}</Typography>
          {ownerId === member.user.id ? (
            <LocalFireDepartmentSharpIcon
              sx={{ fontSize: 20, color: "#FDDA0D" }}
            />
          ) : (
            member.isAdmin && (
              <GrassSharpIcon color="secondary" sx={{ fontSize: 20 }} />
            )
          )}
        </ListItemText>

        {isAdmin && (
          <>
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
          </>
        )}
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
  const setPanel = useUserStore((state) => state.setPanel);

  const id = useUserStore((state) => state.id);
  const [showManage, setShowManage] = useState(false);

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
      .catch((err) => console.log(err.response));
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
        {channel.chatChannel.ownerId.id === id && <></>}

        <Typography variant="h6" marginTop={3} marginBottom={1}>
          Channel members
        </Typography>
        {members.map((member, i) => (
          <MemberListItem
            member={member}
            key={i}
            ownerId={channel.chatChannel.ownerId.id}
            isAdmin={channel.isAdmin}
          />
        ))}
      </Box>
    </Modal>
  );
};

export default ManageChannelModal;
