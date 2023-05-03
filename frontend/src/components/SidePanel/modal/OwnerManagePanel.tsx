import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const OwnerManagePanel = () => {
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Typography variant="h6" paddingTop={3}>
        Manage channel
      </Typography>

      <TextField
        id="input-with-icon-textfield"
        label="New password"
        type={showPassword ? "text" : "password"}
        sx={{ mt: 2, mb: 1 }}
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

      <Button color="secondary" variant="contained" fullWidth sx={{ mt: 4 }}>
        Transfer ownership
      </Button>
    </>
  );
};

export default OwnerManagePanel;
