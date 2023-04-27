import { Box, Button, TextField, Typography, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from "@/store/userStore";

export default function Settings() {
  const [nickName, avatar, updateAvatar] = useUserStore((store) => [
    store.nickName,
    store.avatar,
    store.updateAvatar,
  ]);
  const [usernameField, setUsernameField] = useState<string>(nickName);
  const [isValidUsername, setIsValidUsername] = useState<boolean>(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>("");
  const [newAvatar, setNewAvatar] = useState<File>();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  console.log("avatar", avatar);

  const handleSubmitUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(usernameField);
    //make some api call here
    //change textField to error if username exists
  };

  const handleSubmitAvatar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(newAvatar);
    const formData = new FormData();
    if (newAvatar === undefined) return;
    formData.append("avatar", newAvatar);
    axios
      .post("/content/upload_avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        updateAvatar("http://localhost:7001/avatar/1-Boyeeeee.png");
      })
      .catch(() => {
        console.log("error");
      });
  };

  const getImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const file = e.target.files[0]; //select the file to upload
    const imageUrl = URL.createObjectURL(file);
    setNewAvatarUrl(imageUrl);
    setNewAvatar(file);
  };

  useEffect(() => {
    const reg = /^[a-z0-9]+$/i;
    console.log(reg.test(usernameField));
    setIsValidUsername(reg.test(usernameField));
  }, [usernameField]);

  console.log(isValidUsername);

  return !isHydrated ? (
    <></>
  ) : (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "30px 20px",
        backgroundColor: "primary.100",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <ArrowBackIcon sx={{ width: "30px", height: "30px" }}></ArrowBackIcon>
        <Typography
          variant="h2"
          sx={{
            color: "text.secondary",
            fontSize: "1.5em",
            fontWeight: "500",
            textTransform: "uppercase",
            marginLeft: "15px",
          }}
        >
          Settings
        </Typography>
      </Box>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          height: "100%",
        }}
      >
        <Box component="div">
          <Box
            component="div"
            sx={{
              backgroundColor: "none",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
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
              Avatar
            </Typography>
            <form
              onSubmit={handleSubmitAvatar}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Tooltip title="Choose Image" followCursor>
                <Button
                  sx={{
                    borderRadius: "8px",
                    width: "140px",
                    height: "140px",
                    backgroundImage: newAvatarUrl
                      ? `url("${newAvatarUrl}")`
                      : `url("${avatar}")`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    "&:hover": {
                      opacity: "0.5",
                    },
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={(e) => getImageFile(e)}
                    hidden
                  />
                </Button>
              </Tooltip>
              <Button
                sx={{
                  color: "text.primary",
                  fontSize: "1em",
                  fontWeight: "600",
                  backgroundColor: "accent.light",
                  marginTop: "10px",
                  textTransform: "none",
                  width: "210px",
                  height: "40px",
                }}
                type="submit"
              >
                Change Avatar
              </Button>
            </form>
          </Box>
        </Box>
        <Box component="div">
          <Box
            component="div"
            sx={{
              backgroundColor: "none",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
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
                  !isValidUsername &&
                  "Must only contain alphanumeric characters"
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
                  backgroundColor: "accent.light",
                  marginTop: "10px",
                  textTransform: "none",
                  width: "210px",
                  height: "40px",
                }}
              >
                Change username
              </Button>
            </form>
          </Box>
        </Box>
        <Box component="div">
          <Box
            component="div"
            sx={{
              backgroundColor: "none",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "text.primary",
                fontSize: "1.4em",
                fontWeight: "800",
              }}
            >
              Two-factor authentication
            </Typography>
            <Button
              sx={{
                color: "text.primary",
                fontSize: "1em",
                height: "40px",
                fontWeight: "600",
                backgroundColor: "accent.light",
                marginTop: "10px",
                textTransform: "none",
                width: "140px",
              }}
            >
              Enable
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
