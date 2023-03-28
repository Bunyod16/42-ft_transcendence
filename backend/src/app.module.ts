import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
		UserModule,
		ConfigModule.forRoot({ isGlobal: true }),
		MatchesModule,
	],
  controllers: [
		AppController,
	],
  providers: [
		AppService,
	],
})

export class AppModule {}
