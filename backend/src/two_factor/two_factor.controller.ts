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
} from '@nestjs/common';
import { TwoFactorService } from './two_factor.service';
import { CreateTwoFactorDto } from './dto/create-two_factor.dto';
// import { UpdateTwoFactorDto } from './dto/update-two_factor.dto';

@Controller('two-factor')
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @Post()
  create(@Body() createTwoFactorDto: CreateTwoFactorDto) {
    return this.twoFactorService.create(createTwoFactorDto);
  }

  @Get()
  async findAll() {
    const twoFactor = this.twoFactorService.findAll();
    if (!twoFactor) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTwoFactorDto: UpdateTwoFactorDto) {
  //   return this.twoFactorService.update(+id, updateTwoFactorDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const twoFactor_raw = await this.twoFactorService.findOne(+id);
    const twoFactor = await this.twoFactorService.remove(+id);
    Logger.log(`[twoFactor] Trying to delete twoFactor with id = [${id}]`);

    if (!twoFactor || twoFactor.affected === 0) {
      Logger.log(`[twoFactor] twoFactor with id = [${id}] doeesn't exist`);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    twoFactor.raw = twoFactor_raw;
    Logger.log(`[twoFactor] Deleted twoFactor with id = [${id}]`);
    return twoFactor;
  }
}
