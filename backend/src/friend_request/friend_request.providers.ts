import { DataSource } from 'typeorm';
import { FriendRequest } from './entities/friend_request.entity';

export const friendRequestProviders = [
  {
    provide: 'FRIEND_REQUEST_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(FriendRequest),
    inject: ['DATA_SOURCE'],
  },
];
