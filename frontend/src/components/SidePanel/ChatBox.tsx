import { Box, TextField, Typography } from "@mui/material";
import { ChatType } from "./DirectChat";
import { useState } from "react";
import { chatSocket } from "../socket/socket";
import useUserStore from "@/store/userStore";
interface ChatBoxProps {
  chats: ChatType[];
  setChats: React.Dispatch<React.SetStateAction<[] | ChatType[]>>;
  // nickName?: string;
  chatChannelId: number;
}
export default function ChatBox({
  chats,
  setChats,
  // nickName,
  chatChannelId,
}: ChatBoxProps) {
  const [message, setMessage] = useState<string>("");
  const nickName = useUserStore((state) => state.nickName);

  // function handleMessageSubmit(e: React.SyntheticEvent) {
  //   e.preventDefault();
  //   if (message === "") return;
  //   setChats((prevState: ChatType[]) => [
  //     ...prevState,
  //     { text: message, sender: { nickName: nickName || "Unknown Usepr" } },
  //   ]);

  //   chatSocket.emit("sendMessage", { message:message, chatChannelId:  });
  //   setMessage("");
  // }

  function handleMessageSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (message === "") return;
    // setChats((prevState: ChatType[]) => [
    //   ...prevState,
    //   {
    //     text: message,
    //     sender: { nickName: panel?.nickName || "Unknown User" },
    //   },
    // ]);
    // if (panel === undefined || panel.directMessage === null) return;
    chatSocket.emit("sendMessage", {
      message: message,
      chatChannelId: chatChannelId,
    });
    setMessage("");
  }

  return (
    <>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          overflow: "auto",
          // overflowX: "hidden",
          // height: "100%",
          flex: 1,
          p: 1,
        }}
      >
        {chats
          .map((chat, i) => (
            <Box
              component="div"
              sx={{
                // padding: "10px",
                // border: "2px solid #11AAAA",
                // borderRadius: "8px",
                // margin: "10px",
                // padding: 1,
                mb: 1,
                wordWrap: "break-word",
                textAlign: chat.sender.nickName !== nickName ? "left" : "right",
              }}
              key={i}
            >
              {chats[i ? i - 1 : i].sender.nickName != chat.sender.nickName && (
                <Typography
                  sx={{
                    color: "gray",
                    // textAlign:
                    //   chat.sender.nickName === nickName ? "left" : "right",
                  }}
                >{`${chat.sender.nickName}`}</Typography>
              )}
              <Typography sx={{ lineHeight: 1 }}>{chat.text}</Typography>
            </Box>
          ))
          .reverse()}
      </Box>

      {/* Textbox input here */}
      {/* <Box component="div" sx={{ width: "100%", height: "56px" }}> */}
      <form onSubmit={handleMessageSubmit}>
        <TextField
          variant="outlined"
          placeholder="message..."
          autoComplete="off"
          onChange={(event) => setMessage(event.target.value)}
          value={message}
          sx={{
            height: 56,
            width: "100%",
            color: "#FEFEFE",
            "&::placeholder": { color: "#FEFEFE" },
          }}
        />
      </form>
      {/* </Box> */}
    </>
  );
}
