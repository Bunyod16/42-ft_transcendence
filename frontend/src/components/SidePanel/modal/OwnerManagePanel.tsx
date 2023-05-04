import React, { useState } from "react";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ChannelMember } from "@/types/social-type";

interface OwnerManagePanelProp {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  members: ChannelMember[];
}
const OwnerManagePanel = ({ setShow, members }: OwnerManagePanelProp) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selected, setSelected] = useState(-1);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChangePassword = () => {};

  const handleTransferOwnership = () => {};

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
      />

      <Button color="secondary" variant="contained" fullWidth>
        Change password
      </Button>

      <Typography variant="h6" paddingTop={4}>
        Transfer ownership
      </Typography>

      <List>
        {members.map((member, i) => (
          <ListItemButton
            disableTouchRipple
            key={i}
            selected={selected === i}
            onClick={() => setSelected(i)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#fefefe10",
                "&:hover": {
                  backgroundColor: "#fefefe20",
                },
              },
            }}
          >
            <Avatar
              src={member.user.avatar}
              sx={{ width: 24, height: 24, mr: 1 }}
            />

            <ListItemText disableTypography>
              {member.user.nickName}
            </ListItemText>
          </ListItemButton>
        ))}
      </List>
      <Button
        disabled={selected === -1}
        color="secondary"
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
      >
        Transfer
      </Button>
    </Box>
  );
};

export default OwnerManagePanel;
