import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import useUserStore from "@/store/userStore";
import { useEffect, useState } from "react";
// import QRCode from "qrcode";

interface TwoFactorApiObject {
  key: string;
  otpauth_url: string;
}

interface TwoFactorObject {
  id: number;
  key: string;
  created_at: Date;
}

export default function TwoFactorSettings() {
  const id = useUserStore((store) => [store.id]);
  const [userHasTwoFactor, setUserHasTwoFactor] = useState<boolean>(false);
  const [userTwoFactor, setUserTwoFactor] = useState<string>("");

  const handleEnableTwoFactor = () => {
    axios
      .post(`http://localhost:3000/two-factor/${id}`)
      .then((res) => {
        const data = res.data as TwoFactorApiObject;
        console.log(data.key);
        console.log(data.otpauth_url);
        // QRCode.toDataURL();
        setUserHasTwoFactor(true);
        setUserTwoFactor(data.key);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleShowTwoFactor = () => {
    console.log(userTwoFactor);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/two-factor/user-two-factor`)
      .then((res) => {
        const data = res.data as TwoFactorObject;
        console.log(res.data);
        setUserHasTwoFactor(true);
        setUserTwoFactor(data.key);
      })
      .catch((error) => {
        console.log(error.message);
        if (error.response.status === 404) {
          setUserHasTwoFactor(false);
        }
      });
    //eslint-disable-next-line
  }, []);

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
        {userHasTwoFactor ? (
          <>
            <Typography
              sx={{
                color: "text.primary",
                fontSize: "1.4em",
                fontWeight: "800",
              }}
            >
              Two-factor authentication
            </Typography>
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "35%",
              }}
            >
              <Button
                sx={{
                  color: "text.primary",
                  fontSize: "1em",
                  height: "40px",
                  fontWeight: "600",
                  backgroundColor: "accent.light",
                  marginTop: "10px",
                  textTransform: "none",
                  width: "180px",
                }}
                onClick={handleShowTwoFactor}
              >
                Get Two-factor
              </Button>
              <Button
                sx={{
                  color: "text.primary",
                  fontSize: "1em",
                  height: "40px",
                  fontWeight: "600",
                  backgroundColor: "accent.main",
                  marginTop: "10px",
                  textTransform: "none",
                  width: "180px",
                }}
              >
                Disable??
              </Button>
            </Box>
          </>
        ) : (
          <>
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
                width: "210px",
              }}
              onClick={handleEnableTwoFactor}
            >
              Enable
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
