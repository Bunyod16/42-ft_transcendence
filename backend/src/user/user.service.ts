import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
// import { encodePassword } from 'src/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: {
        matchesAsPlayerOne: true,
        matchesAsPlayerTwo: true,
        achievements: true,
      },
    });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id: id },
      relations: ['matchesAsPlayerOne', 'matchesAsPlayerTwo', 'achievements'],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.userRepository.update({ id: id }, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete({
      id: id,
    });
  }
}
