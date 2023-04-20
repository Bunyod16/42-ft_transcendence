import { Box, Typography } from "@mui/material";

export default function StatsBox() {
  return (
    <Box
      component="div"
      sx={{
        padding: "20px 50px",
        backgroundColor: "primary.100",
        display: "flex",
        flexDirection: "row",
        height: "calc(100vh - 263px)",
      }}
    >
      <Box
        component="div"
        sx={{
          width: "40%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          component="div"
          sx={{
            backgroundColor: "primary.200",
            padding: "10px 20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <Box component="div" sx={{ display: "flex", flexDirection: "row" }}>
            <Typography
              sx={{ fontSize: "1.2em", fontWeight: "600", width: "70px" }}
            >
              Wins
            </Typography>
            <Typography
              sx={{ fontSize: "1.2em", fontWeight: "600", marginLeft: "10px" }}
            >
              10
            </Typography>
          </Box>
          <Box component="div" sx={{ display: "flex", flexDirection: "row" }}>
            <Typography
              sx={{ fontSize: "1.2em", fontWeight: "600", width: "70px" }}
            >
              Loses
            </Typography>
            <Typography
              sx={{ fontSize: "1.2em", fontWeight: "600", marginLeft: "10px" }}
            >
              10
            </Typography>
          </Box>
        </Box>
        <Box
          component="div"
          sx={{
            backgroundColor: "primary.200",
            height: "100%",
            padding: "10px 20px",
            borderRadius: "8px",
          }}
        >
          <Typography sx={{ fontSize: "1.5em", fontWeight: "600" }}>
            Achievements
          </Typography>
        </Box>
      </Box>
      <Box
        component="div"
        sx={{
          backgroundColor: "primary.200",
          width: "60%",
          marginLeft: "20px",
          height: "100%",
          padding: "10px 20px",
          borderRadius: "8px",
        }}
      >
        <Typography sx={{ fontSize: "1.5em", fontWeight: "600" }}>
          Recent Games
        </Typography>
      </Box>
    </Box>
  );
}
