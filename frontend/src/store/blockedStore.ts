import { FriendType } from "@/types/social-type";
import { create } from "zustand";
import axios from "axios";
import { get } from "http";

interface BlockedStoreType {
  blocked: FriendType[];
  setBlocked: (data: any[]) => void;
  clearBlocked: () => void;
  updateBlocked: () => void;
}

const useBlockStore = create<BlockedStoreType>()((set, get) => ({
  blocked: [],
  setBlocked: (data: any[]) => {
    const blockedList: FriendType[] = [];
    data.map((tmp) => {
      blockedList.push({ ...tmp.friend, chatChannel: tmp.chatChannels });
    });
    set(() => ({
      blocked: blockedList,
    }));
  },
  clearBlocked: () => {
    set(() => ({
      blocked: [],
    }));
  },
  updateBlocked: async () => {
    const res = await axios.get("/friend-request/findUserBlockedFriends");
    get().setBlocked(res.data);
  },
}));

export default useBlockStore;
//blocked user api. http://localhost:3000/friend-request/findUserBlockedFriends
// [
//     {
//         "friendRequest": {
//             "id": 10,
//             "createdAt": "2023-04-10T00:43:45.586Z",
//             "friendStatus": "blocked"
//         },
//         "friend": {
//             "id": 1,
//             "nickName": "nazrinshahaf",
//             "created_at": "2023-03-27T23:11:58.459Z",
//             "updated_at": "2023-03-28T00:04:42.449Z",
//             "wins": 0,
//             "losses": 0,
//             "online": false
//         }
//     },
//     {
//         "friendRequest": {
//             "id": 40,
//             "createdAt": "2023-04-10T03:39:49.154Z",
//             "friendStatus": "blocked"
//         },
//         "friend": {
//             "id": 2,
//             "nickName": "nazrinshahaf2",
//             "created_at": "2023-03-27T23:13:06.950Z",
//             "updated_at": "2023-03-27T23:13:06.950Z",
//             "wins": 0,
//             "losses": 0,
//             "online": false
//         }
//     },
// ]
