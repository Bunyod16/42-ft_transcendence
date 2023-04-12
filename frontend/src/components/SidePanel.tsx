// import { Widgets } from "@mui/icons-material";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Button,
  SxProps,
} from "@mui/material";
import React, { useState } from "react";
import Channels from "./SidePanel/Channels";
import Friends from "./SidePanel/Friends";
import Image from "next/image";
import CircleIcon from "@mui/icons-material/Circle";
/**
 * State to track
 * - Whether in chat room or not
 *    - if in chat room TopPanel display user details
 *    - if not in chat room display socials
 */

// interface SidePanelProps {
//   isChat?: boolean;
// }

interface generalTabProps {
  tabs: TabTypes;
  setTabs: React.Dispatch<React.SetStateAction<TabTypes>>;
}

type TabTypes = "friends" | "channels";

const StyleImage = {
  borderRadius: "50px",
  margin: "0 25px",
};

function GeneralTab({ tabs, setTabs }: generalTabProps) {
  return (
    <>
      <Box
        component="div"
        sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
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
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: tabs === "channels" ? "end" : "start",
          gap: "10px",
          width: "100%",
          height: "calc(100vh - 105px)",
          border: "2px solid red",
        }}
      >
        {tabs === "channels" ? <Channels /> : <Friends />}
      </Box>
    </>
  );
}

function FriendTab() {
  return (
    <Box
      component="div"
      sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
        }}
      >
        <Image
          src="/jakoh_smol.jpg"
          width="80"
          height="80"
          style={StyleImage}
          alt="profile pic"
        />
        <Box
          component="div"
          sx={{
            ml: "25px",
          }}
        >
          <Typography variant="h4">Boyeeeeee</Typography>
          <Box component="div">
            <Button
              variant="outlined"
              sx={{ color: "white", border: "1px solid #93032E", mr: "5px" }}
            >
              Profile
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "white", border: "1px solid #93032E" }}
            >
              Invite
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        component="div"
        sx={{
          ml: "15px",
        }}
      >
        <Button>
          <CircleIcon
            sx={{
              fill: "green",
              mr: "12px",
              width: "12px",
              height: "12px",
            }}
          />
          <Typography sx={{ color: "white" }}>Online</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default function SidePanel(sx: SxProps) {
  const [tabs, setTabs] = useState<TabTypes>("friends");
  const [chat, setChat] = useState<string>("a");

  return (
    <Box component="div" sx={{ minWidth: "350px", width: "25%", ...sx }}>
      {chat === "" ? (
        <GeneralTab tabs={tabs} setTabs={setTabs} />
      ) : (
        <FriendTab />
      )}
    </Box>
  );
}
