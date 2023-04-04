import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, In } from 'typeorm';
import { User } from './entities/user.entity';
// import { encodePassword } from 'src/utils/bcrypt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    // const password = encodePassword(createUserDto.password);
    // const newUser = this.userRepository.create({ ...createUserDto, password})
    return this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: {
        matchesAsPlayerOne: true,
        matchesAsPlayerTwo: true,
        achievements: {
          achievement: true,
        },
      },
    });
  }

  async findMany(ids: number[]): Promise<User[]> {
    return this.userRepository.find({
      where: {
        id: In(ids),
      },
      relations: {
        matchesAsPlayerOne: true,
        matchesAsPlayerTwo: true,
        achievements: {
          achievement: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id: id },
      relations: [
        'matchesAsPlayerOne',
        'matchesAsPlayerTwo',
        'achievements',
        'achievements.achievement',
      ],
    });
  }

  async findOneByUsername(nickName: string): Promise<User> {
    if (nickName == undefined) return null;
    return this.userRepository.findOneBy({
      nickName: nickName,
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

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findOne(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
