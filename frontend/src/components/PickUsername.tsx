import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/router";
import AccountCircle from "@mui/icons-material/AccountCircle";
import axios from "./utils/apiClient";

export default function PickUsernamePanel() {
  const [isLoggedIn, updateName] = useUserStore((state) => [
    state.isLoggedIn,
    state.updateName,
  ]);
  const router = useRouter();
  const [errorText, setErrorText] = useState("");
  const [Text, setText] = useState("");

  React.useEffect(() => {
    if (isLoggedIn) router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "32px",
        alignItems: "center",
        padding: "40px 20px",
        borderRadius: "12px",
        border: "3px solid #93032E",
        height: "360px",
        width: "600px",
        color: "accent.contrastText",
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontSize: "40px",
          fontWeight: "700",
          lineHeight: "0px",
        }}
      >
        Choose a nickname
      </Typography>
      <Typography
        component="h2"
        sx={{
          fontSize: "15px",
          fontWeight: "600",
          lineHeight: "0px",
          paddingBottom: "40px",
        }}
      >
        Must be unique and not include special characters
      </Typography>
      <TextField
        id="outlined-basic"
        label=""
        variant="standard"
        color="secondary"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
        focused
        error={errorText.length ? true : false}
        helperText={errorText}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const reg = /^[a-z0-9]{1,10}$/i;
          reg.test(event.target.value)
            ? (setErrorText(""), setText(event.target.value))
            : setErrorText("Alphanumeric characters only");
        }}
      />
      <Button
        variant="contained"
        sx={{
          padding: "10px 40px",
          backgroundColor: "accent.main",
          transition: "0.3s",
          "&:hover": { backgroundColor: "accent.hover" },
        }}
        onClick={() => {
          axios
            .get(`user/check-nickname/${Text}`)
            .then((res) => {
              res.data
                ? setErrorText("Username taken")
                : axios.patch("user", { nickName: Text }).then(() => {
                    updateName(Text);
                  });
            })
            .catch((error) => {
              console.log(error.response);
            });
        }}
        disabled={errorText || Text == "" ? true : false}
      >
        <Typography sx={{ color: "accent.text" }}>Confirm</Typography>
      </Button>
    </Box>
  );
}

// https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ba795300d2f101b0a34682e85deea0ae40535de62c86a512e1823c0d33b26033&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code&scope=public
