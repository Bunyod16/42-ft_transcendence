import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
} from "@mui/material";
// import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircleIcon from "@mui/icons-material/Circle";
import ChatBox from "./ChatBox";
import { useEffect, useState } from "react";
import { chatSocket } from "../socket/socket";
import { FriendType } from "@/store/friendsStore";
import axios from "axios";

export interface ChatType {
  id?: number;
  createdAt?: Date;
  text: string;
  sender: {
    id?: number;
    nickName: string;
  };
}

interface TopBarProps {
  panel: FriendType;
  handleBack: () => void;
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

const TopBar = ({ panel, handleBack }: TopBarProps) => {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        // padding: "10px",
        flexDirection: "row",
        alignItems: "center",
        p: 1,
        borderBottom: "1px black solid",
      }}
    >
      <IconButton
        // sx={{ m: "auto", p: "auto", w: "8px", h: "8px" }}
        onClick={handleBack}
        sx={{ display: "inline-block" }}
      >
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
        <Box
          component={"div"}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            p: 1,
            cursor: "pointer",
          }}
          onClick={() => console.log("show friend")}
        >
          <Avatar
            src="/jakoh_smol.jpg"
            sx={{ width: 50, height: 50, mr: 2, float: "left" }}
            alt="profile pic"
          />
          <Box component={"div"}>
            <Typography variant="h6">{panel.nickName}</Typography>
            <StatusBar online={panel.online} />
          </Box>
          {/* TODO add block friend here!! */}
        </Box>

        {/* <Button
                  color="secondary"
                  sx={{ color: "white", border: "2px solid #F2F4F3", mr: 2 }}
                  size="small"
                  onClick={() => console.log("Havent Connect Profile Page")}
                >
                  Profile
                </Button> */}
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
      </Box>
    </Box>
  );
};

interface DirectChatPropsType {
  panel: FriendType;
  setPanel: React.Dispatch<React.SetStateAction<FriendType | undefined>>;
}
export default function DirectChat({ panel, setPanel }: DirectChatPropsType) {
  // const chatLineOffset = 100;
  const [chats, setChats] = useState<ChatType[]>([]);
  // const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (panel === undefined) return;
    axios
      .get(
        `/chat-line/getNextChatLines/${panel.directMessage?.chatChannel.id}?chatLineOffset=${chats.length}`,
      )
      .then((response) => {
        const newChats: ChatType[] = response.data;
        setChats(newChats.reverse());
      });
    function getDirectMessage() {
      if (panel === undefined) return;
      chatSocket.emit("joinRoomDirectMessage", {
        chatChannelId: panel.directMessage?.chatChannel.id || -1,
      });
    }
    getDirectMessage();
  }, [panel]);

  useEffect(() => {
    function onChatMessage(data: {
      text: string;
      sender: { id: number; nickName: string };
    }) {
      setChats((prev: ChatType[]) => [...prev, data]);
    }

    chatSocket.on("chatMessage", onChatMessage);

    return () => {
      chatSocket.off("chatMessage", onChatMessage);
    };
  }, []);

  // useEffect(() => {
  //   // listenToSomethingSoPeepoCanSendMeSomething
  // }, []);
  // if (panel) return <></>;

  // function handleMessageSubmit(e: React.SyntheticEvent) {
  //   e.preventDefault();
  //   if (message === "") return;
  //   // setChats((prevState: ChatType[]) => [
  //   //   ...prevState,
  //   //   {
  //   //     text: message,
  //   //     sender: { nickName: panel?.nickName || "Unknown User" },
  //   //   },
  //   // ]);
  //   if (panel === undefined || panel.directMessage === null) return;
  //   chatSocket.emit("sendMessage", {
  //     message: message,
  //     chatChannelId: panel.directMessage.chatChannel.id,
  //   });
  //   setMessage("");
  // }

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
        panel && <TopBar panel={panel} handleBack={() => setPanel(undefined)} />
      }

      {/* <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          gap: "10px",
          width: "100%",
          height: "100%",
          // height: "calc(100vh - 140px)",
          border: "1px solid #048BA8",
        }}
      > */}
      <ChatBox
        chats={chats}
        setChats={setChats}
        nickName={panel?.nickName}
        chatChannelId={panel.directMessage.chatChannel.id}
        // height="100%"
      />

      {/* </Box> */}
    </Box>
  );
}
