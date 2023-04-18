import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Channels from "./ChannelList";
import Friends from "./FriendList";
import { TabTypes } from "../SidePanel";
interface generalTabProps {
  tabs: TabTypes;
  setTabs: React.Dispatch<React.SetStateAction<TabTypes>>;
  setPanel: React.Dispatch<React.SetStateAction<string>>;
}

export default function GeneralTab({
  tabs,
  setTabs,
  setPanel,
}: generalTabProps) {
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
