import { Injectable, Inject } from '@nestjs/common';
import { CreateTwoFactorDto } from './dto/create-two_factor.dto';
import { UpdateTwoFactorDto } from './dto/update-two_factor.dto';
import { TwoFactor } from './entities/two_factor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TwoFactorService {
  constructor(
    @Inject('TWOFACTOR_REPOSITORY')
    private twoFactorRepository: Repository<TwoFactor>,
  ) {}

  create(createTwoFactorDto: CreateTwoFactorDto) {
    console.log(createTwoFactorDto);
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
    console.log(this.twoFactorRepository.findOneBy({ id: id }));
    return this.twoFactorRepository.findOneBy({
      id: id,
    });
  }

  update(id: number, updateTwoFactorDto: UpdateTwoFactorDto) {
    return `This action updates a #${id} twoFactor`;
  }

  remove(id: number) {
    return `This action removes a #${id} twoFactor`;
  }
}
