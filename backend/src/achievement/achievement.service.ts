import { Injectable, HttpStatus } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { Achievement } from './entities/achievement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from 'src/utils/app.exception-filter';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
  ) {}

  async create(
    achievementName: string,
    achievementDes: string,
  ): Promise<CreateAchievementDto & Achievement> {
    const createAchievementDto: CreateAchievementDto =
      new CreateAchievementDto();

    createAchievementDto.name = achievementName;
    createAchievementDto.description = achievementDes;
    return await this.achievementRepository.save(createAchievementDto);
  }

  async findAll() {
    return await this.achievementRepository
      .createQueryBuilder('Achievement')
      .select(['Achievement'])
      .getMany();
  }

  async findOne(id: number) {
    const achievement = await this.achievementRepository
      .createQueryBuilder('Achievement')
      .where({ id: id })
      .select(['Achievement'])
      .getOne();

    if (achievement === null) {
      throw new CustomException(
        `Achievement with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'Achievement => findOne()',
      );
    }

    return achievement;
  }

  async findOneName(name: string) {
    const achievement = await this.achievementRepository
      .createQueryBuilder('Achievement')
      .where({ name: name })
      .select(['Achievement'])
      .getOne();

    if (achievement === null)
      throw new CustomException(
        `Achievement with id = [${name}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'Achievement => findOneName()',
      );

    return achievement;
  }

  async update(id: number, name: string, description: string) {
    const updateAchievementDto = new UpdateAchievementDto();

    updateAchievementDto.name = name;
    updateAchievementDto.description = description;
    const achievement = await this.achievementRepository.update(
      id,
      updateAchievementDto,
    );
    if (achievement.affected === 0) {
      throw new CustomException(
        `Achievement with id = [${id}] doesn't exist test`,
        HttpStatus.NOT_FOUND,
        'Achievement => remove()',
      );
    }
    achievement.raw = await this.findOne(id);
    return achievement;
  }

  async remove(id: number): Promise<DeleteResult> {
    const achievement = await this.achievementRepository
      .createQueryBuilder('achievement')
      .delete()
      .from(Achievement)
      .where('id = :id', { id: id })
      .returning('*')
      .execute();

    if (achievement.affected === 0) {
      throw new CustomException(
        `Achievement with id = [${id}] doesn't exist test`,
        HttpStatus.NOT_FOUND,
        'Achievement => remove()',
      );
    }

    return achievement;
  }
}
