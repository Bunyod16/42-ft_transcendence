import { Paper, Typography } from "@mui/material";
import Image from "next/image";

interface loadingProps {
  description?: string;
}

export default function Loading({ description }: loadingProps) {
  return (
    <Paper
      sx={{
        height: "100%",
        width: "100%",
        // maxHeight: "100%",
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
      <Typography variant="h5">
        {description ? description : "Loading...."}
      </Typography>
    </Paper>
  );
}
