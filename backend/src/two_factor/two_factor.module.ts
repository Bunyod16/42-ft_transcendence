import { Module } from '@nestjs/common';
import { TwoFactorService } from './two_factor.service';
import { TwoFactorController } from './two_factor.controller';
import { ConfigModule } from '@nestjs/config';
import { twoFactorProviders } from './two_factor.providers';

@Module({
  imports: [ConfigModule],
  controllers: [TwoFactorController],
  providers: [...twoFactorProviders, TwoFactorService],
})
export class TwoFactorModule {}
