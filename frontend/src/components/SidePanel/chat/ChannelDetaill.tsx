import { Channel, ChatChannel } from "@/types/social-type";
import { Box, Typography, Button } from "@mui/material";
import axios from "../../utils/apiClient";
import { useState, useEffect } from "react";
import ManageChannelModal from "../modal/ManageChannelModal";
import { privateDecrypt } from "crypto";

interface ChannelDetailProps {
  channel: Channel;
}

const ChannelDetail = ({ channel }: ChannelDetailProps) => {
  const [open, setOpen] = useState(false);
  const [channelDetail, setChannelDetail] = useState<Channel | undefined>(
    undefined,
  );

  useEffect(() => {
    // setChannelDetail(channel);
    axios
      .get(`/chat-channels/${channel.chatChannel.id}`)
      .then((res) => setChannelDetail({ ...channel, chatChannel: res.data }))
      .catch((err) => console.log(err.response));
  }, []);

  if (channelDetail === undefined) return <></>;
  return (
    <Box component={"div"} sx={{ p: 1 }}>
      <Typography variant="h6" sx={{ display: "inline-block" }}>
        {channel.chatChannel.name}
      </Typography>

      {/* {panel.chatChannel.isAdmin && ( */}
      <Button
        fullWidth
        sx={{
          color: "white",
          border: "2px solid #F2F4F3",
          mt: 2,
        }}
        onClick={() => setOpen(true)}
        size="small"
      >
        Manage Channel
      </Button>
      {/* )} */}
      <ManageChannelModal
        open={open}
        setOpen={setOpen}
        channel={channelDetail}
      />
    </Box>
  );
};

export default ChannelDetail;

// i need the name, channelId
