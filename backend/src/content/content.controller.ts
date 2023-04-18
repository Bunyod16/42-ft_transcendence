import { Controller, Post, UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator, Logger, HttpStatus, Body, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserService } from 'src/user/user.service';
import RequestWithUser from 'src/auth/requestWithUser.interace';
import { User } from 'src/user/entities/user.entity';

@Controller('content')
export class ContentController {
  private readonly logger = new Logger(ContentController.name);

  constructor(private userService: UserService){}

  @UseGuards(UserAuthGuard)
	@Post('upload_avatar')
  @UseInterceptors(
    FileInterceptor('avatar',
    {
      storage: diskStorage({
        destination: 'avatars/',
        filename: (req: RequestWithUser, file: Express.Multer.File, callback) => {
          callback(null, req.user.id + '-' + req.user.nickName + '.' + file.originalname.split('.').pop());
        }
      })
    }
    )
  )
	async uploadAvatar(
    @Req() req: RequestWithUser,
    @UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/png' }),
        new MaxFileSizeValidator({ maxSize: 2000000 })
      ],
      errorHttpStatusCode: HttpStatus.BAD_REQUEST
    })
    )
    file: Express.Multer.File) {
    const { user } = req;

    const filename = user.id + '-' + user.nickName + '.' + file.originalname.split('.').pop();
    this.logger.log(`Saving avatar for user ${user.nickName} to ${file.destination} as ${filename}`);

    const retUser: User = await this.userService.findOne(user.id);

    // if (retUser.avatar !== 'default-stormtrooper.png') {
    //   delete previous pp
    // }

    await this.userService.update(user.id, {
      avatar: filename
    });

    return "File successfully uploaded";
	}
}
