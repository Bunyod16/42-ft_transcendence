import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
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
const TopBar = ({ panel, handleBack }: TopBarProps) => {
  return (
    <>
      <Box
        component="div"
        sx={{
          display: "flex",
          // padding: "10px",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <IconButton
          // sx={{ m: "auto", p: "auto", w: "8px", h: "8px" }}
          onClick={handleBack}
        >
          <ArrowBackIcon sx={{ fill: "white" }} />
        </IconButton>
        <Avatar
          src="/jakoh_smol.jpg"
          sx={{ width: 50, height: 50, mr: 2 }}
          // width="80"
          // height="80"
          // style={StyleImage}
          alt="profile pic"
        />
        <Box component="div">
          <Typography variant="h4" paddingBottom={1}>
            {panel.nickName}
          </Typography>
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
      <Box component="div">
        {/* <Button> */}
        <CircleIcon
          sx={{
            fill: panel?.online ? "green" : "red",
            mr: "12px",
            width: "12px",
            height: "12px",
          }}
        />
        <Typography sx={{ color: "white", display: "inline-block" }}>
          {panel?.online ? "Online" : "Offline"}
        </Typography>
        {/* </Button> */}
      </Box>
    </>
  );
};

interface DirectChatPropsType {
  panel: FriendType | undefined;
  setPanel: React.Dispatch<React.SetStateAction<FriendType | undefined>>;
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
  // if (panel) return <></>;

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
        height="100%"
      />
      {/* </Box> */}
    </Box>
  );
}
