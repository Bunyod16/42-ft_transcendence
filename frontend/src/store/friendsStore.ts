import { FriendType } from "@/types/social-type";
import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FriendsStoreType {
  friends: FriendType[] | [];
  setFriendList: (friendQuery: any[]) => void;
  resetFriendList: () => void;
  setOnline: (friend: FriendType) => void;
  setOffline: (friend: FriendType) => void;
  updateFriendList: () => void;
}

const useFriendsStore = create<FriendsStoreType>()(
  persist(
    (set, get) => ({
      friends: [],
      setFriendList: (friendQuery) => {
        const friendList: FriendType[] = [];
        friendQuery.map((query) => {
          friendList.push({
            // id: query.id,
            // nickName: query.nickName,
            // avatar: query.avatar,
            // wins: query.wins,
            // losses: query.losses,
            // online: query.online,
            ...query.friend,
            chatChannel: query.directMessage,
          });
        });
        console.log("firendList: ", friendList);
        set(() => ({
          friends: friendList,
        }));
      },
      resetFriendList: () => {
        set(() => ({
          friends: [],
        }));
      },
      setOnline: (friend: FriendType) => {
        const friendList: FriendType[] = [];
        get().friends.map((qFriend) => {
          if (qFriend.id == friend.id) {
            qFriend.online = true;
          }
          friendList.push(qFriend);
        });
        set(() => ({ friends: friendList }));
      },
      setOffline: (friend: FriendType) => {
        const friendList: FriendType[] = [];
        get().friends.map((qFriend) => {
          if (qFriend.id == friend.id) {
            qFriend.online = false;
          }
          friendList.push(qFriend);
        });
        set(() => ({ friends: friendList }));
      },
      updateFriendList: async () => {
        const res = await axios.get(
          "/friend-request/findUserFriendsWithDirectMessage",
        );
        get().setFriendList(res.data);
        return;
      },
    }),
    {
      name: "rgm-friend-state",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useFriendsStore;

// axios get request to be made to
// http://localhost:3000/friend-request/findUserFriendsWithDirectMessage
// JSON Object return Looks like
// {
// 	"friendRequest": {
// 		"id": 10,
// 		"createdAt": "2023-04-10T00:43:45.586Z",
// 		"friendStatus": "accepted"
// 	},
// 	"friend": {
// 		"id": 1,
// 		"nickName": "nazrinshahaf",
// 		"created_at": "2023-03-27T23:11:58.459Z",
// 		"updated_at": "2023-03-28T00:04:42.449Z",
// 		"wins": 0,
// 		"losses": 0,
// 		"online": false
// 	},
// 	"directMessage": {
// 		"id": 117,
// 		"joinedAt": "2023-04-13T00:55:39.876Z",
// 		"isAdmin": false,
// 		"isBlacklisted": false,
// 		"mutedUntil": null,
// 		"chatChannel": {
// 			"id": 87,
// 			"name": null,
// 			"created_at": "2023-04-13T00:55:39.850Z",
// 			"channel_type": "private",
// 			"chatType": "direct_message"
// 		}
// 	}
// },
