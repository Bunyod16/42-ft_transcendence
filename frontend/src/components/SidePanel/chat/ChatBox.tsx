import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
// import { ChatType } from "./DirectChat";
import { useEffect, useRef, useState } from "react";
import { chatSocket, socket } from "../../socket/socket";
import useUserStore from "@/store/userStore";
import axios from "../../utils/apiClient";
import { ChannelMember, UserInfo } from "@/types/social-type";
import { UserProfile } from "@/types/user-profile-type";
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
  chatLineType?: "message" | "activeinvite";
}

enum FriendStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  BLOCKED = "blocked",
}

interface BlockedUser {
  friend: UserInfo;
  friendRequest: {
    id: number;
    createdAt: Date;
    friendStatus: FriendStatus;
  };
}

export default function ChatBox({ chatChannelId }: ChatBoxProps) {
  const [message, setMessage] = useState<string>("");
  const [chats, setChats] = useState<ChatType[]>([]);
  const listInnerRef = useRef<HTMLDivElement>();
  const [isLoading, setIsLoading] = useState(false);
  const prevHeight = useRef(0);
  const [channelMembers, setChannelMembers] = useState<ChannelMember[]>([]);
  const [blockedFriends, setBlockedFriends] = useState<BlockedUser[]>([]);
  const panel = useUserStore((state) => state.panel);
  const [gameUserProfile, setGameUserProfile] = useState<UserProfile | null>(
    null,
  );

  useEffect(() => {
    axios
      .get("/friend-request/findUserBlockedFriends")
      .then((res) => {
        setBlockedFriends(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    function onChatMessage(data: {
      text: string;
      sender: { id: number; nickName: string };
      chatLineType?: "message" | "activeinvite";
    }) {
      setChats((prev: ChatType[]) => [data, ...prev]);
    }

    function onGameInvite(data: UserProfile) {
      if (panel && data.nickName === panel.friendInfo?.nickName) {
        const newData: ChatType = {
          text: "Accept Game Invite",
          sender: { id: data.id, nickName: data.nickName },
          chatLineType: "activeinvite",
        };
        setChats((prev: ChatType[]) => [newData, ...prev]);
        setGameUserProfile(data);
      }
    }

    chatSocket.on("chatMessage", onChatMessage);
    socket.on("gameInvite", onGameInvite);
    return () => {
      chatSocket.off("chatMessage", onChatMessage);
      socket.off("gameInvite", onGameInvite);
    };
  }, []);

  useEffect(() => {
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
  function handleAcceptInvite() {
    if (gameUserProfile !== null) socket.emit("acceptInvite", gameUserProfile);
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
              ?.user.avatar || "nothing";
          return (
            <Box
              component="div"
              sx={{
                mb: 1,
                wordWrap: "break-word",
                position: "relative",
              }}
              key={i}
            >
              <Avatar
                sx={{ width: 24, height: 24, position: "absolute", top: 8 }}
                src={avatar}
              />
              {chat.chatLineType === "activeinvite" ? (
                <Button
                  sx={{
                    color: "text.primary",
                    ml: 4,
                    alignSelf: "center",
                    backgroundColor: "accent.main",
                    borderRadius: "8px",
                    fontWeight: "700",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "accent.dark",
                    },
                    "&:active": {
                      transform: "scale(0.9)",
                    },
                  }}
                  onClick={handleAcceptInvite}
                >
                  Accept Game Invite
                </Button>
              ) : (
                <>
                  <Typography
                    sx={{
                      color: "gray",
                      ml: 4,
                      textOverflow: "ellipsis",
                    }}
                  >
                    {`${chat.sender.nickName}`}
                  </Typography>
                  {blockedFriends.some(
                    (friend) => friend.friend.id !== chat.sender.id,
                  ) || blockedFriends.length === 0 ? (
                    <Typography sx={{ lineHeight: 1, ml: 4 }}>
                      {chat.text}
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        lineHeight: 1,
                        ml: 4,
                        fontStyle: "italic",
                        color: "text.secondary",
                      }}
                    >
                      You blocked {chat.sender.nickName}
                    </Typography>
                  )}
                </>
              )}
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
