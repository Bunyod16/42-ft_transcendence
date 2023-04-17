import { Controller, Post, UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator, Logger, HttpStatus, Body, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserService } from 'src/user/user.service';
import RequestWithUser from 'src/auth/requestWithUser.interace';

@Controller('content')
export class ContentController {
  private readonly logger = new Logger(ContentController.name);

  constructor(private userService: UserService){}

  @UseGuards(UserAuthGuard)
	@Post('upload_avatar')
  @UseInterceptors(
    FileInterceptor('file',
    {
      storage: diskStorage({
        destination: '../../avatars/',
        filename: (req: RequestWithUser, file: Express.Multer.File, callback) => {
          const dateObj = new Date();
          const dateSuffix = dateObj.getFullYear() + dateObj.getMonth() + dateObj.getDay();
          callback(null, dateSuffix + '-' + req.user.nickName + '.' + file.originalname.split('.').pop());
        }
      })
    }
    )
  )
	async uploadFile(
    @Req() req: RequestWithUser,
    @Body() body: Request,
    @UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/png' }),
        new MaxFileSizeValidator({ maxSize: 2048 })
      ],
      errorHttpStatusCode: HttpStatus.BAD_REQUEST
    })
  ) file: Express.Multer.File) {
    this.logger.log(`Saving avatar for user ${req.user.nickName} to ${file.destination}`);
    const dateObj = new Date();
    const dateSuffix = dateObj.getFullYear() + dateObj.getMonth() + dateObj.getDay();
    const filename = dateSuffix + '-' + req.user.nickName + '.' + file.originalname.split('.').pop();

    await this.userService.update(req.user.id, {
      avatar: filename
    });

    return "File successfully uploaded";
	}
}
