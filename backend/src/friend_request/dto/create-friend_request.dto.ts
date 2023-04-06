import { FriendStatus } from '../entities/friend_request.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateFriendRequestDto {
  id: number;
  friendStatus: FriendStatus;
  requester: User;
  responder: User;
}
