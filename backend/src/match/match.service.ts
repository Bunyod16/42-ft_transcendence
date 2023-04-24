import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { DeleteResult, IsNull, Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { GameStateService } from 'src/game_state/gameState.service';
import { CustomException } from 'src/utils/app.exception-filter';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private gameStateService: GameStateService,
  ) {}

  async create(
    createMatchDto: CreateMatchDto,
  ): Promise<CreateMatchDto & Match> {
    return this.matchRepository.save(createMatchDto);
  }

  async create_with_user(userOne: User, userTwo: User) {
    if (!userOne || !userTwo) {
      throw new HttpException(
        "One of the users doesn't exist",
        HttpStatus.BAD_REQUEST,
      );
    }
    const userOneCheck = await this.findCurrentByUser(userOne);
    const userTwoCheck = await this.findCurrentByUser(userTwo);
    if (userOneCheck || userTwoCheck) {
      throw new HttpException(
        'One or both of the users is already in a match',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newMatch = new CreateMatchDto();
    newMatch.playerOne = userOne;
    newMatch.playerTwo = userTwo;
    newMatch.isPrivate = false;
    await this.matchRepository.save(newMatch); // TODO: only create if match does not exist?
    const match = await this.findCurrentByUser(userOne);
    await this.gameStateService.createGameIfNotExist(
      match.id,
      userOne.id,
      userTwo.id,
    );
    return match;
  }

  async findAllCurrent(): Promise<Match[]> {
    return await this.matchRepository
      .createQueryBuilder('Match')
      .where([{ endedAt: IsNull() }])
      .select([
        'Match',
        'playerOne.id',
        'playerOne.nickName',
        'playerTwo.id',
        'playerTwo.nickName',
      ])
      .leftJoin('Match.playerOne', 'playerOne')
      .leftJoin('Match.playerTwo', 'playerTwo')
      .getMany();
  }

  async findAll(): Promise<Match[]> {
    return await this.matchRepository
      .createQueryBuilder('Match')
      .select(['Match', 'playerOne.id', 'playerOne.nickName', 'playerTwo.id'])
      .leftJoin('Match.playerOne', 'playerOne')
      .leftJoin('Match.playerTwo', 'playerTwo')
      .getMany();

    //Get query gets everything in user.
    // return this.matchRepository.find({
    //   relations: {
    //     playerOne: true,
    //     playerTwo: true,
    //   },
    // });
  }

  async find(match_id: number): Promise<Match> {
    return await this.matchRepository
      .createQueryBuilder('Match')
      .where([{ id: match_id }])
      .select([
        'Match',
        'playerOne.id',
        'playerOne.nickName',
        'playerOnScore',
        'playerTwo.id',
        'playerTwo.nickName',
        'playerTwoScore',
      ])
      .leftJoin('Match.playerOne', 'playerOne')
      .leftJoin('Match.playerTwo', 'playerTwo')
      .getOne();
  }

  async findCurrentByUser(user: User): Promise<Match> {
    return await this.matchRepository
      .createQueryBuilder('Match')
      .where([
        { endedAt: IsNull(), playerOne: user },
        { endedAt: IsNull(), playerTwo: user },
      ])
      .select([
        'Match',
        'playerOne.id',
        'playerOne.nickName',
        'playerTwo.id',
        'playerTwo.nickName',
      ])
      .leftJoin('Match.playerOne', 'playerOne')
      .leftJoin('Match.playerTwo', 'playerTwo')
      .getOne();
  }

  async findOne(id: number): Promise<Match> {
    return await this.matchRepository
      .createQueryBuilder('Match')
      .where({ id: id })
      .select([
        'Match',
        'playerOne.id',
        'playerOne.nickName',
        'playerTwo.id',
        'playerTwo.nickName',
      ]) //Can just put Match for everything in match
      .leftJoin('Match.playerOne', 'playerOne')
      .leftJoin('Match.playerTwo', 'playerTwo')
      .getOne();

    //This query gets everything in user
    // return this.matchRepository.findOne({
    //   where: { id: id },
    //   relations: ['playerOne', 'playerTwo'],
    // });

    // This query doesnt show player relations
    // return this.matchRepository.findOneBy({
    //   id: id,
    // });
  }

  async findMatchesForUser(id: number) {
    const matchesForUser = await this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.playerOne', 'playerOne')
      .leftJoinAndSelect('match.playerTwo', 'playerTwo')
      .where('playerOne.id = :id OR playerTwo.id = :id', { id: id })
      .getMany();

    if (matchesForUser === null) {
      throw new CustomException(
        `User with id = [${id}] doesn't have any matches`,
        HttpStatus.NOT_FOUND,
        'Match => findMatchesForUser()',
      );
    }

    return matchesForUser;
  }

  // async update_scores(
  //   id: number,
  //   playerOneScoreUpdate: number,
  //   playerTwoScoreUpdate: number,
  // ) {
  //   return this.matchRepository
  //     .createQueryBuilder('Match')
  //     .update(Match)
  //     .set({
  //       playerOneScore: playerOneScoreUpdate,
  //       playerTwoScore: playerTwoScoreUpdate,
  //     })
  //     .where({ id: id })
  //     .returning('*') //retunign all columns
  //     .updateEntity(true) //update the rawentity
  //     .execute();
  // }

  //All 3 of these updates shuold just be one and all the checking should be done
  //in controller
  async updateScores(
    id: number,
    // playerOneScoreUpdate: number,
    // playerTwoScoreUpdate: number,
    updateMatchDto: UpdateMatchDto,
  ): Promise<any> {
    return this.matchRepository.update(id, updateMatchDto);
  }

  async updatePrivate(id: number, updateMatchDto: UpdateMatchDto) {
    return this.matchRepository.update(id, updateMatchDto);
  }

  async updateGameEnded(id: number, updateMatchDto: UpdateMatchDto) {
    updateMatchDto.endedAt = new Date();
    return this.matchRepository.update(id, updateMatchDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.matchRepository.delete({ id });
  }
}
