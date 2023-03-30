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

@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  async create(@Body() createAchievementDto: CreateAchievementDto) {
    //If Achievement Text already exists
    const achievement_dup: Achievement =
      await this.achievementService.findOneText(createAchievementDto.text);
    if (achievement_dup !== null) {
      Logger.log(
        `achievement with text = [${createAchievementDto.text}] already exist`,
        `[Achievement => updateText()]`,
      );
      throw new HttpException(
        'Bad Request: Achievement Text Already Exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const achievement = await this.achievementService.create(
        createAchievementDto,
      );

      if (!achievement) {
        Logger.log("Couldn't create achievement", 'Achievement => create()');
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      Logger.log(
        `Created Achievement with id = [${achievement.id}]`,
        'Achievement => create()',
      );

      return achievement;
    } catch (error) {
      Logger.error(
        `achievement Couldn't be Added`,
        `[Achievement => create()]`,
      );
      Logger.error(error, `[Achievement => create()]`);
      throw new HttpException(
        'Internal Server Error: Some Bad Shit Happened',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    const achievement = this.achievementService.findAll();

    Logger.log(`Trying to get all matches`, 'Achievement => findAll()');

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

  @Patch(':id/updateText')
  async updateText(
    @Param('id', ParseIntPipe) id: number,
    @Query('text') text: string,
    @Body() updateAchievementDto: UpdateAchievementDto,
  ) {
    const achievement: Achievement = await this.achievementService.findOne(id);
    if (!achievement) {
      Logger.log(
        `achievement with id = [${id}] doesn't exist`,
        `[Achievement => updateText()]`,
      );
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    //check if achieivement already exist
    const achievement_dup: Achievement =
      await this.achievementService.findOneText(text);
    if (achievement_dup !== null) {
      Logger.log(
        `achievement with text = [${text}] already exist`,
        `[Achievement => updateText()]`,
      );
      throw new HttpException(
        'Not Modified: Achievement Text Already Exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    updateAchievementDto.text = text ?? achievement.text;

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
        `[Achievement => updateText()]`,
      );
      Logger.error(error, `[Achievement => updateText()]`);
      throw new HttpException(
        'Internal Server Error: Some Bad Shit Happened',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const achieivement_raw = await this.achievementService.findOne(id);
    const achieivement = await this.achievementService.remove(id);
    Logger.log(
      `Trying to delete achievement with id = [${id}]`,
      '[Achievement]',
    );

    if (!achieivement || achieivement.affected === 0) {
      Logger.log(
        `achievement with id = [${id}] doesn't exist`,
        '[Achievement]',
      );
      throw new HttpException(
        "Not Found: achievement doeesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    Logger.log(`Deleted achieivement with id = [${id}]`, '[Achievement]');

    achieivement.raw = achieivement_raw;
    return achieivement;
  }
}
