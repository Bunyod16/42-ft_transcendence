import { Box, Button, Typography, Tooltip } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import useUserStore from "@/store/userStore";
import toast from "react-hot-toast";

export default function AvatarSettings() {
  const [avatar, updateAvatar] = useUserStore((store) => [
    store.avatar,
    store.updateAvatar,
  ]);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>("");
  const [newAvatar, setNewAvatar] = useState<File>();

  const handleSubmitAvatar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        toast.success("Succesfully Updated Avatar", {
          position: "bottom-right",
        });
        console.log("Succesfully Updated Avatar");
        updateAvatar(res.data.avatarURI); //i HAVE TO CHANGE THIS AND UPDATE STORE AVATAR
      })
      .catch((error) => {
        toast.error(`${error.mossage}`, {
          position: "bottom-right",
        });
        console.log(error.message);
      });
  };

  const getImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const file = e.target.files[0]; //select the file to upload
    const imageUrl = URL.createObjectURL(file);
    setNewAvatarUrl(imageUrl);
    setNewAvatar(file);
  };

  return (
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
  );
}
