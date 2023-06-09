import {
  Injectable,
  HttpStatus,
  Inject,
  forwardRef,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateChatChannelMemberDto } from './dto/create-chat_channel_member.dto';
import { UpdateChatChannelMemberDto } from './dto/update-chat_channel_member.dto';
import { ChatChannelMember } from './entities/chat_channel_member.entity';
import { User } from 'src/user/entities/user.entity';
import {
  ChannelType,
  ChatChannel,
  ChatType,
} from 'src/chat_channels/entities/chat_channel.entity';
import { ChatChannelsService } from 'src/chat_channels/chat_channels.service';
import { CustomException } from 'src/utils/app.exception-filter';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatChannelMemberService {
  constructor(
    @InjectRepository(ChatChannelMember)
    private chatChannelMemberRepository: Repository<ChatChannelMember>,
    private readonly userService: UserService,

    @Inject(forwardRef(() => ChatChannelsService)) //for circular dependency
    private readonly chatChannelService: ChatChannelsService,
  ) {}

  async create(userId: number, chatChannelId: number) {
    try {
      const user: User = await this.userService.findOne(userId);
      const chatChannel: ChatChannel = await this.chatChannelService.findOne(
        chatChannelId,
      );
      if (chatChannel.channel_type == ChannelType.PROTECTED) {
        throw new HttpException(
          'joining protected channel requires password',
          HttpStatus.BAD_REQUEST,
        );
      }
      const createChatChannelMemberDto = new CreateChatChannelMemberDto();

      createChatChannelMemberDto.user = user;
      createChatChannelMemberDto.chatChannel = chatChannel;

      return await this.chatChannelMemberRepository.save(
        createChatChannelMemberDto,
      );
    } catch (error) {
      if (error.name === 'CustomException') {
        throw new CustomException(
          `${error.response.message}`,
          HttpStatus.NOT_FOUND,
          'ChatChannelMeber => create()',
        );
      } else if (error.name === 'QueryFailedError') {
        throw new CustomException(
          `User already In ChatChannel`,
          HttpStatus.BAD_REQUEST,
          'ChatChannelMember => create()',
          error,
        );
      } else {
        throw new CustomException(
          `${error.name}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
          'ChatChannelMember => create()',
          error,
        );
      }
    }
  }

  async createProtected(
    userId: number,
    chatChannelId: number,
    password: string,
    isOwner?: boolean,
  ) {
    try {
      const user: User = await this.userService.findOne(userId);
      const chatChannel: ChatChannel =
        await this.chatChannelService.findOneWithPassword(chatChannelId);

      if (password == null) {
        throw new CustomException(
          'Joining protected ChatChannel requires password',
          HttpStatus.BAD_REQUEST,
          `ChatChannelMember => createProtected`,
        );
      }

      const passwordIsCorrect = await bcrypt.compare(
        password,
        chatChannel.password,
      );

      if (!passwordIsCorrect) {
        throw new CustomException(
          `Wrong password for ChatChannel`,
          HttpStatus.BAD_REQUEST,
          `ChatChannelMember => createProtected`,
        );
      }

      const createChatChannelMemberDto = new CreateChatChannelMemberDto();

      createChatChannelMemberDto.user = user;
      createChatChannelMemberDto.chatChannel = chatChannel;
      if (isOwner) {
        createChatChannelMemberDto.isAdmin = true;
      }

      return await this.chatChannelMemberRepository.save(
        createChatChannelMemberDto,
      );
    } catch (error) {
      if (error.name === 'CustomException') {
        throw new CustomException(
          `${error.response.message}`,
          HttpStatus.NOT_FOUND,
          'ChatChannelMeber => createProtected()',
        );
      } else if (error.name === 'QueryFailedError') {
        throw new CustomException(
          `User already In ChatChannel`,
          HttpStatus.BAD_REQUEST,
          'ChatChannelMember => createProtected()',
          error,
        );
      } else {
        throw new CustomException(
          `${error.name}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
          'ChatChannelMember => createProtected()',
          error,
        );
      }
    }
  }

  async findAll() {
    const chatChannelMember = await this.chatChannelMemberRepository
      .createQueryBuilder('chatChannelMember')
      .select(['chatChannelMember', 'user', 'chatChannel'])
      .leftJoin('chatChannelMember.user', 'user')
      .leftJoin('chatChannelMember.chatChannel', 'chatChannel')
      .getMany();

    if (chatChannelMember === null) {
      throw new CustomException(
        `ChatChannel table doesn't exist`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'ChatChannelMember => findAll()',
      );
    }

    return chatChannelMember;
  }

  async findOne(id: number) {
    const chatChannelMember = await this.chatChannelMemberRepository
      .createQueryBuilder('chatChannelMember')
      .where({ id: id })
      .select(['chatChannelMember', 'user', 'chatChannel'])
      .leftJoin('chatChannelMember.user', 'user')
      .leftJoin('chatChannelMember.chatChannel', 'chatChannel')
      .getOne();

    if (chatChannelMember === null) {
      throw new CustomException(
        `ChatChannelMember with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'ChatChannelMember => findOne()',
      );
    }

    return chatChannelMember;
  }

  async findAllUserChatChannel(userId: number) {
    const chatChannelMember = await this.chatChannelMemberRepository
      .createQueryBuilder('chatChannelMember')
      .select(['chatChannelMember', 'chatChannel'])
      .leftJoin('chatChannelMember.user', 'user')
      .leftJoin('chatChannelMember.chatChannel', 'chatChannel')
      .where('user.id = :userId', { userId: userId })
      .orderBy('chatChannel.chatType', 'ASC') //order by directmessages first
      .getMany();

    if (chatChannelMember === null) {
      throw new CustomException(
        `User with id = [${userId}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'ChatChannelMember => findAllUserChatChannel()',
      );
    }

    return chatChannelMember;
  }

  async findAllUsersChatChannelType(userId: number, chatType: ChatType) {
    const chatChannelMember = await this.chatChannelMemberRepository
      .createQueryBuilder('chatChannelMember')
      .select(['chatChannelMember', 'chatChannel'])
      .leftJoin('chatChannelMember.user', 'user')
      .leftJoin('chatChannelMember.chatChannel', 'chatChannel')
      .where('(user.id = :userId) AND (chatChannel.chatType = :chatType)', {
        userId: userId,
        chatType: chatType,
      })
      .getMany();

    if (chatChannelMember === null) {
      throw new CustomException(
        `User with id = [${userId}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'ChatChannelMember => findAllUserDirectMessageChatChannel()',
      );
    }

    return chatChannelMember;
  }

  async checkIfUserHasChatWithFriend(userId: number, friendId: number) {
    //check if both users exist
    await this.userService.findOne(userId);
    await this.userService.findOne(friendId);

    const userDirectMessages = await this.chatChannelMemberRepository
      .createQueryBuilder('chatChannelMember')
      .select(['chatChannelMember', 'chatChannel'])
      .leftJoin('chatChannelMember.user', 'user')
      .leftJoin('chatChannelMember.chatChannel', 'chatChannel')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('chatChannel.id')
          .from(ChatChannel, 'chatChannel')
          .leftJoin('chatChannel.chatChannelMembers', 'chatChannelMember')
          .leftJoin('chatChannelMember.user', 'user')
          .where('chatChannel.chatType = :chatType AND user.id = :friendId', {
            chatType: ChatType.DIRECT_MESSAGE,
            friendId: friendId,
          })
          .getQuery();
        return 'chatChannel.id IN ' + subQuery;
      })
      .andWhere('user.id = :userId', { userId: userId })
      .getMany();

    if (userDirectMessages.length !== 0) {
      return true;
    }
    return false;
  }

  async findUserChatWithFriend(userId: number, friendId: number) {
    //check if both users exist
    await this.userService.findOne(userId);
    await this.userService.findOne(friendId);

    const userDirectMessages = await this.chatChannelMemberRepository
      .createQueryBuilder('chatChannelMember')
      .select(['chatChannelMember', 'chatChannel'])
      .leftJoin('chatChannelMember.user', 'user')
      .leftJoin('chatChannelMember.chatChannel', 'chatChannel')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('chatChannel.id')
          .from(ChatChannel, 'chatChannel')
          .leftJoin('chatChannel.chatChannelMembers', 'chatChannelMember')
          .leftJoin('chatChannelMember.user', 'user')
          .where('chatChannel.chatType = :chatType AND user.id = :friendId', {
            chatType: ChatType.DIRECT_MESSAGE,
            friendId: friendId,
          })
          .getQuery();
        return 'chatChannel.id IN ' + subQuery;
      })
      .andWhere('user.id = :userId', { userId: userId })
      .getOne();

    if (userDirectMessages === null) {
      throw new CustomException(
        `User with id = [${userId}] doesn't have chat with friend with id = ${friendId}`,
        HttpStatus.NOT_FOUND,
        'ChatChannelMember => findUserChatWithFriend()',
      );
    }

    return userDirectMessages;
  }

  async findAllUsersInChatChannel(chatChannelId: number) {
    const chatChannelMember = await this.chatChannelMemberRepository
      .createQueryBuilder('chatChannelMember')
      .select(['chatChannelMember', 'user'])
      .leftJoin('chatChannelMember.user', 'user')
      .leftJoin('chatChannelMember.chatChannel', 'chatChannel')
      .where('chatChannel.id = :chatChannelId', {
        chatChannelId: chatChannelId,
      })
      .getMany();

    if (chatChannelMember === null) {
      throw new CustomException(
        `ChatChannel with id = [${chatChannelId}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'ChatChannelMember => findAllUsersInChatChannel()',
      );
    }

    return chatChannelMember;
  }

  async findByUserIdAndChatChatChannelId(
    userId: number,
    chatChannelId: number,
  ) {
    const chatChannelMember = await this.chatChannelMemberRepository
      .createQueryBuilder('chatChannelMember')
      .select(['chatChannelMember'])
      .leftJoin('chatChannelMember.user', 'user')
      .leftJoin('chatChannelMember.chatChannel', 'chatChannel')
      .where('user.id = :userId AND chatChannel.id = :chatChannelId', {
        userId: userId,
        chatChannelId: chatChannelId,
      })
      .getOne();

    if (chatChannelMember === null) {
      throw new CustomException(
        `ChatChannelMember with id = [${userId}] is not in ChatChannel with id = [${chatChannelId}]`,
        HttpStatus.NOT_FOUND,
        'ChatChannelMember => findByUserIdAndChatChatChannelId()',
      );
    }

    return chatChannelMember;
  }

  async isUserAdmin(userId: number, chatChannelId: number) {
    const chatChannelMember = await this.chatChannelMemberRepository
      .createQueryBuilder('chatChannelMember')
      .select(['chatChannelMember'])
      .leftJoin('chatChannelMember.user', 'user')
      .leftJoin('chatChannelMember.chatChannel', 'chatChannel')
      .where('user.id = :userId AND chatChannel.id = :chatChannelId', {
        userId: userId,
        chatChannelId: chatChannelId,
      })
      .getOne();

    if (chatChannelMember === null) {
      throw new CustomException(
        `ChatChannelMember with id = [${userId}] is not in ChatChannel with id = [${chatChannelId}]`,
        HttpStatus.NOT_FOUND,
        'ChatChannelMember => isUserAdmin()',
      );
    }

    return chatChannelMember.isAdmin;
  }

  async update(
    id: number,
    updateChatChannelMemberDto: UpdateChatChannelMemberDto,
  ) {
    const chatChannelMember = await this.chatChannelMemberRepository.update(
      id,
      updateChatChannelMemberDto,
    );

    if (chatChannelMember.affected === 0) {
      throw new CustomException(
        `ChatChannelMember with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'ChatChannelMember => update()',
      );
    }
    chatChannelMember.raw = await this.findOne(id);
    return chatChannelMember;
  }

  async update_muted(id: number, date: Date) {
    //2022-05-01T12:00:00.000Z
    //{year}-{month}-{day}-
    //{T | designator for time of day seperator}-
    //{Hour(24 hours)}:{Minute}:{Second}-
    //{Z (Zulu aka UTC) | time zone or 'zero hour offset'}
    const currentTime: Date = new Date();

    if (date < currentTime) {
      throw new CustomException(
        `Date has to be in the future`,
        HttpStatus.BAD_REQUEST,
        'ChatChannelMember => update_muted()',
      );
    }

    const updateChatChannelMemberDto = new UpdateChatChannelMemberDto();

    updateChatChannelMemberDto.mutedUntil = date;

    const chatChannelMember = await this.chatChannelMemberRepository.update(
      id,
      updateChatChannelMemberDto,
    );

    if (chatChannelMember.affected === 0) {
      throw new CustomException(
        `ChatChannelMember with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'ChatChannelMember => update_muted()',
      );
    }
    chatChannelMember.raw = await this.findOne(id);
    return chatChannelMember;
  }

  async removeByUserInChatChannel(userId: number, chatChannelId: number) {
    const chatChannelMember = await this.chatChannelMemberRepository
      .createQueryBuilder('chatChannelMember')
      .delete()
      .from(ChatChannelMember)
      .where('userId = :userId AND chatChannelId = :chatChannelId', {
        userId: userId,
        chatChannelId: chatChannelId,
      })
      .returning('*')
      .execute();

    if (chatChannelMember.affected === 0) {
      throw new CustomException(
        `User with id = [${userId}] doesn't exist in ChatChannel with id = [${chatChannelId}] from ChatChannelMember`,
        HttpStatus.NOT_FOUND,
        'ChatChannelMember => remove()',
      );
    }

    return chatChannelMember;
  }

  async remove(id: number) {
    const chatChannelMember = await this.chatChannelMemberRepository
      .createQueryBuilder('chatChannelMember')
      .delete()
      .from(ChatChannelMember)
      .where('id = :id', { id: id })
      .returning('*')
      .execute();

    if (chatChannelMember.affected === 0) {
      throw new CustomException(
        `ChatChannelMember with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'ChatChannelMember => remove()',
      );
    }

    return chatChannelMember;
  }
}
