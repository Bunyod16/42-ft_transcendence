import { Avatar, Box, TextField, Typography } from "@mui/material";
// import { ChatType } from "./DirectChat";
import { useEffect, useRef, useState } from "react";
import { chatSocket } from "../../socket/socket";
import useUserStore from "@/store/userStore";
import axios from "axios";
import { ChannelMember, FriendType } from "@/types/social-type";
// import { button, useControls } from "leva";

interface ChatBoxProps {
  chatChannelId: number;
  // members?: FriendType[];
}

interface ChatType {
  id?: number;
  createdAt?: Date;
  text: string;
  sender: {
    id?: number;
    nickName: string;
  };
}

export default function ChatBox({ chatChannelId }: ChatBoxProps) {
  const [message, setMessage] = useState<string>("");
  const [chats, setChats] = useState<ChatType[]>([]);
  const listInnerRef = useRef<HTMLDivElement>();
  const [isLoading, setIsLoading] = useState(false);
  const prevHeight = useRef(0);
  const [channelMembers, setChannelMembers] = useState<ChannelMember[]>([]);

  useEffect(() => {
    function onChatMessage(data: {
      text: string;
      sender: { id: number; nickName: string };
    }) {
      setChats((prev: ChatType[]) => [data, ...prev]);
    }

    chatSocket.on("chatMessage", onChatMessage);

    return () => {
      chatSocket.off("chatMessage", onChatMessage);
    };
  }, []);

  useEffect(() => {
    // axios.get();
    axios
      .get(`/chat-channel-member/${chatChannelId}/usersInChatChannel`)
      .then((res) => setChannelMembers([...res.data]))
      .catch((err) => console.log(err.response));
  }, [chatChannelId]);

  useEffect(() => {
    if (chatChannelId === -1) return;
    axios
      .get(`/chat-line/getNextChatLines/${chatChannelId}?chatLineOffset=0`)
      .then((response) => {
        const newChats: ChatType[] = response.data;
        setChats(newChats);
      });

    chatSocket.emit("joinRoom", {
      chatChannelId: chatChannelId,
    });
  }, [chatChannelId]);

  function handleMessageSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (message === "") return;
    chatSocket.emit("sendMessage", {
      message: message,
      chatChannelId: chatChannelId,
    });
    setMessage("");
  }

  const handleScroll = async () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (Math.round(scrollHeight + scrollTop) - 1 <= clientHeight) {
        if (isLoading) return;
        setIsLoading(true);

        const res = await axios.get(
          `/chat-line/getNextChatLines/${chatChannelId}?chatLineOffset=${chats.length}`,
        );

        const newChats: ChatType[] = res.data;
        setChats((prev) => [...prev, ...newChats]);

        const destination =
          prevHeight.current === 0
            ? (clientHeight - 100) * -1
            : (prevHeight.current - 10) * -1;
        listInnerRef.current.scrollTop = destination;
        prevHeight.current = scrollHeight;
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          overflow: "auto",
          flex: 1,
          p: 1,
        }}
        ref={listInnerRef}
        onScroll={handleScroll}
      >
        {chats.map((chat, i) => {
          const avatar =
            channelMembers.find((member) => member.user.id === chat.sender.id)
              ?.user.avatar || "notihing";
          return (
            <Box
              component="div"
              sx={{
                mb: 1,
                wordWrap: "break-word",
                position: "relative",
                // textAlign: chat.sender.nickName !== nickName ? "left" : "right",
              }}
              key={i}
            >
              <Avatar
                sx={{ width: 24, height: 24, position: "absolute", top: 8 }}
                src={avatar}
              />
              {/* {(chats[i !== 0 ? i - 1 : i].sender.nickName !=
              chat.sender.nickName ||
              i === 0) && ( */}
              <Typography
                sx={{
                  color: "gray",
                  ml: 4,
                }}
              >
                {`${chat.sender.nickName}`}
              </Typography>
              {/* )} */}
              <Typography sx={{ lineHeight: 1, ml: 4 }}>{chat.text}</Typography>
            </Box>
          );
        })}
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
