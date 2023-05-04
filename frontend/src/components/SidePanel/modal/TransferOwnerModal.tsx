import { Modal, Box, Button, IconButton } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { Dispatch, SetStateAction, useState } from "react";
import EmojiPeopleSharpIcon from "@mui/icons-material/EmojiPeopleSharp";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { ChannelMember, ChatChannel } from "@/types/social-type";
import { toast } from "react-hot-toast";

interface TransferOwnerModalItem {
  members: ChannelMember[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TransferOwnerModal = ({
  members,
  open,
  setOpen,
}: TransferOwnerModalItem) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
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
        somehting
      </Box>
    </Modal>
  );
};

export default TransferOwnerModal;
