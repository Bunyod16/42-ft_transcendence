import { Module } from '@nestjs/common';
import { TwoFactorService } from './two_factor.service';
import { TwoFactorController } from './two_factor.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwoFactor } from './entities/two_factor.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TwoFactor]), ConfigModule, UserModule],
  controllers: [TwoFactorController],
  providers: [TwoFactorService],
  exports: [TwoFactorService, TypeOrmModule],
})
export class TwoFactorModule {}
