import {
  Box,
  Button,
  Typography,
  Modal,
  Avatar,
  TextField,
} from "@mui/material";
import axios from "../apiClient/apiClient";
import useUserStore from "@/store/userStore";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toast } from "react-hot-toast";

interface TwoFactorApiObject {
  key: string;
  otpauth_url: string;
}

export default function TwoFactorSettings() {
  const id = useUserStore((store) => [store.id]);
  const [userHasTwoFactor, setUserHasTwoFactor] = useState<boolean>(false);
  const [userTwoFactor, setUserTwoFactor] = useState<TwoFactorApiObject>();
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [twoFactorURL, setTwoFactorURL] = useState<string>("");
  const [twoFactorVerificationCode, setTwoFactorVerificationCode] =
    useState<string>("");
  const [showDeleteTwoFactorConfirmation, setShowDeleteTwoFactorComfirmation] =
    useState<boolean>(false);
  const [trollCount, setTrollState] = useState<number>(1);
  const [trollMessage, setTrollMessage] = useState<string>(
    "Are you sure you want to disable Two-factor?",
  );
  const [buttonTrollMessage, setButtonTrollMessage] =
    useState<string>("Disable Two-factor");
  const hostUrl = process.env.HOST_URL || 'localhost';

  const handleEnableTwoFactor = () => {
    axios
      .post(`${hostUrl}:3000/two-factor/${id}`)
      .then((res) => {
        const data: TwoFactorApiObject = { ...res.data };
        QRCode.toDataURL(data.otpauth_url, (_, url) => {
          setTwoFactorURL(url);
        });
        setShowQRModal(true);
        setUserTwoFactor(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

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
    if (userTwoFactor?.key === undefined) return;
    axios
      .post(
        `${hostUrl}:3000/two-factor/${id}/verify-first-time-two-factor`,
        {
          twoFactorToken: twoFactorVerificationCode,
          twoFactorKey: userTwoFactor.key,
        },
      )
      .then(() => {
        toast.success(`Succesfully Created Two-Factor`, {
          position: "bottom-right",
        });
        console.log(`Succesfully Created Two-Factor`);
        setShowQRModal(false);
        setUserHasTwoFactor(true);
      })
      .catch((error) => {
        console.log(error.message);
        if (error.response.status === 400) {
          toast.error(`Wrong Two-factor token`, {
            position: "bottom-right",
          });
        }
        console.log(`Failed to craete Two-Factor`);
      });
  };

  const handleTrolling = () => {
    if (trollCount < 5) {
      const text =
        trollMessage.slice(0, trollMessage.indexOf("sure")) +
        "really " +
        trollMessage.slice(trollMessage.indexOf("sure")) +
        "?";
      const buttonText = buttonTrollMessage + " fr";

      setTrollMessage(text);
      setButtonTrollMessage(buttonText);
      setTrollState(trollCount + 1);
    } else {
      axios
        .delete(`${hostUrl}:3000/two-factor/delete-with-user-id`)
        .then(() => {
          toast.success(`Succesfully Deleted Two-Factor`, {
            position: "bottom-right",
          });
          console.log("Succesfully Deleted Two-Factor");
          setShowDeleteTwoFactorComfirmation(false);
          setUserHasTwoFactor(false);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  useEffect(() => {
    axios
      .get(`${hostUrl}:3000/two-factor/user-two-factor`)
      .then(() => {
        setUserHasTwoFactor(true);
      })
      .catch((error) => {
        console.log(error.message);
        // if (error.response?.status === 404) {
        //   setUserHasTwoFactor(false);
        // }
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
              onClick={() => {
                setShowDeleteTwoFactorComfirmation(true);
              }}
            >
              Disable
            </Button>
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
                "&:hover": { backgroundColor: "primary.main" },
              }}
              onClick={handleEnableTwoFactor}
            >
              Enable
            </Button>
          </>
        )}
      </Box>
      <Modal
        open={showQRModal}
        onClose={() => {
          setShowQRModal(false);
        }}
      >
        <Box
          component="div"
          sx={{
            width: "320px",
            backgroundColor: "primary.100",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            alignItems: "center",
            textAlign: "center",
            borderRadius: "8px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={twoFactorURL}
            sx={{ borderRadius: "8px", width: "280px", height: "280px" }}
          />
          <TextField
            variant="outlined"
            size="small"
            value={twoFactorVerificationCode}
            sx={{
              marginTop: "20px",
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
            sx={{
              color: "text.primary",
              fontSize: "1em",
              height: "40px",
              fontWeight: "600",
              backgroundColor: "accent.light",
              marginTop: "20px",
              textTransform: "none",
              width: "170px",
            }}
            onClick={handleTwoFactorVerificationCodeSubmit}
          >
            Verify Two-factor
          </Button>
        </Box>
      </Modal>
      <Modal
        open={showDeleteTwoFactorConfirmation}
        onClose={() => {
          setShowDeleteTwoFactorComfirmation(false);
          setTrollState(1);
        }}
      >
        <Box
          component="div"
          sx={{
            backgroundColor: "primary.100",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            alignItems: "center",
            textAlign: "center",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.1em",
            }}
          >
            {trollMessage}
          </Typography>
          <Button
            type="submit"
            sx={{
              color: "text.primary",
              fontSize: "1em",
              height: "40px",
              margin: "20px",
              fontWeight: "600",
              backgroundColor: "accent.main",
              textTransform: "none",
              padding: "10px 20px",
            }}
            onClick={handleTrolling}
          >
            {buttonTrollMessage}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
