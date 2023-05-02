import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import ChannelList from "./ChannelList";
import FriendList from "./FriendList";
// import { TabTypes } from "../SidePanel";
import { PanelData, TabTypes } from "@/types/social-type";
import useUserStore from "@/store/userStore";
import RestartAltSharpIcon from "@mui/icons-material/RestartAltSharp";
import useFriendsStore from "@/store/friendsStore";
import useBlockStore from "@/store/blockedStore";
import usePendingFriendStore from "@/store/pendingFriendStore";
import { toast } from "react-hot-toast";

// interface GeneralTabProps {
//   tabs: TabTypes;
//   setTabs: React.Dispatch<React.SetStateAction<number>>;
//   setPanel: React.Dispatch<React.SetStateAction<PanelData | undefined>>;
// }

export default function GeneralTab() {
  const [tabs, setTabs] = useUserStore((state) => [state.tabs, state.setTabs]);
  const updateFriendList = useFriendsStore((state) => state.updateFriendList);
  const updateBlocked = useBlockStore((state) => state.updateBlocked);
  const updateRequests = usePendingFriendStore((state) => state.updateRequests);

  const handleRefresh = async () => {
    const toastId = toast.loading("loading");
    await updateFriendList();
    await updateBlocked();
    await updateRequests();
    toast.dismiss(toastId);
  };

  return (
    <>
      <Box
        component="div"
        sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <Typography variant="h4" padding={1} fontWeight={600}>
          Social
        </Typography>
        {/* <ToggleButtonGroup
          value={tabs}
          exclusive
          onChange={(_event, value) => setTabs(value)}
          sx={{ px: 1 }}
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
        </ToggleButtonGroup> */}
        <Box component="div" sx={{ display: "flex" }}>
          <Tabs
            value={tabs}
            aria-label="basic tabs example"
            onChange={(event: React.SyntheticEvent, newValue: number) => {
              setTabs(newValue);
            }}
            sx={{ float: "left", marginRight: "auto" }}
          >
            <Tab label="FRIENDS" />
            <Tab label="CHANNELS" />
          </Tabs>
          <IconButton onClick={handleRefresh}>
            <RestartAltSharpIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          // justifyContent: tabs === "channels" ? "end" : "start",
          gap: "10px",
          width: "100%",
          height: "calc(100vh - 105px)",
          // border: "2px solid red",
        }}
      >
        {tabs === TabTypes.channels ? <ChannelList /> : <FriendList />}
      </Box>
    </>
  );
}
