import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../components/apiClient/apiClient";

interface RequestType {
  friend: {
    id: number;
    nickName: string;
    online: boolean;
  };
}

interface PendingRequest {
  incomingRequests: RequestType[];
  outgoingRequests: RequestType[];
}

interface pendingFriendStoreType {
  incomingRequests: RequestType[];
  outgoingRequests: RequestType[];
  setRequests: (pendingRequest: PendingRequest) => void;
  updateRequests: () => void;
  resetRequests: () => void;
}

const usePendingFriendStore = create<pendingFriendStoreType>()(
  persist(
    (set, get) => ({
      incomingRequests: [],
      outgoingRequests: [],
      setRequests: (pendingRequest: PendingRequest) => {
        const inReq: RequestType[] = [];
        const outReq: RequestType[] = [];
        // console.log(pendingRequest);
        if (pendingRequest.incomingRequests.length) {
          pendingRequest.incomingRequests.map((req) => {
            inReq.push({ friend: req.friend });
          });
        }
        if (pendingRequest.outgoingRequests.length)
          pendingRequest.outgoingRequests.map((req) => {
            outReq.push({ friend: req.friend });
          });
        set(() => ({
          incomingRequests: inReq,
          outgoingRequests: outReq,
        }));
      },
      updateRequests: async () => {
        const res = await axios.get("/friend-request/findUserPendingRequest");
        get().setRequests(res.data);
      },
      resetRequests: () => {
        set(() => ({
          incomingRequests: [],
          outgoingRequests: [],
        }));
      },
    }),
    {
      name: "rgm-friend-request-store",
    },
  ),
);

export default usePendingFriendStore;

//pending user api. http://localhost:3000/friend-request/findUserPendingRequest
// {
// 	"incomingRequest": [
// 		   {
// 			   "friendRequest": {
// 				   "id": 55,
// 				   "createdAt": "2023-04-18T02:44:57.230Z",
// 				   "friendStatus": "pending"
// 			   },
// 			   "friend": {
// 				   "id": 13,
// 				   "nickName": "jakoh",
// 				   "created_at": "2023-04-17T00:55:31.019Z",
// 				   "updated_at": "2023-04-17T02:24:58.607Z",
// 				   "wins": 0,
// 				   "losses": 0,
// 				   "online": false
// 			   }
// 		   },
// 	 ],
// 	  "outgoingRequests": [
// 		   {
// 			   "friendRequest": {
// 				   "id": 50,
// 				   "createdAt": "2023-04-18T02:44:44.656Z",
// 				   "friendStatus": "pending"
// 			   },
// 			   "friend": {
// 				   "id": 6,
// 				   "nickName": "test",
// 				   "created_at": "2023-03-30T00:52:23.109Z",
// 				   "updated_at": "2023-03-30T00:52:23.109Z",
// 				   "wins": 0,
// 				   "losses": 0,
// 				   "online": false
// 			   }
// 		   },
// 	 ]
//    }
