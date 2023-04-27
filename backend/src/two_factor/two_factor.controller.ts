import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Logger,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TwoFactorService } from './two_factor.service';
// import { UpdateTwoFactorDto } from './dto/update-two_factor.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { CustomException } from 'src/utils/app.exception-filter';
import { User } from 'src/user/entities/user.entity';

@ApiTags('two-factor')
@Controller('two-factor')
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @Post(':userId')
  @UseGuards(UserAuthGuard)
  async create(@Req() req: any) {
    const userId = req.user.id;
    const twoFactor = await this.twoFactorService.create(userId);

    Logger.log(
      `Created TwoFactor for user with id = [${userId}]`,
      'TwoFactor => create()',
    );

    console.log(twoFactor);
    return twoFactor;
  }

  @Post(':userId/verify')
  @UseGuards(UserAuthGuard)
  async verify(
    @Req() req: any,
    @Query('twoFactorToken') twoFactorToken: string,
  ) {
    const userId = req.user.id;
    const verification = await this.twoFactorService.verifyTwoFactor(
      userId,
      twoFactorToken,
    );

    Logger.log(
      `Trying to get verify TwoFactor for user with id = [${userId}]`,
      'TwoFactor => verify()',
    );

    return verification;
  }

  @Post(':userId/verify-testing')
  async verifyTesting(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('twoFactorToken') twoFactorToken: string,
  ) {
    const verification = await this.twoFactorService.verifyTwoFactor(
      userId,
      twoFactorToken,
    );

    Logger.log(
      `Trying to get verify-testing TwoFactor for user with id = [${userId}]`,
      'TwoFactor => verify()',
    );

    return verification;
  }

  @Get()
  async findAll() {
    const twoFactor = this.twoFactorService.findAll();
    if (!twoFactor) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return twoFactor;
  }

  @Get('/user-two-factor')
  @UseGuards(UserAuthGuard)
  async findUserTwoFactor(@Req() req: any) {
    const user: User = req.user;
    const twoFactor = await this.twoFactorService.findOneWithUserId(user.id);

    Logger.log(
      `Finding TwoFactor for User with id = [${user.id}]`,
      'TwoFactor => findUserTwoFactor()',
    );

    return twoFactor;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    Logger.log(`[twoFactor] Trying to get twoFactor with id = [${id}]`);
    const twoFactor = await this.twoFactorService.findOne(+id);

    if (!twoFactor) {
      Logger.log(`[twoFactor] twoFactor with id = [${id}] doeesn't exist`);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return twoFactor;
  }

  @Get(':userId/user-two-factor-testing')
  async findUserTwoFactorTesting(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const twoFactor = await this.twoFactorService.findOneWithUserId(userId);
    if (twoFactor) return true;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTwoFactorDto: UpdateTwoFactorDto) {
  //   return this.twoFactorService.update(+id, updateTwoFactorDto);
  // }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    // const twoFactor_raw = await this.twoFactorService.findOne(id);
    const twoFactor = await this.twoFactorService.remove(id);
    Logger.log(`[twoFactor] Trying to delete twoFactor with id = [${id}]`);

    if (!twoFactor || twoFactor.affected === 0) {
      Logger.log(`[twoFactor] twoFactor with id = [${id}] doeesn't exist`);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    // twoFactor.raw = twoFactor_raw;
    Logger.log(`[twoFactor] Deleted twoFactor with id = [${id}]`);
    return twoFactor;
  }
}
