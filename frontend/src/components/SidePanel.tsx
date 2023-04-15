import { Box, SxProps } from "@mui/material";
import React, { useState } from "react";
import FriendTab from "./SidePanel/FriendTab";
import GeneralTab from "./SidePanel/GeneralTab";

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
