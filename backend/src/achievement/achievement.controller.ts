import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Logger,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { Achievement } from './entities/achievement.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('achievement')
@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  async create(@Body() createAchievementDto: CreateAchievementDto) {
    try {
      const achievement = await this.achievementService.create(
        createAchievementDto,
      );

      if (!achievement) {
        Logger.log("Couldn't create achievement", 'Achievement => create()');
        throw new HttpException(
          `Internal Server Error: Couldn't create achievement`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      Logger.log(
        `Created achievement with id = [${achievement.id}]`,
        'Achievement => create()',
      );

      return achievement;
    } catch (error) {
      Logger.error(`achievement couldn't be added`, `Achievement => create()`);
      Logger.error(error, `Achievement => create()`);
      throw new HttpException(
        'Internal Server Error: Some Bad Shit Happened',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    const achievement = this.achievementService.findAll();

    Logger.log(`Getting all in achievement`, 'Achievement => findAll()');

    if (!achievement) {
      Logger.log(`Cant find matches table`, 'Achievement => findAll()');
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return achievement;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const achievement = await this.achievementService.findOne(id);

    Logger.log(
      `Trying to get achievement with id = [${id}]`,
      'Achievement => findOne()',
    );

    if (!achievement) {
      Logger.log(
        `achievement with id = [${id}] doeesn't exist`,
        'Achievement => findOne()',
      );
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return achievement;
  }

  @Patch(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Query('name') name: string,
    @Query('description') description: string,
    @Body() updateAchievementDto: UpdateAchievementDto,
  ) {
    const achievement: Achievement = await this.achievementService.findOne(id);

    if (!achievement) {
      Logger.log(
        `achievement with id = [${id}] doesn't exist`,
        `Achievement => updateText()`,
      );
      throw new HttpException(
        'Not Found: Achivement doesnt exists',
        HttpStatus.NOT_FOUND,
      );
    }

    updateAchievementDto.name = name ?? achievement.name;
    updateAchievementDto.description = description ?? achievement.description;

    try {
      const res = await this.achievementService.update(
        id,
        updateAchievementDto,
      );

      res.raw = await this.achievementService.findOne(id);
      return res;
    } catch (error) {
      Logger.error(
        `achievement with id = [${id}] couldn't be updated`,
        `Achievement => updateText()`,
      );
      Logger.error(error, `Achievement => updateText()`);
      throw new HttpException(
        'BAD_REQUEST: Achivement duplicate name or description',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const achieivement_raw = await this.achievementService.findOne(id);
      const achieivement = await this.achievementService.remove(id);
      Logger.log(
        `Trying to delete achievement with id = [${id}]`,
        'Achievement => remove()',
      );

      if (!achieivement || achieivement.affected === 0) {
        Logger.log(
          `achievement with id = [${id}] doesn't exist`,
          'Achievement => remove()',
        );
        throw new HttpException(
          "Not Found: achievement doeesn't exist",
          HttpStatus.NOT_FOUND,
        );
      }
      Logger.log(
        `Deleted achieivement with id = [${id}]`,
        'Achievement => remove()',
      );

      achieivement.raw = achieivement_raw;
      return achieivement;
    } catch (error) {
      Logger.error(error, `Achievement => remove()`);
      throw new HttpException(
        `Internal Server Error: Some bad shit happened`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
