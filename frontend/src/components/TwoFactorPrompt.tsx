import useUserStore from "@/store/userStore";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import axios from "./utils/apiClient";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

const TwoFactorPrompt = () => {
  const [id] = useUserStore((store) => [store.id]);
  const { authenticate } = useUserStore();
  const [twoFactorVerificationCode, setTwoFactorVerificationCode] =
    useState<string>("");
  const router = useRouter();

  const handleTwoFactorVerificationCode = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    const text: string = event.target.value;

    if (text === "") {
      setTwoFactorVerificationCode("");
      return;
    }

    const reg = /^[0-9]{0,6}$/;
    if (reg.test(text)) {
      setTwoFactorVerificationCode(text);
    }
  };

  const handleTwoFactorVerificationCodeSubmit = () => {
    if (twoFactorVerificationCode.length < 6)
      return toast.error("Code is not 6 digits!");
    if (twoFactorVerificationCode == null) return;
    axios
      .post(`/two-factor/${id}/verify-two-factor`, {
        twoFactorCode: twoFactorVerificationCode,
      })
      .then((resp) => {
        // console.log(resp.data);
        if (!resp.data.verified) throw new Error("Failed to verify two factor");
        toast.success(`Good job`, {
          position: "top-center",
        });
        // console.log(`Verified two factor`);
        authenticate(true);
        router.push("/");
      })
      .catch((error) => {
        console.log(error.message);
        toast.error(`Yo dude don't be tryin shit here`, {
          position: "top-center",
        });
        console.log(`Failed to verify two factor`);
        return;
      });
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        background: "#22333B",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 4,
          border: "3px solid #93032E",
          // height: "260px",
          maxWidth: "600px",
          width: "100%",
          padding: "40px 32px",
          color: "accent.contrastText",
          bgcolor: "primary.100",
          boxshadow: 2,
        }}
      >
        <Typography variant="h4">Two factor authentication</Typography>
        <Typography paddingTop={2}>
          Enter the 6-digit code from your two factor authenticator app.
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          value={twoFactorVerificationCode}
          sx={{
            marginTop: 6,
            width: "140px",
            borderRadius: "8px",
            backgroundColor: "primary.300",
            textAlign: "center",
          }}
          inputProps={{ style: { textAlign: "center" } }}
          onChange={handleTwoFactorVerificationCode}
        />
        <Button
          type="submit"
          size="large"
          color="secondary"
          variant="contained"
          sx={{
            color: "text.primary",
            // fontSize: "1em",
            // height: "40px",
            // fontWeight: "600",
            // backgroundColor: "accent.light",
            marginTop: "20px",
            // textTransform: "none",
            // width: "170px",
          }}
          onClick={handleTwoFactorVerificationCodeSubmit}
        >
          Verify
        </Button>
      </Box>
    </Container>
  );
};

export default TwoFactorPrompt;
