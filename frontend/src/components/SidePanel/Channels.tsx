import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

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

export default function Channels() {
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
            color: "white",
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
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          height: "50%",
          borderTop: "2px solid pink",
        }}
      >
        <Box
          component="div"
          sx={{
            overflow: "scroll",
            overflowX: "hidden",
          }}
        >
          {chats.map((x, i) => (
            <Typography
              sx={{
                padding: "10px",
                border: "2px solid #11AAAA",
                borderRadius: "8px",
                margin: "10px",
                wordWrap: "break-word",
              }}
              key={i}
            >
              {x}
            </Typography>
          ))}
        </Box>
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
    </Box>
  );
}
