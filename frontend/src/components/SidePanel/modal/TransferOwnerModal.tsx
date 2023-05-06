import {
  Modal,
  Box,
  Button,
  Avatar,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ChannelMember } from "@/types/social-type";
import useUserStore from "@/store/userStore";
import useConfirmToast from "@/hooks/useConfirmToast";
import { toast } from "react-hot-toast";

interface TransferOwnerModalItem {
  members: ChannelMember[];
}

export const TransferOwnerModal = ({ members }: TransferOwnerModalItem) => {
  const [selected, setSelected] = useState(-1);
  const [open, setOpen] = useState(false);
  const [candidates, setCandidates] = useState<ChannelMember[]>([]);
  const id = useUserStore((state) => state.id);
  const { confirmToast } = useConfirmToast();

  useEffect(() => {
    setCandidates(members.filter((member) => member.user.id !== id));
  }, [members, id]);

  useEffect(() => {
    setSelected(-1);
  }, [open]);

  const handleTransferOwner = () => {
    toast.success(`transfer owner to ${candidates[selected].user.nickName}???`);
    setOpen(false);
  };

  return (
    <>
      <Divider />
      <Button
        color="accent"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        onClick={() => setOpen(true)}
      >
        Transfer Ownership
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          component="div"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "350px",
            bgcolor: "background.default",
            borderRadius: 2,
            boxShadow: 24,
            py: 4,
            px: 6,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">Choose the next owner</Typography>
          {candidates.length ? (
            <List>
              {candidates.map((candidate, i) => (
                <ListItemButton
                  disableTouchRipple
                  key={i}
                  selected={selected === i}
                  onClick={() => setSelected(i)}
                  sx={{
                    cursor: "default",
                  }}
                >
                  <Avatar
                    src={candidate.user.avatar}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />

                  <ListItemText disableTypography>
                    {candidate.user.nickName}
                  </ListItemText>
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Typography padding={2}>No one available :3</Typography>
          )}

          <Button
            disabled={selected === -1}
            color="accent"
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() =>
              confirmToast("transfer ownership?", handleTransferOwner)
            }
          >
            Transfer
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default TransferOwnerModal;
