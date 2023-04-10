import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Logger,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { ApiTags } from '@nestjs/swagger';
import { CustomException } from 'src/utils/app.exception-filter';

@ApiTags('achievement')
@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  async create(
    @Body('name') achievemnt_name: string,
    @Body('description') achievemnt_des: string,
  ) {
    if (
      typeof achievemnt_name === 'undefined' ||
      typeof achievemnt_des === 'undefined'
    )
      throw new CustomException(
        `Body bad request parameters`,
        HttpStatus.BAD_REQUEST,
        `Achievement => create()`,
      );

    try {
      const achievement = await this.achievementService.create(
        achievemnt_name,
        achievemnt_des,
      );

      Logger.log(
        `Created Achievement with id = [${achievement.id}]`,
        'Achievement => create()',
      );

      return achievement;
    } catch (error) {
      throw new CustomException(
        `Achivement already exist`,
        HttpStatus.BAD_REQUEST,
        `Achievement => create()`,
      );
    }
  }

  @Get()
  async findAll() {
    const achievement = this.achievementService.findAll();

    if (!achievement) {
      throw new CustomException(
        `Cant find Achievements table`,
        HttpStatus.BAD_REQUEST,
        `Achievement => findAll()`,
      );
    }

    Logger.log(`Getting all Achievements`, 'Achievement => findAll()');

    return achievement;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const achievement = await this.achievementService.findOne(id);

    Logger.log(
      `Getting achievement with id = [${id}]`,
      'Achievement => findOne()',
    );

    return achievement;
  }

  @Get(':name/name')
  async findOneName(@Param('name') name: string) {
    if (typeof name !== 'string')
      throw new CustomException(
        `Param bad request parameters`,
        HttpStatus.BAD_REQUEST,
        `Achievement => findOneName()`,
      );

    const achievement = await this.achievementService.findOneName(name);
    Logger.log(
      `Getting achievement with name = [${name}]`,
      'Achievement => findOneName()',
    );

    return achievement;
  }

  @Patch(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Query('name') name: string,
    @Query('description') description: string,
  ) {
    if (typeof name === 'undefined' && typeof description === 'undefined') {
      throw new CustomException(
        `Query bad request parameters`,
        HttpStatus.BAD_REQUEST,
        `Achievement => findOneName()`,
      );
    }

    const achievement = await this.achievementService.update(
      id,
      name,
      description,
    );

    return achievement;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.achievementService.remove(id);
  }
}
