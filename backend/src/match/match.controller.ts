import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { ApiTags } from '@nestjs/swagger';
import { Match } from './entities/match.entity';
import { UpdateMatchDto } from './dto/update-match.dto';

@ApiTags('match')
@Controller('match')
export class MatchController {
  constructor(
    private readonly matchService: MatchService, // private readonly userService: UserService,
  ) {}

  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    try {
      const match_to_add = await this.matchService.create(createMatchDto);
      if (!match_to_add) {
        Logger.log("Couldn't create Match", 'match => create()');
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      Logger.log(
        `Created match with id = [${match_to_add}]`,
        'match => create()',
      );
      return match_to_add;
    } catch (error) {
      // Logger.error(
      //   `[match] match for user with id = [${createMatchDto.player_one.}] already exists`,
      // );
      throw new HttpException(
        'Internal Server Error: match id already exists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    const match = this.matchService.findAll();
    Logger.log(`Trying to get all matches`, 'match => findAll()');
    if (!match) {
      Logger.log(`Cant find matches table`, 'match => findAll()');
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return match;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    Logger.log(`Trying to get match with id = [${id}]`, 'match => findOne()');
    const match = await this.matchService.findOne(id);
    if (!match) {
      Logger.log(
        `match with id = [${id}] doeesn't exist`,
        'match => findOne()',
      );
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return match;
  }

  //Using Query Builder Method
  // @Patch(':id/update_score')
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Query('playerOneScore', ParseIntPipe) playerOneScore: number,
  //   @Query('playerTwoScore', ParseIntPipe) playerTwoScore: number,
  // ) {
  //   const match: Match = await this.matchService.findOne(id);
  //
  //   if (!match) {
  //     Logger.log(`match with id = [${id}] doesn't exist`, '[match]');
  //     throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  //   }
  //
  //   return await this.matchService.update_scores(
  //     id,
  //     playerOneScore,
  //     playerTwoScore,
  //   );
  // }

  //Using UpdateMatchDto
  @Patch(':id/updateScore')
  async updateScore(
    @Param('id', ParseIntPipe) id: number,
    @Query('playerOneScore', ParseIntPipe) playerOneScore: number,
    @Query('playerTwoScore', ParseIntPipe) playerTwoScore: number,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    const match: Match = await this.matchService.findOne(id);

    if (!match) {
      Logger.log(`match with id = [${id}] doesn't exist`, '[match]');
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    updateMatchDto.playerOneScore = playerOneScore ?? match.playerOneScore;
    updateMatchDto.playerTwoScore = playerTwoScore ?? match.playerTwoScore;

    const res = await this.matchService.updateScores(id, updateMatchDto);
    res.raw = await this.matchService.findOne(id);
    return res;
  }

  @Patch(':id/updatePrivate')
  async updatePrivate(
    @Param('id', ParseIntPipe) id: number,
    @Query('isPrivate', ParseBoolPipe) isPrivate: boolean,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    const match: Match = await this.matchService.findOne(id);

    if (!match) {
      Logger.log(
        `match with id = [${id}] doesn't exist`,
        `[match => updatePrivate()]`,
      );
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    updateMatchDto.isPrivate = isPrivate ?? match.isPrivate;

    const res = await this.matchService.updateScores(id, updateMatchDto);
    res.raw = await this.matchService.findOne(id);
    return res;
  }

  @Patch(':id/updateGameEnded')
  async updateGameEnded(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    const match: Match = await this.matchService.findOne(id);

    if (!match) {
      Logger.log(
        `match with id = [${id}] doesn't exist`,
        `[match => updatePrivate()]`,
      );
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    if (match.endedAt !== null) {
      Logger.log(
        `match with id = [${id}] already ended`,
        `[match => updatePrivate()]`,
      );
      throw new HttpException(
        'Not Modified: Game Already Ended',
        HttpStatus.BAD_REQUEST,
      );
    }
    updateMatchDto.endedAt = new Date() ?? match.endedAt;

    const res = await this.matchService.updateGameEnded(id, updateMatchDto);
    res.raw = await this.matchService.findOne(id);
    return res;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const match_raw = await this.matchService.findOne(id);
    const match = await this.matchService.remove(id);
    Logger.log(`Trying to delete match with id = [${id}]`, '[match]');

    if (!match || match.affected === 0) {
      Logger.log(`match with id = [${id}] doesn't exist`, '[match]');
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    match.raw = match_raw;
    Logger.log(`Deleted match with id = [${id}]`, '[match]');
    return match;
  }
}
