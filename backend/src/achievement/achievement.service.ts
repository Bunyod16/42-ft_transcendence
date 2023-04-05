import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { Achievement } from './entities/achievement.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
  ) {}

  async create(
    createAchievementDto: CreateAchievementDto,
  ): Promise<CreateAchievementDto & Achievement> {
    return this.achievementRepository.save(createAchievementDto);
  }

  async findAll() {
    return await this.achievementRepository
      .createQueryBuilder('Achievement')
      .select(['Achievement'])
      .getMany();
  }

  async findOne(id: number) {
    return await this.achievementRepository
      .createQueryBuilder('Achievement')
      .where({ id: id })
      .select(['Achievement'])
      .getOne();
  }

  async findOneName(name: string) {
    return await this.achievementRepository
      .createQueryBuilder('Achievement')
      .where({ name: name })
      .select(['Achievement'])
      .getOne();
  }

  async update(id: number, updateAchievementDto: UpdateAchievementDto) {
    return this.achievementRepository.update(id, updateAchievementDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.achievementRepository.delete({ id });
  }
}
