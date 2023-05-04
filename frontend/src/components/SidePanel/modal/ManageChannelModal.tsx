import { Channel, ChannelMember, ChatChannel } from "@/types/social-type";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Avatar,
} from "@mui/material";
import { useState, useEffect } from "react";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import BlockSharpIcon from "@mui/icons-material/BlockSharp";
import VolumeOffSharpIcon from "@mui/icons-material/VolumeOffSharp";
import EmojiPeopleSharpIcon from "@mui/icons-material/EmojiPeopleSharp";
import dayjs, { Dayjs } from "dayjs";
import GrassSharpIcon from "@mui/icons-material/GrassSharp";
import LocalFireDepartmentSharpIcon from "@mui/icons-material/LocalFireDepartmentSharp";
import axios from "../../apiClient/apiClient";
import { toast } from "react-hot-toast";
import useUserStore from "@/store/userStore";
import MuteDateModal from "./MuteDateModal";
import useConfirmToast from "@/hooks/useConfirmToast";

interface MemberListItemProps {
  member: ChannelMember;
  chatChannel: ChatChannel;
  // showDateModal: boolean;
  // setShowDateModal: Dispatch<SetStateAction<boolean>>;
  setMembers: () => void;
  ownerId: number;
  isAdmin: boolean;
}

const MemberListItem = ({
  member,
  ownerId,
  isAdmin,
  chatChannel,
  // showDateModal,
  // setShowDateModal,
  setMembers,
}: MemberListItemProps) => {
  const [isBlacklisted, setIsBlacklisted] = useState<boolean>(
    member.isBlacklisted,
  );
  const [isMuted, setIsMuted] = useState<boolean>(
    member.mutedUntil ? true : false,
  );
  const [showDateModal, setShowDateModal] = useState<boolean>(false);
  const [muteDate, setMuteDate] = useState<Dayjs>(
    dayjs(member.mutedUntil) || dayjs(),
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

  const handleUnmute = () => {
    axios
      .patch(`chat-channel-member/${member.id}/unmute`, {
        chatChannelId: chatChannel.id,
      })
      .then(() => {
        toast.success(`Member ${member.user.nickName} has been unmuted.`);
        console.log(`Member ${member.user.nickName} has been unmuted`);
        setIsMuted(false);
      })
      .catch((err) => {
        console.log(err?.response);
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
          <Typography
            marginRight={1}
            sx={{
              color: isBlacklisted ? "text.secondary" : "text.primary",
              textDecoration: isBlacklisted ? "line-through" : "none",
            }}
          >
            {member.user.nickName}
          </Typography>
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
            <Tooltip
              title={
                isMuted
                  ? `Unmute. ${"\n"}Muted Until ${muteDate.toDate()}`
                  : "Mute"
              }
              followCursor
            >
              <IconButton
                size="small"
                sx={{ ml: 1 }}
                color={!isMuted ? "default" : "error"}
                onClick={() => {
                  if (isMuted) {
                    confirmToast("unmute", handleUnmute);
                  } else {
                    setShowDateModal(true);
                  }
                }}
              >
                <MuteDateModal
                  showDateModal={showDateModal}
                  setShowDateModal={setShowDateModal}
                  muteDate={muteDate}
                  setMuteDate={setMuteDate}
                  member={member}
                  chatChannel={chatChannel}
                  setIsMuted={setIsMuted}
                />
                <VolumeOffSharpIcon
                  fontSize="inherit"
                  color={!isMuted ? "inherit" : "error"}
                />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={!isBlacklisted ? "Blacklist" : "Unblacklist"}
              followCursor
            >
              <IconButton
                size="small"
                sx={{ ml: 1 }}
                color={!isBlacklisted ? "default" : "error"}
                onClick={() =>
                  confirmToast(
                    !isBlacklisted ? "blacklist" : "unblacklist",
                    handleBlacklist,
                  )
                }
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
  const { confirmToast } = useConfirmToast();

  const handleLeaveChannel = () => {
              axios
                .delete(`/chat-channel-member/${channel.id}`)
                .then(() => toast(`You left ${channel.chatChannel.name}!`));
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 400) {
          let message: string = err.response.data.message;
          message = message.slice(message.indexOf(":") + 1, message.length);
          toast.error(`${message}`);
        }
      });
              setPanel(undefined);
  };

  useEffect(() => {
    axios
      .get(`/chat-channel-member/${channel.chatChannel.id}/usersInChatChannel`)
      .then((res) => setMembers(res.data))
      .catch((err) => console.log(err));
  }, [open]);

  // console.log(showDateModal);
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
            onClick={() =>
              confirmToast(
                `leave ${channel.chatChannel.name}`,
                handleLeaveChannel,
              )
            }
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
            chatChannel={channel.chatChannel}
            // showDateModal={showDateModal}
            // setShowDateModal={setShowDateModal}
            setMembers={() => {
              setMembers((previous) => [
                ...previous.filter((m) => {
                  return m.user.id != member.user.id;
                }),
              ]);
            }}
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
