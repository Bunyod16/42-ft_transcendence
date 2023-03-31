import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserAchievementDto } from './dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from './dto/update-user_achievement.dto';
import { UserAchievement } from './entities/user_achievement.entity';

@Injectable()
export class UserAchievementService {
  constructor(
    @Inject('USER_ACHIEVEMENT_REPOSITORY')
    private userAchievementRepository: Repository<UserAchievement>,
  ) {}

  async create(
    createUserAchievementDto: CreateUserAchievementDto,
  ): Promise<CreateUserAchievementDto & UserAchievement> {
    return this.userAchievementRepository.save(createUserAchievementDto);
  }

  async findAll() {
    return await this.userAchievementRepository
      .createQueryBuilder('userAchievement')
      .select(['userAchievement', 'achievement', 'user.id', 'user.nickName'])
      .leftJoin('userAchievement.achievement', 'achievement')
      .leftJoin('userAchievement.user', 'user')
      .getMany();
  }

  async findOne(id: number) {
    return await this.userAchievementRepository
      .createQueryBuilder('userAchievement')
      .where({ id: id })
      .select(['userAchievement', 'achievement', 'user.id', 'user.nickName'])
      .leftJoin('userAchievement.achievement', 'achievement')
      .leftJoin('userAchievement.user', 'user')
      .getOne();
  }

  async update(id: number, updateUserAchievementDto: UpdateUserAchievementDto) {
    return this.userAchievementRepository.update(id, updateUserAchievementDto);
  }

  async remove(id: number) {
    return this.userAchievementRepository.delete({ id });
  }
}
