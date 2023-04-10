import { Injectable, Inject } from '@nestjs/common';
import { CreateTwoFactorDto } from './dto/create-two_factor.dto';
// import { UpdateTwoFactorDto } from './dto/update-two_factor.dto';
import { TwoFactor } from './entities/two_factor.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectRepository(TwoFactor)
    private twoFactorRepository: Repository<TwoFactor>,
  ) {}

  async create(
    createTwoFactorDto: CreateTwoFactorDto,
  ): Promise<CreateTwoFactorDto & TwoFactor> {
    return this.twoFactorRepository.save(createTwoFactorDto);
  }

  async findAll(): Promise<TwoFactor[]> {
    return this.twoFactorRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: number): Promise<TwoFactor> {
    return this.twoFactorRepository.findOneBy({
      id: id,
    });
  }

  // update(id: number, updateTwoFactorDto: UpdateTwoFactorDto) {
  //   return `This action updates a #${id} twoFactor`;
  // }

  async remove(id: number): Promise<DeleteResult> {
    return this.twoFactorRepository.delete({ id });

    //idk why but docs show to use this instead of the above
    // return await this.twoFactorRepository
    //   .createQueryBuilder('two_factor')
    //   .delete()
    //   .from(TwoFactor)
    //   .where('id = :id', { id: id })
    //   .execute();
  }
}
