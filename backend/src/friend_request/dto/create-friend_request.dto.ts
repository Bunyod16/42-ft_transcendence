import { Allow, IsNumber } from 'class-validator';
import { FriendStatus } from '../entities/friend_request.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateFriendRequestDto {

  @IsNumber()
  id: number;

  @Allow()
  friendStatus: FriendStatus;

  @Allow()
  requester: User;

  @Allow()
  responder: User;
}
