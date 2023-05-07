import { Box, Button, Typography, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "../apiClient/apiClient";
import useUserStore from "@/store/userStore";
import toast from "react-hot-toast";

export default function UsernameSettings() {
  const [nickName, updateName] = useUserStore((store) => [
    store.nickName,
    store.updateName,
  ]);
  const [usernameField, setUsernameField] = useState<string>(nickName);
  const [isValidUsername, setIsValidUsername] = useState<boolean>(false);

  const handleSubmitUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .patch(`/user`, { nickName: usernameField })
      .then(() => {
        toast.success("Succesfully Updated Username!", {
          position: "bottom-right",
        });
        updateName(usernameField);
        console.log("Succesfully Updated Username!");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast.error(`Nickname is already in use.`, {
            position: "bottom-right",
          });
        }
        console.log(`error: ${error.message}`);
      });
  };

  useEffect(() => {
    const reg = /^[a-z0-9]+$/i;
    setIsValidUsername(reg.test(usernameField));
    const reg2 = /^.{1,10}$/i;
    setIsValidUsername(reg2.test(usernameField));
  }, [usernameField]);

  return (
    <Box
      component="div"
      sx={{
        bgcolor: "primary.200",
        display: "flex",
        flexDirection: "column",
        padding: "12px 16px",
        borderRadius: 2,
      }}
    >
      <Typography
        sx={{
          color: "text.primary",
          fontSize: "1.4em",
          fontWeight: "800",
          marginBottom: "10px",
        }}
      >
        Username
      </Typography>
      <form
        onSubmit={handleSubmitUsername}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <TextField
          label="username"
          value={usernameField}
          variant="outlined"
          size="small"
          error={!isValidUsername}
          helperText={
            !isValidUsername && "Alphanumeric characters only, 10 characters max."
          }
          sx={{
            width: "210px",
            backgroundColor: "primary.300",
            "& label.Mui-focused": {
              color: isValidUsername ? "white" : "red",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: isValidUsername ? "white" : "red",
              },
              "&.Mui-active fieldset:": {
                borderColor: isValidUsername ? "white" : "red",
              },
            },
            "& .Mui-error": {
              color: isValidUsername ? "white" : "red",
            },
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUsernameField(event.target.value);
          }}
        ></TextField>
        <Button
          type="submit"
          sx={{
            color: "text.primary",
            fontSize: "1em",
            fontWeight: "600",
            backgroundColor:
              usernameField === nickName || !isValidUsername
                ? "accent.main"
                : "accent.light",
            marginTop: "10px",
            textTransform: "none",
            width: "210px",
            height: "40px",
            "&:hover": { backgroundColor: "primary.main" },
          }}
          disabled={usernameField === nickName || !isValidUsername}
        >
          Change username
        </Button>
      </form>
    </Box>
  );
}
