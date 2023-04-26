import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BlockedUserType {
	id: number;
	nickName: string;
	img?: string;
}

interface BlockedStoreType{
	users: BlockedUserType[] | [];
	setUsers: (blockedQuery: any) => void;
	clearUsers: () => void;
}

const useBlockStore = create<BlockedStoreType>()(
	persist((set) => ({
		users: [],
		setUsers: (blockedQuery: any) => {
			let blockedList: BlockedUserType[];

			blockedQuery.map((query: any) => {
				blockedList.push({
					id: query.friend.id,
					nickName: query.friend.nickName
				})
			})
			set(()=>({
				users: blockedList
			}))
		},
		clearUsers: () => {
			set(()=>({
				users: [],
			}))
		}
	}),{
		name: "rgm-blocked-user-store",
		storage: createJSONStorage(() => sessionStorage)
	})
)

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