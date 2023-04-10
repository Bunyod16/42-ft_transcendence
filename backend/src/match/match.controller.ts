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
        Logger.log("Couldn't create Match", 'Match => create()');
        throw new HttpException(
          `Internal Server Error: Couldn't create match`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      Logger.log(
        `Created match with id = [${match_to_add}]`,
        'match => create()',
      );

      return match_to_add;
    } catch (error) {
      Logger.error(`match couldn't be added`, `Match => create()`);
      throw new HttpException(
        'Internal Server Error: Some Bad Shit Happened',
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
    const match = await this.matchService.findOne(id);

    Logger.log(`Trying to get match with id = [${id}]`, 'match => findOne()');

    if (!match) {
      Logger.log(
        `match with id = [${id}] doeesn't exist`,
        'match => findOne()',
      );
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return match;
  }

  @Get(':userId/findUserMatches')
  async findMatchesForUser(@Param('userId', ParseIntPipe) userId: number) {
    const matchesForUser = await this.matchService.findMatchesForUser(userId);

    Logger.log(
      `Trying to get all matches for User with id = [${userId}]`,
      'Match => findOne()',
    );

    return matchesForUser;
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
      Logger.log(
        `match with id = [${id}] doesn't exist`,
        'Match => updateScore()',
      );
      throw new HttpException(
        `Not Found: Match doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    updateMatchDto.playerOneScore = playerOneScore ?? match.playerOneScore;
    updateMatchDto.playerTwoScore = playerTwoScore ?? match.playerTwoScore;

    try {
      const res = await this.matchService.updateScores(id, updateMatchDto);

      res.raw = await this.matchService.findOne(id);
      return res;
    } catch (error) {
      Logger.error(
        `match with id = [${id}] couldn't be updated`,
        `Match => updateScore()`,
      );
      Logger.error(error, `Match => updateScore()`);
      throw new HttpException(
        'BAD_REQUEST: Match duplicate name or description',
        HttpStatus.BAD_REQUEST,
      );
    }
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
        `Match => updatePrivate()`,
      );
      throw new HttpException(
        `Not Found: Match doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    updateMatchDto.isPrivate = isPrivate ?? match.isPrivate;

    try {
      const res = await this.matchService.updateScores(id, updateMatchDto);
      res.raw = await this.matchService.findOne(id);
      return res;
    } catch (error) {
      Logger.error(
        `match with id = [${id}] couldn't be updated`,
        `Match => updatePrivate()`,
      );
      Logger.error(error, `Match => updateScore()`);
      throw new HttpException(
        `BAD_REQUEST: Match couldn't be update`,
        HttpStatus.BAD_REQUEST,
      );
    }
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
        `Match => updateGameEnded()`,
      );
      throw new HttpException(
        `Not Found: Match doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (match.endedAt !== null) {
      Logger.log(
        `match with id = [${id}] already ended`,
        `Match => updateGameEnded()`,
      );
      throw new HttpException(
        'Bad Request: Game Already Ended',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      updateMatchDto.endedAt = new Date() ?? match.endedAt;

      const res = await this.matchService.updateGameEnded(id, updateMatchDto);
      res.raw = await this.matchService.findOne(id);
      return res;
    } catch (error) {
      Logger.error(
        `match with id = [${id}] couldn't be updated`,
        `Match => updateScore()`,
      );
      Logger.error(error, `Match => updateGameEnded()`);
      throw new HttpException(
        `BAD_REQUEST: Match couldn't be update`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const match_raw = await this.matchService.findOne(id);
      const match = await this.matchService.remove(id);
      Logger.log(
        `Trying to delete match with id = [${id}]`,
        'Match => remove()',
      );

      if (!match || match.affected === 0) {
        Logger.log(
          `match with id = [${id}] doesn't exist`,
          'match => remove()',
        );
        throw new HttpException(
          "Not Found: match doesn't exist",
          HttpStatus.NOT_FOUND,
        );
      }
      Logger.log(`Deleted match with id = [${id}]`, 'match => remove()');

      match.raw = match_raw;
      return match;
    } catch (error) {
      Logger.error(error, `Match => remove()`);
      throw new HttpException(
        `Internal Server Error: Some bad shit happened`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
