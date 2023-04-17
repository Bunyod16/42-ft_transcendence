import { User } from 'src/user/entities/user.entity';


export class Room {
	private users: User[];
	private channelId: number;
	constructor() {
		this.users = [];
	}

	private addUser(user: User){
		this.users = [
			...this.users,
			user
		];
	}

	private removeUser(userId: number){
		this.users = this.users.filter(connectedUser => connectedUser.id != userId);
	}
}
