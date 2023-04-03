import { DataSource } from 'typeorm';
import { ChatLine } from './entities/chat_line.entity';

export const chatLineProviders = [
  {
    provide: 'CHAT_LINE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ChatLine),
    inject: ['DATA_SOURCE'],
  },
];
