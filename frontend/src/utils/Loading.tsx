import { Paper, Typography } from "@mui/material";
import Image from "next/image";

interface loadingProps {
  description?: string;
}

export default function Loading({ description }: loadingProps) {
  return (
    <Paper
      sx={{
        height: "100vh",
        width: "100vw",
        maxHeight: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        alt="a loading gif octopus"
        src="/mona-loading-default.gif"
        width={384}
        height={384}
      ></Image>
      <Typography sx={{ color: "black" }}>
        {description ? description : "Loadingg...."}
      </Typography>
    </Paper>
  );
}
