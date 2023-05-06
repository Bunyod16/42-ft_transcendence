import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AvatarSettings from "./AvatarSettings";
import UsernameSettings from "./UsernameSettings";
import TwoFactorSettings from "./TwoFactorSettings";
import { useRouter } from "next/router";

export default function Settings() {
  // const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const router = useRouter();

  // useEffect(() => {
  //   setIsHydrated(true);
  // }, []);

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "10px 24px",
        backgroundColor: "primary.100",
      }}
    >
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        sx={{ color: "text.primary" }}
        onClick={() => router.push("/")}
      >
        <Typography
          variant="h5"
          sx={{
            textTransform: "uppercase",
          }}
        >
          Settings
        </Typography>
      </Button>
      {/* <IconButton
          sx={{
            padding: "0px",
          }}
          onClick={() => {
            router.back();
          }}
        >
          <ArrowBackIcon
            sx={{
              height: "30px",
              width: "30px",
              marginRight: "20px",
              color: "text.primary",
            }}
          />
        </IconButton> */}
      {/* <Typography
          variant="h2"
          sx={{
            color: "text.secondary",
            fontSize: "1.5em",
            fontWeight: "500",
            textTransform: "uppercase",
          }}
        >
          Settings
        </Typography> */}
      {/* </Box> */}
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          // justifyContent: "space-around",
          height: "100%",
          gap: 3,
        }}
      >
        <AvatarSettings />
        <UsernameSettings />
        <TwoFactorSettings />
      </Box>
    </Box>
  );
}
