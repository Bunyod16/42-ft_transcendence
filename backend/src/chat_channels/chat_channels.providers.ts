import { DataSource } from 'typeorm';
import { ChatChannel } from './entities/chat_channel.entity';

export const chatChannelProviders = [
  {
    provide: 'CHAT_CHANNEL_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ChatChannel),
    inject: ['DATA_SOURCE'],
  },
];
