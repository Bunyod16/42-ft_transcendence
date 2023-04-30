import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateTwoFactorDto } from './dto/create-two_factor.dto';
// import { UpdateTwoFactorDto } from './dto/update-two_factor.dto';
import { TwoFactor } from './entities/two_factor.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as speakeasy from 'speakeasy';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { CustomException } from 'src/utils/app.exception-filter';
import { decryptTOTP, encryptTOTP } from 'src/utils/crypto';

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectRepository(TwoFactor)
    private twoFactorRepository: Repository<TwoFactor>,
    private readonly userService: UserService,
  ) {}

  /*
   * Changed the logic so that this service only constructs the Key
   * */
  async createTwoFactorKeyAndOtp(userId: number) {
    try {
      //generate secret
      const secret = speakeasy.generateSecret({
        name: 'ft_transcendence',
      });

      const user: User = await this.userService.findOne(userId);
      //encrypt tsecret

      const key: string = encryptTOTP(secret.ascii, user.created_at.toString());
      const res: { key: string; otpauth_url: string } = {
        key: key,
        otpauth_url: secret.otpauth_url,
      };

      return res;
    } catch (error) {
      if (error.name === 'QueryFailedError')
        throw new CustomException(
          `User already has TwoFactor.`,
          HttpStatus.BAD_REQUEST,
          'TwoFactor => createTwoFactorDto()',
        );
      else
        throw new CustomException(
          `Some Bad Shit Happened`,
          HttpStatus.INTERNAL_SERVER_ERROR,
          'TwoFactor => createTwoFactorDto()',
        );
    }
  }

  async saveUserTwoFactor(
    userId: number,
    secretKey: string,
  ): Promise<TwoFactor> {
    try {
      const user: User = await this.userService.findOne(userId);
      const createTwoFactorDto = new CreateTwoFactorDto();

      createTwoFactorDto.user = user;
      createTwoFactorDto.key = secretKey;

      const twoFactor = await this.twoFactorRepository.save(createTwoFactorDto);
      return twoFactor;
    } catch (error) {
      if (error.name === 'QueryFailedError')
        throw new CustomException(
          `User already has TwoFactor.`,
          HttpStatus.BAD_REQUEST,
          'TwoFactor => saveUserTwoFactor()',
        );
      else
        throw new CustomException(
          `Some Bad Shit Happened`,
          HttpStatus.INTERNAL_SERVER_ERROR,
          'TwoFactor => saveUserTwoFactor()',
        );
    }
  }

  async findAll(): Promise<TwoFactor[]> {
    return this.twoFactorRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: number): Promise<TwoFactor> {
    const twoFactor = await this.twoFactorRepository
      .createQueryBuilder('twoFactor')
      .where({ id: id })
      .getOne();

    if (twoFactor === null) {
      throw new CustomException(
        `TwoFactor with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'TwoFactor => findOne()',
      );
    }

    return twoFactor;
  }

  async findOneWithUserId(userId: number) {
    const twoFactor = await this.twoFactorRepository
      .createQueryBuilder('twoFactor')
      .where('twoFactor.userId = :userId', { userId: userId })
      .getOne();

    if (twoFactor === null) {
      throw new CustomException(
        `User with id = [${userId}] hasn't set up TwoFactor`,
        HttpStatus.NOT_FOUND,
        'TwoFactor => findOneWithUserId()',
      );
    }

    return twoFactor;
  }

  async verifyFirstTwoFactor(
    userId: number,
    twoFactorToken: string,
    twoFactorKey: string,
  ) {
    const secretKey = await this.userService.findOne(userId);

    //decrypt secret
    const decryptedSecretKey = decryptTOTP(
      twoFactorKey,
      secretKey.created_at.toString(),
    );

    //verify secret
    const verication = speakeasy.totp.verify({
      secret: decryptedSecretKey,
      encoding: 'ascii',
      token: twoFactorToken,
    });

    return verication;
  }

  async verifyUserTwoFactor(userId: number, twoFactorToken: string) {
    const twoFactor = await this.findOneWithUserId(userId);
    const secretKey = await this.userService.findOne(userId);

    //decrypt secret
    const decryptedSecretKey = decryptTOTP(
      twoFactor.key,
      secretKey.created_at.toString(),
    );

    //verify secret
    const verication = speakeasy.totp.verify({
      secret: decryptedSecretKey,
      encoding: 'ascii',
      token: twoFactorToken,
    });

    return verication;
  }

  // update(id: number, updateTwoFactorDto: UpdateTwoFactorDto) {
  //   return `This action updates a #${id} twoFactor`;
  // }

  async removeWithUserId(user: User): Promise<DeleteResult> {
    return this.twoFactorRepository.delete({ user: user });
  }

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
