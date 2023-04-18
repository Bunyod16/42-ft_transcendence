import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircleIcon from "@mui/icons-material/Circle";
import ChatBox from "./ChatBox";

const StyleImage = {
  borderRadius: "50px",
  margin: "0 25px",
};

export default function DirectChat({
  setPanel,
}: {
  setPanel: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <Box
      component="div"
      sx={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        height: "100%",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          padding: "10px",
          flexDirection: "row",
        }}
      >
        <Button
          sx={{ m: "auto", p: "auto", w: "8px", h: "8px" }}
          onClick={() => setPanel("")}
        >
          <ArrowBackIcon sx={{ m: 0, p: 0, fill: "white" }} />
        </Button>
        <Image
          src="/jakoh_smol.jpg"
          width="80"
          height="80"
          style={StyleImage}
          alt="profile pic"
        />
        <Box component="div">
          <Typography variant="h4">Jakohhhhhh</Typography>
          <Box component="div">
            <Button
              variant="outlined"
              sx={{ color: "white", border: "1px solid #93032E", mr: "5px" }}
            >
              Profile
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "white", border: "1px solid #93032E" }}
            >
              Invite
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        component="div"
        sx={{
          ml: "15px",
        }}
      >
        <Button>
          <CircleIcon
            sx={{
              fill: "green",
              mr: "12px",
              width: "12px",
              height: "12px",
            }}
          />
          <Typography sx={{ color: "white" }}>Online</Typography>
        </Button>
      </Box>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          gap: "10px",
          width: "100%",
          height: "calc(100vh - 140px)",
          border: "1px solid #048BA8",
        }}
      >
        <ChatBox height="100%" />
      </Box>
    </Box>
  );
}
