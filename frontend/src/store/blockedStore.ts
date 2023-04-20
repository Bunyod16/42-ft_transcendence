import { create } from "zustand";
import { persist } from "zustand/middleware";

interface blockedUserType {
	id: number;
	nickName: string;
}



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