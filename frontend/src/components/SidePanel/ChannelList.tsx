import { useState, useEffect } from "react";
import { Box, Button, ToggleButtonGroup, ToggleButton } from "@mui/material";
import ChatBox from "./ChatBox";
/**
 * Chat Data Array of =
 * {
 * 	user: string,
 * 	message: string,
 * 	time?: UDT | string
 * }
 *
 * Need to add channel list on top
 */

export default function ChannelList() {
  const [chats, setChats] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [channels, setChannels] = useState<string[]>([]);
  const [curChannel, setCurChannel] = useState<string>("");

  function handleMessageSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (message === "") return;
    setChats((prevState) => [...prevState, message]);
    setMessage("");
  }

  function handleChannel() {
    const channel: string = prompt("Enter Channel Name") || "";
    if (channel === "" || channels.includes(channel) || channel.length > 80)
      alert("Fail to create channel!");
    else {
      setChannels((prevState) => [...prevState, channel]);
    }
  }

  return (
    <Box
      component="div"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        component="div"
        sx={{
          height: "50%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button
          sx={{
            width: "100%",
            height: "56px",
            border: "2px solid #fefefe",
          }}
          onClick={handleChannel}
        >
          Add Channel
        </Button>
        <ToggleButtonGroup
          exclusive
          value={curChannel}
          onChange={(_event, value) => setCurChannel(value)}
          fullWidth
          sx={{
            overflow: "scroll",
            overflowX: "hidden",
            display: "Flex",
            flexDirection: "column",
          }}
        >
          {channels.map((channel, i) => (
            <ToggleButton
              key={i}
              sx={{
                padding: "10px",
                border: "2px solid red",
                borderRadius: "8px",
                margin: "10px",
                wordWrap: "break-word",
                color: "white",
              }}
              value={channel}
              disabled={curChannel === channel}
              fullWidth
            >
              {channel}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <ChatBox height="50%" />
    </Box>
  );
}
