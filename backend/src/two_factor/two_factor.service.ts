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

  findAll() {
		 return this.twoFactorRepository.find({
			relations: {
				user: true,
			}
		});
  }

  findOne(id: number) {
    return `This action returns a #${id} twoFactor`;
  }

  update(id: number, updateTwoFactorDto: UpdateTwoFactorDto) {
    return `This action updates a #${id} twoFactor`;
  }

  remove(id: number) {
    return `This action removes a #${id} twoFactor`;
  }
}
