import { create } from 'zustand';
import { persist } from "zustand/middleware";

interface DirectMessageType {
	id: number;
	chatChannel: {
		id: number;
		name: string | null;
		channelType: string;
		chatType: string;
	}
}

interface FriendType {
	id: number;
	nickName: string;
	wins: number;
	losses: number;
	online: boolean;
	directMessage: DirectMessageType;
}

interface FriendsStoreType {
	friends: FriendType[] | [];
	setFriendList: (friendQuery : any) => void;
	resetFriendList: () => void;
}

const useFriendsStore = create<FriendsStoreType>()(
	persist((set) => ({
		friends: [],
		setFriendList: (friendQuery : any) => {
			let friendList: FriendType[];

			friendQuery.map((query: any) => {
				friendList.push({
					id: query.friend.id,
					nickName: query.friend.nickName,
					wins: query.friend.wins,
					losses: query.friend.losses,
					online: query.friend.online,
					directMessage: {
						id: query.directMessage.id,
						chatChannel: {
							id: query.directMessage.chatChannel.id,
							name: query.directMessage.chatChannel.name,
							channelType: query.directMessage.chatChannel.channelType,
							chatType: query.directMessage.chatChannel.chatType,
						}
					}
				})
			})
			set(()=>({
				friends: friendList,
			}))
		},
		resetFriendList: () => {
			set(()=>({
				friends:[]
			}))
		}
	}),{
		name:"rgm-friend-state"
	})
)

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