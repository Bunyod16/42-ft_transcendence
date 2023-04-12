import { Box, Typography, TextField } from "@mui/material";
import { useState } from "react";

interface chatType {
  user: string;
  message: string;
}

export default function ChatBox({ height }: { height: string }) {
  const [chats, setChats] = useState<chatType[]>([]);
  const [message, setMessage] = useState<string>("");

  function handleMessageSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const user = "Jakoh";
    if (message === "") return;
    setChats((prevState: chatType[]) => [...prevState, { user, message }]);
    setMessage("");
  }
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
        height: { height },
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
            <Typography sx={{ fontSize: "14px" }}>{`${x.user}:`}</Typography>
            <Typography sx={{ fontSize: "14px", ml: "4px" }}>
              {x.message}
            </Typography>
          </Box>
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
  );
}
