import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import jakoh from "../../../public/jakoh_smol.jpg";

const inlineStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "50px",
};

/**
 * Convert Friends list into array of =
 * {
 * img: .jpg,
 * name: string,
 * status: online | offline
 * }
 *
 * need to add dot icon, green = online | red = offline
 */

export default function Friends() {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Button
        variant="outlined"
        sx={{
          width: "95%",
          mt: "8px",
          mb: "15px",
          color: "#FEFEFE",
          border: "2px solid #A3A3A3",
          height: "64px",
          "&:hover": {
            border: "2px solid #626262",
          },
        }}
      >
        <Typography variant="h6">ADD FRIENDS</Typography>
      </Button>
      <List
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        aria-label="contacts"
      >
        <ListItem
          disablePadding
          sx={{
            backgroundColor: "#FEFEFE",
            mb: "8px",
            width: "95%",
            color: "black",
            borderRadius: "8px",
          }}
        >
          <ListItemButton>
            <img
              src={jakoh.src}
              width={"32px"}
              height={"32px"}
              style={inlineStyle}
            />
            <ListItemText sx={{ ml: "12px" }} primary="Chelsea Otakan" />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            backgroundColor: "#FEFEFE",
            mb: "8px",
            width: "95%",
            color: "black",
            borderRadius: "8px",
          }}
        >
          <ListItemButton>
            <ListItemText sx={{ ml: "12px" }} primary="Eric Hoffman" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
