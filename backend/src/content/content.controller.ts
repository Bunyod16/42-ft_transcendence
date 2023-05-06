import {
  Controller,
  Post,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Logger,
  HttpStatus,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserService } from 'src/user/user.service';
import RequestWithUser from 'src/auth/requestWithUser.interace';
import * as fs from 'node:fs';
import { ConfigService } from '@nestjs/config';

@Controller('content')
export class ContentController {
  private readonly logger = new Logger(ContentController.name);

  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @UseGuards(UserAuthGuard)
  @Post('upload_avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (req: RequestWithUser, _, cb) => {
          const avatarFilename = `avatars/${req.user.avatar.split('/').pop()}`;
          if (avatarFilename !== 'default-stormtrooper.png') {
            if (fs.existsSync(avatarFilename)) fs.unlinkSync(avatarFilename);
          }
          cb(null, 'avatars/');
        },
        filename: (
          req: RequestWithUser,
          file: Express.Multer.File,
          callback,
        ) => {
          callback(
            null,
            'avatar-userId-' +
              req.user.id +
              '.' +
              file.originalname.split('.').pop(),
          );
        },
      }),
    }),
  )
  async uploadAvatar(
    @Req() req: RequestWithUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
          new MaxFileSizeValidator({ maxSize: 2000000 }),
        ],
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    file: Express.Multer.File,
  ) {
    const { user } = req;
    // const cdnURI: string = 'http://localhost:7001'; //delete this later
    const cdnURI: string =
      this.configService.get('HOST_URL') +
      ':' +
      this.configService.get<number>('CDN_PORT').toString();
    const avatarURL: string = `${cdnURI}/avatar/${file.filename}`;

    this.logger.log(
      `Saving avatar for user ${user.nickName} to ${process.cwd()}/${
        file.destination
      } as ${file.filename}`,
    );

    await this.userService.update(user.id, {
      avatar: avatarURL,
    });

    return {
      message: 'File successfully uploaded',
      avatarURI: avatarURL,
    };
  }
}
