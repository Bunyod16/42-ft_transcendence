import { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";

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

  function handleMessageSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setChats((prevState) => [...prevState, message]);
    setMessage("");
  }
  return (
    <Box>
      <Box>
        {chats.map((x, i) => (
          <Typography
            sx={{
              padding: "10px",
              border: "2px solid #11AAAA",
              borderRadius: "8px",
              margin: "10px",
            }}
            key={i}
          >
            {x}
          </Typography>
        ))}
      </Box>
      <Box sx={{ width: "100%" }}>
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
