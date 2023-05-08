import { Modal, Box, TextField, Button } from "@mui/material";
import { useState } from "react";

interface AddFriendModalProps {
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
  handleAddFriend: (friendName: string) => void;
}

export const AddFriendModal = ({
  openModal,
  setOpenModal,
  handleAddFriend,
}: AddFriendModalProps) => {
  const [friendName, setFriendName] = useState<string>("");
  return (
    <Modal
      open={openModal}
      onClose={() => {
        setOpenModal(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        component={"div"}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.default",
          // border: "2px solid #000",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <TextField
          id="outlined-basic"
          label="Friend name"
          variant="outlined"
          // color="secondary"
          size="small"
          fullWidth
          sx={{ mt: 1, mb: 2 }}
          value={friendName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFriendName(e.target.value)
          }
        />
        <Button
          variant="contained"
          fullWidth
          color="secondary"
          onClick={() => {
            handleAddFriend(friendName);
            setFriendName("");
          }}
        >
          Add Friend
        </Button>
      </Box>
    </Modal>
  );
};

export default AddFriendModal;
