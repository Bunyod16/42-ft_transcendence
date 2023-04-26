import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircleIcon from "@mui/icons-material/Circle";
import ChatBox from "./ChatBox";
import { useEffect, useState } from "react";
import { chatSocket } from "../socket/socket";
import { FriendType } from "@/store/friendsStore";
import axios from "axios";
const StyleImage = {
  borderRadius: "50px",
  margin: "0 25px",
};

interface DirectChatPropsType {
  panel: FriendType | undefined;
  setPanel: React.Dispatch<React.SetStateAction<FriendType | undefined>>;
}

export interface ChatType {
  id?: number;
  createdAt?: Date;
  text: string;
  sender: {
    id?: number;
    nickName: string;
  };
}

export default function DirectChat({ panel, setPanel }: DirectChatPropsType) {
  const chatLineOffset = 100;
  const [chats, setChats] = useState<ChatType[] | []>([]);
  useEffect(() => {
    if (panel === undefined) return;
    axios
      .get(`/chat-line/getNextChatLines/90?chatLineOffset=${chatLineOffset}`)
      .then((response) => {
        setChats(response.data);
      });
    function handleDirectMessage() {
      chatSocket.emit("joinRoomDirectMessage", {
        channelId: panel?.directMessage?.chatChannel?.id || -1,
      });
    }
    handleDirectMessage();
  }, [panel]);

  // useEffect(() => {
  //   // listenToSomethingSoPeepoCanSendMeSomething
  // }, []);

  return (
    <Box
      component="div"
      sx={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        height: "100%",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          padding: "10px",
          flexDirection: "row",
        }}
      >
        <Button
          sx={{ m: "auto", p: "auto", w: "8px", h: "8px" }}
          onClick={() => setPanel(undefined)}
        >
          <ArrowBackIcon sx={{ m: 0, p: 0, fill: "white" }} />
        </Button>
        <Image
          src="/jakoh_smol.jpg"
          width="80"
          height="80"
          style={StyleImage}
          alt="profile pic"
        />
        <Box component="div">
          <Typography variant="h4">{panel?.nickName}</Typography>
          <Box component="div">
            <Button
              variant="outlined"
              sx={{ color: "white", border: "1px solid #93032E", mr: "5px" }}
              onClick={() => console.log("Havent Connect Profile Page")}
            >
              Profile
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "white", border: "1px solid #93032E" }}
              onClick={() => console.log("Havent Connect Send Invite")}
            >
              Invite
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        component="div"
        sx={{
          ml: "15px",
        }}
      >
        <Button>
          <CircleIcon
            sx={{
              fill: panel?.online ? "green" : "red",
              mr: "12px",
              width: "12px",
              height: "12px",
            }}
          />
          <Typography sx={{ color: "white" }}>
            {panel?.online ? "Online" : "Offline"}
          </Typography>
        </Button>
      </Box>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          gap: "10px",
          width: "100%",
          height: "calc(100vh - 140px)",
          border: "1px solid #048BA8",
        }}
      >
        <ChatBox
          chats={chats}
          setChats={setChats}
          nickName={panel?.nickName}
          height="100%"
        />
      </Box>
    </Box>
  );
}
