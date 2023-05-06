import { Modal, Box, Button, IconButton } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dispatch, SetStateAction, useState } from "react";
import EmojiPeopleSharpIcon from "@mui/icons-material/EmojiPeopleSharp";
import dayjs, { Dayjs } from "dayjs";
import axios from "../../apiClient/apiClient";
import { ChannelMember, ChatChannel } from "@/types/social-type";
import { toast } from "react-hot-toast";

interface MuteDateModalItem {
  showDateModal: boolean;
  setShowDateModal: Dispatch<SetStateAction<boolean>>;
  muteDate: Dayjs;
  setMuteDate: Dispatch<SetStateAction<Dayjs>>;
  member: ChannelMember;
  chatChannel: ChatChannel;
  setIsMuted: Dispatch<SetStateAction<boolean>>;
}

export const MuteDateModal = ({
  showDateModal,
  setShowDateModal,
  muteDate,
  setMuteDate,
  member,
  chatChannel,
  setIsMuted,
}: MuteDateModalItem) => {
  const [now, setNow] = useState<Dayjs>(dayjs());
  const handleMute = () => {
    if (muteDate < dayjs()) {
      toast.error(`Invalid Date`);
      return;
    }

    axios
      .patch(`chat-channel-member/${member.id}/mute`, {
        mutedUntil: muteDate.toJSON(),
        chatChannelId: chatChannel.id,
      })
      .then(() => {
        toast.success(`Member ${member.user.nickName} has been muted.`);
        console.log(
          `Member ${
            member.user.nickName
          } has been muted till ${muteDate.toDate()}`,
        );
        setShowDateModal(false);
        setIsMuted(true);
      })
      .catch((err) => {
        console.log(err?.response);
        if (err?.response?.status === 400) {
          let message: string = err.response.data.message;
          message = message.slice(message.indexOf(":") + 1, message.length);
          toast.error(`${message}`);
        } else if (err?.statusCode === 400) {
          let message: string = err.message;
          console.log(message);
          message = message.slice(message.indexOf(":") + 1, message.length);
          toast.error(`${message}`);
        }
      });
  };

  return (
    <Modal open={showDateModal} onClose={() => setShowDateModal(false)}>
      <Box
        component="div"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "fit-content",
          bgcolor: "background.default",
          borderRadius: 2,
          boxShadow: 24,
          py: 6,
          px: 6,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Mute Until"
            defaultValue={now}
            sx={{
              backgroundColor: "primary.100",
              color: "text.primary",
            }}
            onChange={(date) => {
              setNow(dayjs());
              setMuteDate(date || now);
            }}
            disablePast
          />
        </LocalizationProvider>
        <Button
          color="secondary"
          variant="contained"
          sx={{
            marginTop: "20px",
          }}
          fullWidth
          disabled={muteDate <= now}
          onClick={handleMute}
        >
          Mute
        </Button>
        <IconButton
          color="error"
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            margin: "auto",
          }}
          onClick={() => setShowDateModal(false)}
        >
          <EmojiPeopleSharpIcon color="error" />
        </IconButton>
      </Box>
    </Modal>
  );
};
export default MuteDateModal;
