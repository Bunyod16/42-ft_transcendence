import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircleIcon from "@mui/icons-material/Circle";
import ChatBox from "./ChatBox";
import { useEffect, useState } from "react";
// import { chatSocket } from "../socket/socket";
import axios from "axios";
import { ChannelMember, PanelData, UserInfo } from "@/types/social-type";
import PersonOffSharpIcon from "@mui/icons-material/PersonOffSharp";
import ManageChannelModal from "../modal/ManageChannelModal";
import useUserStore from "@/store/userStore";

export interface ChatType {
  id?: number;
  createdAt?: Date;
  text: string;
  sender: {
    id?: number;
    nickName: string;
  };
}

interface StatusBarProps {
  online: boolean;
}
const StatusBar = ({ online }: StatusBarProps) => {
  return (
    <Box component="div">
      <Typography
        sx={{
          fontSize: 14,
          color: "#F2F4F370",
          display: "inline-block",
        }}
      >
        <CircleIcon
          sx={{
            fill: online ? "green" : "crimson",
            // width: "12px",
            // height: "12px",
            fontSize: 10,
            mr: 0.8,
          }}
        />
        {online ? "Online" : "Offline"}
      </Typography>
    </Box>
  );
};

interface TopBarProps {
  panel: PanelData;
  handleBack: () => void;
}
const TopBar = ({ panel, handleBack }: TopBarProps) => {
  const FriendDetail = () => {
    const setPanel = useUserStore((state) => state.setPanel);
    const handleBlockFriend = () => {
      axios.patch("/friend-request/updateByFriendId", {
        friendId: panel.friendInfo?.id,
        friendStatus: "blocked",
      });
      setPanel(undefined);
    };

    return (
      <>
        <Box
          component="div"
          sx={{ display: "flex", mb: 1, alignItems: "center" }}
        >
          <Button
            variant="outlined"
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              cursor: "pointer",
              color: "text.primary",
              borderRadius: 2,
              flex: 1,
              mr: 1,
            }}
            onClick={() => console.log("show friend")}
          >
            <Avatar
              src={panel.friendInfo?.avatar}
              sx={{ width: 40, height: 40, mr: 1, float: "left" }}
              alt="profile pic"
            />
            <Box component={"div"} sx={{ flex: 1 }}>
              <Typography variant="h6">{panel.friendInfo?.nickName}</Typography>
              <StatusBar online={panel.friendInfo?.online || false} />
            </Box>
            {/* TODO add block friend here!! */}
          </Button>
          <IconButton
            sx={{ color: "#EF9A9A50" }}
            size="small"
            onClick={handleBlockFriend}
          >
            <PersonOffSharpIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Button
          fullWidth
          sx={{
            color: "white",
            border: "2px solid #F2F4F3",
          }}
          onClick={() => console.log("Havent Connect Send Invite")}
          size="small"
        >
          Invite
        </Button>
      </>
    );
  };

  // interface ChannelInfo {
  //   // owner?: UserInfo;
  //   members?: ChannelMember[];
  // }
  const ChannelDetail = () => {
    const [open, setOpen] = useState(false);

    return (
      <Box component={"div"} sx={{ p: 1 }}>
        <Typography variant="h6" sx={{ display: "inline-block" }}>
          {panel.chatChannel.chatChannel.name}
        </Typography>

        {/* {panel.chatChannel.isAdmin && ( */}
        <Button
          fullWidth
          sx={{
            color: "white",
            border: "2px solid #F2F4F3",
            mt: 2,
          }}
          onClick={() => setOpen(true)}
          size="small"
        >
          Manage Channel
        </Button>
        {/* )} */}
        <ManageChannelModal
          open={open}
          setOpen={setOpen}
          channel={panel.chatChannel}
        />
      </Box>
    );
  };

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "start",
        p: "6px 6px 6px 0px",
        borderBottom: "1px black solid",
      }}
    >
      <IconButton onClick={handleBack}>
        <ArrowBackIcon sx={{ fill: "white" }} />
      </IconButton>
      <Box
        component="div"
        sx={{
          display: "flex",
          // padding: "10px",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {panel.chatChannel.chatChannel.chatType === "direct_message" ? (
          <FriendDetail />
        ) : (
          <ChannelDetail />
        )}
      </Box>
    </Box>
  );
};

export default function DirectChat() {
  // const chatLineOffset = 100;
  const [panel, setPanel] = useUserStore((state) => [
    state.panel,
    state.setPanel,
  ]);

  if (panel === undefined) return <></>;
  return (
    <Box
      component="div"
      sx={{
        // borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {
        /* top part */
        panel && (
          <>
            <TopBar panel={panel} handleBack={() => setPanel(undefined)} />
            <ChatBox chatChannelId={panel.chatChannel.chatChannel.id || -1} />
          </>
        )
      }
    </Box>
  );
}