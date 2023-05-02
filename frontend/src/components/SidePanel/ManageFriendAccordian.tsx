import usePendingFriendStore from "@/store/pendingFriendStore";
import {
  Accordion,
  AccordionSummary,
  Typography,
  List,
  setRef,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";

const ManageFriendAccordian = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [incomingReqs, outgoingReqs, setRequests] = usePendingFriendStore(
    (state) => [
      state.incomingRequests,
      state.outgoingRequests,
      state.setRequests,
    ],
  );

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  // get pending and blocked friend
  useEffect(() => {
    axios
      .get("/friend-request/findUserPendingRequest")
      .then((res) => {
        // console.log(res);
        setRequests(res.data);
      })
      .catch((err) => console.log(err));
  }, [setRequests]);

  const acceptFriendRequest = (id: number) => {
    axios
      .patch("/friend-request/updateByFriendId", {
        friendId: id,
        friendStatus: "Accepted",
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Pending</Typography>
        </AccordionSummary>
        <List>
          {incomingReqs.map((req, index) => (
            <ListItem
              key={index}
              sx={{
                backgroundColor: "#FEFEFE",
                mb: "8px",
                width: "95%",
                color: "black",
                borderRadius: "8px",
              }}
            >
              {/** Need to change src to img thingy */}
              <ListItemText sx={{ ml: "12px" }} primary={req.friend.nickName} />
              <IconButton onClick={() => acceptFriendRequest(req.friend.id)}>
                <CheckCircleSharpIcon
                  sx={
                    {
                      // fill: req.friend.online ? "green" : "red",
                      // mr: "12px",
                      // width: "12px",
                      // height: "12px",
                    }
                  }
                />
              </IconButton>
            </ListItem>
          ))}
          {/** map new outgoing state */}
          {outgoingReqs.map((req, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{
                backgroundColor: "#FEFEFE",
                mb: "8px",
                width: "95%",
                color: "black",
                borderRadius: "8px",
              }}
            >
              {/** Need to change src to img thingy */}
              <ListItemButton>
                <ListItemText
                  sx={{ ml: "12px" }}
                  primary={req.friend.nickName}
                />
                <CloseSharpIcon
                  sx={{
                    // fill: req.friend.online ? "green" : "red",
                    mr: "12px",
                    width: "12px",
                    height: "12px",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Blocked</Typography>
        </AccordionSummary>
        <List></List>
      </Accordion>
    </>
  );
};

export default ManageFriendAccordian;
