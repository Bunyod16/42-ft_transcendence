import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import ChannelList from "./ChannelList";
import FriendList from "./FriendList";
import { TabTypes } from "../SidePanel";
import { PanelData } from "@/types/social-type";

interface GeneralTabProps {
  tabs: TabTypes;
  setTabs: React.Dispatch<React.SetStateAction<TabTypes>>;
  setPanel: React.Dispatch<React.SetStateAction<PanelData | undefined>>;
}

export default function GeneralTab({
  tabs,
  setTabs,
  setPanel,
}: GeneralTabProps) {
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
          // border: "2px solid red",
        }}
      >
        {tabs === "channels" ? (
          <ChannelList setPanel={setPanel} />
        ) : (
          <FriendList setPanel={setPanel} />
        )}
      </Box>
    </>
  );
}
