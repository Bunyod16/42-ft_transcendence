import usePendingFriendStore from "@/store/pendingFriendStore";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Image from "next/image";
import { useEffect } from "react";
import axios from "axios";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";

const PendingBox = () => {
  const [incomingReqs, outgoingReqs, setRequests] = usePendingFriendStore(
    (state) => [
      state.incomingRequests,
      state.outgoingRequests,
      state.setRequests,
    ],
  );

  //
  const acceptFriendRequest = (id: number) => {
    axios
      .patch("/friend-request/updateByFriendId", {
        friendId: id,
        friendStatus: "Accepted",
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get("/friend-request/findUserPendingRequest")
      .then((res) => {
        // console.log(res);
        setRequests(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <List
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      aria-label="contacts"
    >
      {/** map new incoming state */}
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
          <Image
            src={"/jakoh_smol.jpg"}
            alt={req.friend.nickName}
            width={32}
            height={32}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50px",
            }}
          />
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
            <Image
              src={"/jakoh_smol.jpg"}
              alt={req.friend.nickName}
              width={32}
              height={32}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50px",
              }}
            />
            <ListItemText sx={{ ml: "12px" }} primary={req.friend.nickName} />
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
  );
};

export default PendingBox;
