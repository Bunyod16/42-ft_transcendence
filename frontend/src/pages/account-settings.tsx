import { Box, Button, Grid, Typography } from "@mui/material";

const AccountSettings = () => {
  return (
    <Grid
      container
      alignContent="center"
      justifyContent={"center"}
      height={"100%"}
    >
      <Grid>
        <Box component={"div"}>
          <Typography>Avatar</Typography>
          <Button variant="contained">Change avatar</Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AccountSettings;
