import { Box, Typography, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ChatType } from "./DirectChat";
import { chatSocket } from "../socket/socket";
interface ChatBoxProps {
  chats: ChatType[];
  setChats: React.Dispatch<React.SetStateAction<[] | ChatType[]>>;
  nickName?: string;
}
export default function ChatBox({ chats, setChats, nickName }: ChatBoxProps) {
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

  return (
    // <Box
    //   component="div"
    //   sx={{
    //     display: "flex",
    //     flexDirection: "column",
    //     justifyContent: "end",
    //     height: "100%",
    //     overflow: "hidden",
    //   }}
    // >
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column-reverse",
        overflow: "scroll",
        overflowX: "hidden",
        height: "100%",
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
              mb: "2px",
              wordWrap: "break-word",
              // textAlign:
            }}
            key={i}
          >
            <Typography
              sx={{ color: "gray" }}
            >{`${chat.sender.nickName}`}</Typography>
            <Typography sx={{ lineHeight: 1 }}>{chat.text}</Typography>
          </Box>
        ))
        .reverse()}
    </Box>
    // </Box>
  );
}
