import { Controller, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { Get, Post, Request } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('queue')
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  // @Post()
  // @UseGuards(UserAuthGuard)
  // @ApiCookieAuth()
  // async queueUser(@Request() req) {
  //   this.queueService.addUserToQueue(req.user);
  // }

  @Get()
  @UseGuards(UserAuthGuard)
  @ApiCookieAuth()
  async getQueue(@Request() req) {
    return this.queueService.getQueue();
  }
}
