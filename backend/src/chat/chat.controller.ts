import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/auth.guard';

@UseGuards(UserAuthGuard)
@Controller('chat')
export class ChatController {
}
