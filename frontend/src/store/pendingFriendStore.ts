import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RequestType {
  id: number;
  nickName: string;
  online: boolean;
}

interface pendingFriendStoreType {
  incomingRequests: RequestType[];
  outgoingRequests: RequestType[];
  setRequests: (pendingRequest: any) => void;
  resetRequests: () => void;
}

const usePendingFriendStore = create<pendingFriendStoreType>()(
  persist(
    (set) => ({
      incomingRequests: [],
      outgoingRequests: [],
      setRequests: (pendingRequest: any) => {
        let inReq: RequestType[];
        let outReq: RequestType[];
        pendingRequest.incomingRequest.map((req: any) => {
          inReq.push({
            id: req.friend.id,
            nickName: req.friend.nickName,
            online: req.friend.online,
          });
        });
        pendingRequest.outgoingRequest.map((req: any) => {
          outReq.push({
            id: req.friend.id,
            nickName: req.friend.nickName,
            online: req.friend.online,
          });
        });
        set(() => ({
          incomingRequests: inReq,
          outgoingRequests: outReq,
        }));
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
