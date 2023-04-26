import { Box, Typography, TextField } from "@mui/material";
import React, { useState } from "react";
import { ChatType } from "./DirectChat";
import { FriendType } from "@/store/friendsStore";
interface ChatBoxProps {
  chats: ChatType[];
  setChats: React.Dispatch<React.SetStateAction<[] | ChatType[]>>;
  nickName?: string;
  height: string;
}

export default function ChatBox({
  chats,
  setChats,
  nickName,
  height,
}: ChatBoxProps) {
  const [message, setMessage] = useState<string>("");

  function handleMessageSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (message === "") return;
    setChats((prevState: ChatType[]) => [
      ...prevState,
      { text: message, sender: { nickName: nickName || "Unknown User" } },
    ]);
    setMessage("");
  }
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          overflow: "scroll",
          overflowX: "hidden",
          // height: "100%",
        }}
      >
        {chats
          .map((chat, i) => (
            <Box
              component="div"
              sx={{
                padding: "10px",
                border: "2px solid #11AAAA",
                borderRadius: "8px",
                margin: "10px",
                wordWrap: "break-word",
              }}
              key={i}
            >
              <Typography
                sx={{ fontSize: "14px" }}
              >{`${chat.sender.nickName}:`}</Typography>
              <Typography sx={{ fontSize: "14px", ml: "4px" }}>
                {chat.text}
              </Typography>
            </Box>
          ))
          .reverse()}
      </Box>

      {/* Textbox input here */}
      <Box component="div" sx={{ width: "100%", height: "56px" }}>
        <form onSubmit={handleMessageSubmit}>
          <TextField
            variant="outlined"
            placeholder="Type Here Bishhh..."
            autoComplete="off"
            onChange={(event) => setMessage(event.target.value)}
            value={message}
            sx={{
              width: "100%",
              color: "#FEFEFE",
              "&::placeholder": { color: "#FEFEFE" },
              border: "1px solid #FEFEFE",
            }}
          />
        </form>
      </Box>
    </Box>
  );
}
