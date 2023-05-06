import React, { useState } from "react";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddModeratorSharpIcon from "@mui/icons-material/AddModeratorSharp";
import RemoveModeratorSharpIcon from "@mui/icons-material/RemoveModeratorSharp";
import { ChannelMember, Channel } from "@/types/social-type";
import TransferOwnerModal from "./TransferOwnerModal";
import useConfirmToast from "@/hooks/useConfirmToast";
import toast from "react-hot-toast";
import axios from "axios";

interface OwnerManagePanelProp {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  members: ChannelMember[];
  channel: Channel;
}
const OwnerManagePanel = ({
  setShow,
  members,
  channel,
}: OwnerManagePanelProp) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const { confirmToast } = useConfirmToast();

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChangePassword = () => {
    axios
      .patch(`chat-channels/${channel.chatChannel.id}`, {
        password: password,
      })
      .then(() => {
        toast.success("Password succesfully changed");
      })
      .catch((err) => {
        if (err?.statusCode === 400) {
          let message: string = err.message;
          message = message.slice(message.indexOf(":") + 1, message.length);
          toast.error(`${message}`);
        }
      });
  };

  const handleManageAdmin = (member: ChannelMember) => {
    toast(`add or remove member as admin ${!member.isAdmin}`);
  };

  return (
    <Box component="div">
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        sx={{ color: "text.primary", mt: 1 }}
        onClick={() => setShow(false)}
      >
        Back
      </Button>
      <Typography variant="h6">Change password</Typography>

      <TextField
        id="input-with-icon-textfield"
        label="New password"
        type={showPassword ? "text" : "password"}
        sx={{ mt: 1, mb: 1 }}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        variant="outlined"
        size="small"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />

      <Button
        color="secondary"
        variant="contained"
        fullWidth
        onClick={() => confirmToast("change password", handleChangePassword)}
      >
        Change password
      </Button>

      <Typography variant="h6" paddingTop={4}>
        Manage admin
      </Typography>

      <List>
        {members.map((member, i) => (
          <ListItemButton
            disableTouchRipple
            key={i}
            sx={{
              cursor: "default",
            }}
          >
            <Avatar
              src={member.user.avatar}
              sx={{ width: 24, height: 24, mr: 1 }}
            />

            <ListItemText disableTypography>
              {member.user.nickName}
            </ListItemText>
            <Tooltip
              title={member.isAdmin ? "Remove admin" : "Add admin"}
              followCursor
            >
              <IconButton
                size="small"
                sx={{ ml: 1 }}
                onClick={() => handleManageAdmin(member)}
              >
                {member.isAdmin ? (
                  <RemoveModeratorSharpIcon fontSize="inherit" />
                ) : (
                  <AddModeratorSharpIcon fontSize="inherit" />
                )}
              </IconButton>
            </Tooltip>
          </ListItemButton>
        ))}
      </List>
      <TransferOwnerModal members={members} channel={channel} />
    </Box>
  );
};

export default OwnerManagePanel;
