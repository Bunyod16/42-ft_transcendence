// import { Widgets } from "@mui/icons-material";
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import Channels from "./SidePanel/Channels";
import Friends from "./SidePanel/Friends";
/**
 * State to track
 * - Whether in chat room or not
 *    - if in chat room TopPanel display user details
 *    - if not in chat room display socials
 */

interface SidePanelProps {
  isChat?: boolean;
}

type TabTypes = "friends" | "channels";

export default function SidePanel() {
  const [tabs, setTabs] = useState<TabTypes>("friends");
  const [chats, setChats] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  function handleMessageSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setChats((prevState) => [...prevState, message]);
    setMessage("");
  }
  return (
    <Box sx={{ minWidth: "350px", width: "25%" }}>
      <Box sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <Typography variant="h4" sx={{ mb: "12px" }}>
          SOCIAL
        </Typography>
        <ToggleButtonGroup
          value={tabs}
          exclusive
          onChange={(_event, value) => setTabs(value)}
        >
          <ToggleButton
            sx={{ color: "#FEFEFE", border: "none" }}
            value="friends"
            disabled={tabs === "friends"}
          >
            FRIENDS
          </ToggleButton>
          <ToggleButton
            sx={{ color: "#FEFEFE", border: "none" }}
            value="channels"
            disabled={tabs === "channels"}
          >
            CHANNELS
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: tabs === "channels" ? "end" : "start",
          gap: "10px",
          width: "100%",
          height: "calc(100vh - 102px)",
          border: "2px solid red",
        }}
      >
        {tabs === "channels" ? <Channels /> : <Friends />}
      </Box>
    </Box>
  );
}
