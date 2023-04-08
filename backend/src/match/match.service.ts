import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { DeleteResult, Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private readonly userService: UserService,
  ) {}

  async create(
    createMatchDto: CreateMatchDto,
  ): Promise<CreateMatchDto & Match> {
    return this.matchRepository.save(createMatchDto);
  }

  async create_with_id(userId1: number, userId2: number) {
    const user1: User = await this.userService.findOne(userId1);
    const user2: User = await this.userService.findOne(userId2);

    console.log(`user1.id = ${user1.id}`);
    console.log(`user2.id = ${user2.id}`);

    if (user1 && user2) {
      const newMatch = new CreateMatchDto();
      newMatch.playerOne = user1;
      newMatch.playerTwo = user2;
      return this.matchRepository.save(newMatch);
    }
    //throw some error
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
