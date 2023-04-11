import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { DeleteResult, IsNull, Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { GameStateService } from 'src/game_state/gameState.service';
import { GameStreamService } from 'src/game_stream/game_stream.service';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private readonly userService: UserService,
    private gameStateService: GameStateService,
    private gameStreamService: GameStreamService,
  ) {}

  async create(
    createMatchDto: CreateMatchDto,
  ): Promise<CreateMatchDto & Match> {
    return this.matchRepository.save(createMatchDto);
  }

  async create_with_user(user_one: User, user_two: User) {
    if (!user_one || !user_two) {
      throw new HttpException(
        "One of the users doesn't exist",
        HttpStatus.BAD_REQUEST,
      );
    }
    const newMatch = new CreateMatchDto();
    newMatch.playerOne = user_one;
    newMatch.playerTwo = user_two;
    const match = await this.findCurrentByUser(user_one);
    this.gameStateService.createGameIfNotExist(
      match.id,
      user_one.id,
      user_two.id,
    );
    this.gameStreamService.add(match.id);
    return this.matchRepository.save(newMatch);
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

  async findCurrentByUser(user: User): Promise<any> {
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
    return this.matchRepository.update(id, updateMatchDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.matchRepository.delete({ id });
  }
}
