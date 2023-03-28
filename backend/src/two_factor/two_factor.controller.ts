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
    const twoFactor = await this.twoFactorService.findOne(+id);

    if (!twoFactor) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return twoFactor;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTwoFactorDto: UpdateTwoFactorDto) {
  //   return this.twoFactorService.update(+id, updateTwoFactorDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.twoFactorService.remove(+id);
  }
}
