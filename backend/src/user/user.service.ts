import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, In } from 'typeorm';
import { User } from './entities/user.entity';
// import { encodePassword } from 'src/utils/bcrypt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from 'src/utils/app.exception-filter';
import { Match } from 'src/match/entities/match.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // const password = encodePassword(createUserDto.password);
    // const newUser = this.userRepository.create({ ...createUserDto, password})
    return this.userRepository.save(createUserDto);
  }

  async findAll() {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.achievements', 'achievements')
      .leftJoinAndSelect('user.matchesAsPlayerOne', 'matchesAsPlayerOne')
      .leftJoinAndSelect('user.matchesAsPlayerTwo', 'matchesAsPlayerTwo')
      .leftJoinAndSelect('user.requests', 'requests')
      .leftJoinAndSelect('user.responses', 'responses')
      .leftJoinAndSelect('user.sentMessages', 'sentMessages')
      .getMany();

    if (user === null) {
      throw new CustomException(
        `User table doesn't exist`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'User => findOne()',
      );
    }

    return user;
    // return this.userRepository.find({
    //   relations: {
    //     matchesAsPlayerOne: true,
    //     matchesAsPlayerTwo: true,
    //     achievements: {
    //       achievement: true,
    //     },
    //   },
    // });
  }

  async findMany(ids: number[]): Promise<User[]> {
    return this.userRepository.find({
      where: {
        id: In(ids),
      },
      relations: {
        matchesAsPlayerOne: true,
        matchesAsPlayerTwo: true,
        achievements: {
          achievement: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ id: id })
      .select('user')
      // .leftJoinAndSelect('user.achievements', 'achievements')
      // .leftJoinAndSelect('user.matchesAsPlayerOne', 'matchesAsPlayerOne')
      // .leftJoinAndSelect('user.matchesAsPlayerTwo', 'matchesAsPlayerTwo')
      // .leftJoinAndSelect('user.requests', 'requests')
      // .leftJoinAndSelect('user.responses', 'responses')
      // .leftJoinAndSelect('user.sentMessages', 'sentMessages')
      .getOne();

    if (user === null) {
      throw new CustomException(
        `User with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'User => findOne()',
      );
    }

    return user;
    // if (id == null)
    //   throw new HttpException(
    //     'Not found: UserId cannot be undefined',
    //     HttpStatus.NOT_FOUND,
    //   );
  }

  async findOneByUsername(nickName: string): Promise<User> {
    if (nickName == undefined) return null;
    const user:User = await this.userRepository.findOneBy({
      nickName: nickName,
    });
    return user;
  }

  async findOneProfileByUsername(nickName: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.nickName = :nickName', { nickName: nickName })
      .select('user')
      .leftJoinAndSelect('user.achievements', 'userAchievements')
      .leftJoinAndSelect('userAchievements.achievement', 'achievement')
      .leftJoinAndSelect('user.matchesAsPlayerOne', 'matchesAsPlayerOne')
      .leftJoinAndSelect('user.matchesAsPlayerTwo', 'matchesAsPlayerTwo')
      .leftJoinAndSelect('matchesAsPlayerOne.playerOne', 'playerOne')
      .leftJoinAndSelect('matchesAsPlayerOne.playerTwo', 'playerTwo')
      .leftJoinAndSelect('matchesAsPlayerTwo.playerOne', 'playerOne2')
      .leftJoinAndSelect('matchesAsPlayerTwo.playerTwo', 'playerTwo2')
      .getOne();

    if (user === null) {
      throw new CustomException(
        `User with nickName = [${nickName}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'User => findOne()',
      );
    }

    //combining user matches as playerone and playertwo
    const matches: Match[] = [
      ...user.matchesAsPlayerOne,
      ...user.matchesAsPlayerTwo,
    ];

    delete user.matchesAsPlayerOne;
    delete user.matchesAsPlayerTwo;

    const filteredUser = { ...user, matches };

    return filteredUser;
  }

  async findOneByIntraname(intraname: string): Promise<User> {
    if (intraname == undefined) return null;
    return this.userRepository.findOneBy({
      intraName: intraname,
    });
  }

  //im not sure if this should be a user service or a match service
  async getMatches(id: number) {
    const userMatches = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.matchesAsPlayerOne', 'matchAsPlayerOne')
      .leftJoinAndSelect('user.matchesAsPlayerTwo', 'matchAsPlayerTwo')
      .where('user.id = :id', { id: id })
      .getOne();
    return [
      ...userMatches.matchesAsPlayerOne,
      ...userMatches.matchesAsPlayerTwo,
    ];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.userRepository.update({ id: id }, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete({
      id: id,
    });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findOne(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
