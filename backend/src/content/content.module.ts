import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ContentController } from './content.controller';
import { diskStorage } from 'multer';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: 'uploads/',
        filename: (_, file: Express.Multer.File, callback) => {
          const dateObj = new Date();
          const dateSuffix =
            dateObj.getFullYear() + dateObj.getMonth() + dateObj.getDay();
          callback(
            null,
            dateSuffix +
              '-' +
              file.fieldname +
              '.' +
              file.originalname.split('.').pop(),
          );
        },
      }),
    }),
    UserModule,
    ConfigModule,
  ],
  controllers: [ContentController],
})
export class ContentModule {}
