import { Module } from '@nestjs/common';
import { ChatLineService } from './chat_line.service';
import { ChatLineController } from './chat_line.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatLine } from './entities/chat_line.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatLine]), ConfigModule],
  controllers: [ChatLineController],
  providers: [ChatLineService],
  exports: [ChatLineService, TypeOrmModule],
})
export class ChatLineModule {}
