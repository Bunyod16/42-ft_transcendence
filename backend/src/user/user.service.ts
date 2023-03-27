import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { encodePassword } from 'src/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const password = encodePassword(createUserDto.password);
    const newUser = this.userRepository.create({ ...createUserDto, password})
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
      return this.userRepository.findOneBy({
        id: id,
      });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.userRepository.update({
      id: id,
    },
    updateUserDto,
    )
  }

  remove(id: number) {
    return this.userRepository.delete({
      id: id,
    });
  }
}
