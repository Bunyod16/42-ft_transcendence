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
      .createQueryBuilder('Achivement')
      .select(['Achivement', 'user.id', 'user.nickName'])
      .leftJoin('Achivement.user', 'user')
      .getMany();
  }

  async findOne(id: number) {
    return await this.userAchievementRepository
      .createQueryBuilder('Achivement')
      .where({ id: id })
      .select(['Achivement', 'user.id', 'user.nickName'])
      .leftJoin('Achivement.user', 'user')
      .getOne();
  }

  // update(id: number, updateUserAchievementDto: UpdateUserAchievementDto) {
  //   return `This action updates a #${id} userAchievement`;
  // }

  async remove(id: number) {
    return this.userAchievementRepository.delete({ id });
  }
}
