import { Box, SxProps } from "@mui/material";
import React, { useEffect, useState } from "react";
import DirectChat from "./SidePanel/DirectChat";
import GeneralTab from "./SidePanel/GeneralTab";
import { FriendType } from "@/store/friendsStore";
import { chatSocket } from "./socket/socket";
import { Channel } from "@/store/channelStore";
import { PanelData } from "@/types/social-type";
/**
 * State to track
 * - Whether in chat room or not
 *    - if in chat room TopPanel display user details
 *    - if not in chat room display socials
 */

// interface SidePanelProps {
//   isChat?: boolean;
// }

export type TabTypes = "friends" | "channels";

export default function SidePanel() {
  const [tabs, setTabs] = useState<TabTypes>("friends");
  const [panel, setPanel] = useState<PanelData | undefined>(undefined);

  useEffect(() => {
    chatSocket.connect();

    function onConnect() {
      console.log("chat socket connected");
    }

    chatSocket.on("connect", onConnect);

    return () => {
      chatSocket.off("connect", onConnect);
    };
  }, []);

  return (
    <Box
      component="div"
      sx={{
        minWidth: "300px",
        maxWidth: "25%",
        height: "100%",
        bgcolor: "#00000020",
      }}
    >
      {panel === undefined ? (
        <GeneralTab tabs={tabs} setTabs={setTabs} setPanel={setPanel} />
      ) : (
        <DirectChat panel={panel} setPanel={setPanel} />
      )}
    </Box>
  );
}
