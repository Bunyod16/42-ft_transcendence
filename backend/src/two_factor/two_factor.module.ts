import { Module } from '@nestjs/common';
import { TwoFactorService } from './two_factor.service';
import { TwoFactorController } from './two_factor.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [TwoFactorController],
  providers: [TwoFactorService],
})
export class TwoFactorModule {}
