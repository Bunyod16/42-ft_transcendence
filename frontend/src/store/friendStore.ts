import { create } from 'zustand';

// Make friendStore Persist

type status = "Online" | "In Game" | "Offline";
type friendship = "Block" | "Pending" | "Friend";

interface FriendObject {
	name: string;
	status: status;
	friendship: friendship;
}

interface FriendStoreType {
	friends: FriendObject[] | [];
	addToFriend: (friend: FriendObject) => void;
	updateStatus: (friend: FriendObject) => void;
	updateFriendship: (friend: FriendObject) => void;

}

const friendStore = create<FriendStoreType>((set)=>({
	friends: [],
	addToFriend: (friend: FriendObject) =>{
		set((state) => (
			{friends: [...state.friends, friend]}
		))
	},
	updateStatus: (friend: FriendObject) => {
		set((state)=> (
			{friends: state.friends.map( x => {
				if (x.name === friend.name)
					x.status = friend.status;
				return x;
			})
		}
		))
	},
	updateFriendship: (friend: FriendObject) =>{
		set((state) => (
			{friends: state.friends.map( x =>{
				if (x.name === friend.name)
					x.friendship = friend.friendship;
				return x
			})}
		))
	}
	}))