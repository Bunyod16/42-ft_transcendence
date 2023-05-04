import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserAchievementDto } from './dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from './dto/update-user_achievement.dto';
import { UserAchievement } from './entities/user_achievement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Achievement } from 'src/achievement/entities/achievement.entity';
import { AchievementService } from 'src/achievement/achievement.service';
import { UserService } from 'src/user/user.service';
import { CustomException } from 'src/utils/app.exception-filter';
import { MatchService } from 'src/match/match.service';

@Injectable()
export class UserAchievementService {
  constructor(
    @InjectRepository(UserAchievement)
    private userAchievementRepository: Repository<UserAchievement>,
    private readonly matchService: MatchService,
    private readonly achievementService: AchievementService,
    private readonly userService: UserService,
  ) {}

  async create(userId: number, achievementId: number) {
    try {
      const user: User = await this.userService.findOne(userId);
      const achievement: Achievement = await this.achievementService.findOne(
        achievementId,
      );

      const createUserAchievementDto: CreateUserAchievementDto =
        new CreateUserAchievementDto();

      createUserAchievementDto.user = user;
      createUserAchievementDto.achievement = achievement;

      return await this.userAchievementRepository.save(
        createUserAchievementDto,
      );
    } catch (error) {
      //if id not found for user or achievement
      if (error.name === 'CustomException') {
        throw new CustomException(
          `${error.response.message}`,
          HttpStatus.NOT_FOUND,
          'UserAchievement => create()',
        );
      } else {
        //if user already has achievement
        throw new CustomException(
          `User already has achievement.`,
          HttpStatus.NOT_FOUND,
          'UserAchievement => create()',
        );
      }
    }
  }

  async findAll() {
    const userAchievement = await this.userAchievementRepository
      .createQueryBuilder('userAchievement')
      .select(['userAchievement', 'achievement', 'user.id', 'user.nickName'])
      .leftJoin('userAchievement.achievement', 'achievement')
      .leftJoin('userAchievement.user', 'user')
      .getMany();

    if (userAchievement === null) {
      throw new CustomException(
        `UserAchievement table doesn't exist`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'UserAchievement => findOne()',
      );
    }

    return userAchievement;
  }

  async findOne(id: number) {
    const userAchievement = await this.userAchievementRepository
      .createQueryBuilder('userAchievement')
      .where({ id: id })
      .select(['userAchievement', 'achievement', 'user.id', 'user.nickName'])
      .leftJoin('userAchievement.achievement', 'achievement')
      .leftJoin('userAchievement.user', 'user')
      .getOne();

    if (userAchievement === null) {
      throw new CustomException(
        `UserAchievement with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'UserAchievement => findOne()',
      );
    }

    return userAchievement;
  }

  async findUserAchievements(userId: number) {
    const userAchievement = await this.userAchievementRepository
      .createQueryBuilder('userAchievement')
      .where({ user: userId })
      .select(['userAchievement', 'achievement', 'user.id', 'user.nickName'])
      .leftJoin('userAchievement.achievement', 'achievement')
      .leftJoin('userAchievement.user', 'user')
      .getMany();

    if (userAchievement === null) {
      throw new CustomException(
        `UserAchievement with userId = [${userId}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'UserAchievement => findOne()',
      );
    }

    return userAchievement;
  }

  async checkAchivementEligibility(user: User) {
    const achievements = await this.findUserAchievements(user.id);
    const matches = await this.matchService.findMatchesForUser(user.id);
    console.log(matches);
    console.log(achievements);
    //give 'Welcome Noobie' achievement
    if (
      matches.length > 0 &&
      !achievements.some((a) => a.achievement.id == 1)
    ) {
      this.create(user.id, 1);
    }

    // //give 'Pro' achievement
    if (
      matches.some((match) => {
        return (
          (match.playerOne.id == user.id &&
            match.playerOneScore > match.playerTwoScore) ||
          (match.playerTwo.id == user.id &&
            match.playerTwoScore > match.playerOneScore)
        );
      }) &&
      !achievements.some((a) => a.achievement.id == 2)
    ) {
      this.create(user.id, 2);
    }

    // //give 'Get better' achievement
    if (
      matches.some((match) => {
        return (
          (match.playerOne.id == user.id &&
            match.playerOneScore < match.playerTwoScore) ||
          (match.playerTwo.id == user.id &&
            match.playerTwoScore < match.playerOneScore)
        );
      }) &&
      !achievements.some((a) => a.achievement.id == 3)
    ) {
      this.create(user.id, 3);
    }
  }

  async update(id: number, achievementId: number) {
    const achievement = await this.achievementService.findOne(achievementId);

    if (achievement === null) {
      throw new CustomException(
        `Achievement with id = [${achievementId}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'Achievement => findOne()',
      );
    }

    const updateUserAchievementDto = new UpdateUserAchievementDto();

    updateUserAchievementDto.achievement = achievement;
    const userAchievement = await this.userAchievementRepository.update(
      id,
      updateUserAchievementDto,
    );

    if (userAchievement.affected === 0) {
      throw new CustomException(
        `UserAchievement with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'UserAchievement => remove()',
      );
    }
    userAchievement.raw = await this.findOne(id);
    return userAchievement;
  }

  async remove(id: number) {
    const userAchievement = await this.userAchievementRepository
      .createQueryBuilder('userAchievement')
      .delete()
      .from(UserAchievement)
      .where('id = :id', { id: id })
      .returning('*')
      .execute();

    if (userAchievement.affected === 0) {
      throw new CustomException(
        `UserAchievement with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'UserAchievement => remove()',
      );
    }

    return userAchievement;
  }
}
