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
import ChatBox from "./SidePanel/ChatBox";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
  setPanel: React.Dispatch<React.SetStateAction<string>>;
}

type TabTypes = "friends" | "channels";

const StyleImage = {
  borderRadius: "50px",
  margin: "0 25px",
};

function GeneralTab({ tabs, setTabs, setPanel }: generalTabProps) {
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
        {tabs === "channels" ? <Channels /> : <Friends setPanel={setPanel} />}
      </Box>
    </>
  );
}

function FriendTab({
  setPanel,
}: {
  setPanel: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <Box
      component="div"
      sx={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        height: "100%",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          padding: "10px",
          flexDirection: "row",
        }}
      >
        <Button
          sx={{ m: "auto", p: "auto", w: "8px", h: "8px" }}
          onClick={() => setPanel("")}
        >
          <ArrowBackIcon sx={{ m: 0, p: 0, fill: "white" }} />
        </Button>
        <Image
          src="/jakoh_smol.jpg"
          width="80"
          height="80"
          style={StyleImage}
          alt="profile pic"
        />
        <Box component="div">
          <Typography variant="h4">Jakohhhhhh</Typography>
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
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          gap: "10px",
          width: "100%",
          height: "calc(100vh - 140px)",
          border: "1px solid #048BA8",
        }}
      >
        <ChatBox height="100%" />
      </Box>
    </Box>
  );
}

export default function SidePanel(sx: SxProps) {
  const [tabs, setTabs] = useState<TabTypes>("friends");
  const [panel, setPanel] = useState<string>("");

  return (
    <Box component="div" sx={{ minWidth: "350px", width: "25%", ...sx }}>
      {panel === "" ? (
        <GeneralTab tabs={tabs} setTabs={setTabs} setPanel={setPanel} />
      ) : (
        <FriendTab setPanel={setPanel} />
      )}
    </Box>
  );
}
