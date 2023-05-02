import usePendingFriendStore from "@/store/pendingFriendStore";
import {
  Accordion,
  AccordionSummary,
  Typography,
  List,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  AccordionDetails,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { FriendType } from "@/types/social-type";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import { toast } from "react-hot-toast";

const ManageFriendAccordian = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [incomingReqs, outgoingReqs, updateRequests] = usePendingFriendStore(
    (state) => [
      state.incomingRequests,
      state.outgoingRequests,
      state.updateRequests,
    ],
  );
  const [blockedFriends, setBlockedFriends] = useState<FriendType[]>([]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  // get pending and blocked friend
  useEffect(() => {
    updateRequests();
  }, []);

  const acceptFriendRequest = (id: number) => {
    axios
      .patch("/friend-request/updateByFriendId", {
        friendId: id,
        friendStatus: "Accepted",
      })
      .then((res) => {
        alert("Accepted fren");
        updateRequests();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteFriend = (friendId: number) => {
    axios
      .delete(`/friend-request/deleteFriendRequestByFriendId`, {
        data: {
          friendId: friendId,
        },
      })
      .then(() => {
        toast.success("Deleltate");
        // alert("DELTEE FREN");
        updateRequests();
        console.log("where toast");
      });
  };

  const handleDeleteReq = (friendId: number) => {
    console.log("delete req");
    axios
      .delete(`/friend-request/deleteFriendRequestByFriendId`, {
        data: {
          friendId: friendId,
        },
      })
      .then(() => {
        toast.success("Deleltate req");
        // alert("DELTEE FREN");
        updateRequests();
        console.log("where toast delte req");
      });
  };

  useEffect(() => {
    axios.get("/friend-request/findUserBlockedFriends").then((res) => {
      const tmps: any[] = res.data;
      const tmpBlocked: FriendType[] = [];
      tmps.map((tmp) => {
        tmpBlocked.push({ ...tmp.friend, chatChannel: tmp.chatChannels });
      });
      setBlockedFriends(tmpBlocked);
      console.log(tmpBlocked);
    });
  }, []);

  return (
    <>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
        sx={{}}
      >
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          sx={{}}
        >
          <Typography>Pending</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {incomingReqs.length || outgoingReqs.length ? (
            <List disablePadding sx={{ maxHeight: 200, overflow: "auto" }}>
              {incomingReqs.map((req, index) => (
                <ListItem key={index} disablePadding>
                  {/** Need to change src to img thingy */}
                  <ListItemButton
                    disableRipple
                    sx={{ cursor: "default", padding: "4px 8px" }}
                  >
                    <ListItemText
                      sx={{ ml: "12px" }}
                      primary={req.friend.nickName}
                    />
                    <IconButton
                      onClick={() => acceptFriendRequest(req.friend.id)}
                    >
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
                  </ListItemButton>
                </ListItem>
              ))}
              {/** map new outgoing state */}
              {outgoingReqs.map((req, index) => (
                <ListItem key={index} disablePadding>
                  {/** Need to change src to img thingy */}
                  <ListItemButton
                    disableRipple
                    sx={{ cursor: "default", padding: "4px 8px" }}
                  >
                    <ListItemText
                      sx={{ ml: "12px" }}
                      primary={req.friend.nickName}
                    />
                    <IconButton onClick={() => handleDeleteReq(req.friend.id)}>
                      <CloseSharpIcon />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              sx={{ color: "gray" }}
            >{`Nothing here... :')`}</Typography>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Blocked</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {blockedFriends.length ? (
            <List disablePadding sx={{ maxHeight: 200, overflow: "auto" }}>
              {blockedFriends.map((friend, index) => (
                <ListItem key={index} disablePadding>
                  {/** Need to change src to img thingy */}
                  <ListItemButton
                    disableRipple
                    sx={{ cursor: "default", padding: "4px 8px" }}
                  >
                    <ListItemText
                      sx={{ ml: "12px" }}
                      primary={friend.nickName}
                    />
                    <IconButton onClick={() => handleDeleteFriend(friend.id)}>
                      <DeleteSharpIcon />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ color: "gray" }}>{`Nothing here :)`}</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ManageFriendAccordian;
