import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UpdateChatChannelDto } from './dto/update-chat_channel.dto';
import { Repository } from 'typeorm';
import {
  ChannelType,
  ChatChannel,
  ChatType,
} from './entities/chat_channel.entity';
import { validate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from 'src/utils/app.exception-filter';
import { ChatChannelMemberService } from 'src/chat_channel_member/chat_channel_member.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatChannelsService {
  constructor(
    @InjectRepository(ChatChannel)
    private chatChannelRepository: Repository<ChatChannel>,

    @Inject(forwardRef(() => ChatChannelMemberService)) //for circular dependency
    private readonly chatChannelsMembersService: ChatChannelMemberService,

    private readonly userService: UserService,
  ) {}

  async create_group_message(channelName: string, ownerId: number) {
    //see if owner exist or not
    await this.userService.findOne(ownerId);
    const channel = new ChatChannel();

    //default chatChannel group message settings
    channel.channel_type = ChannelType.PUBLIC;
    channel.ownerId = ownerId;
    channel.name = channelName;
    channel.password = undefined;
    channel.chatType = ChatType.GROUP_MESSAGE;

    const errors = await validate(channel);

    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      throw new CustomException(
        `Some Bad Shit Happened`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `ChatChannel => create_group_message()`,
      );
    }

    const savedChannel = await this.chatChannelRepository.save(channel);

    //immeadiately add owner to channelmembers
    await this.chatChannelsMembersService.create(ownerId, savedChannel.id);
    return savedChannel;
  }

  async create_direct_message(ownerId: number, recipientId: number) {
    //check if owner and recipient are the same
    if (ownerId === recipientId) {
      throw new CustomException(
        `User cannot add himself to direct_message`,
        HttpStatus.BAD_REQUEST,
        `ChatChannel => create_direct_message()`,
      );
    }

    //check if owner and recipient exist or not
    await this.userService.findOne(ownerId);
    await this.userService.findOne(recipientId);

    //check if user already has direct message with friend
    if (
      (await this.chatChannelsMembersService.checkIfUserHasChatWithFriend(
        ownerId,
        recipientId,
      )) === true
    ) {
      throw new CustomException(
        `User with id = [${ownerId}] already has direct_message with Friend with id = [${recipientId}]`,
        HttpStatus.BAD_REQUEST,
        `ChatChannel => create_direct_message()`,
      );
    }

    const channel = new ChatChannel();

    //default chatChannel direct message settings
    channel.name = undefined;
    channel.ownerId = ownerId;
    channel.password = undefined;
    channel.channel_type = ChannelType.PRIVATE;
    channel.chatType = ChatType.DIRECT_MESSAGE;

    const errors = await validate(channel);

    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      throw new CustomException(
        `Some Bad Shit Happened`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `ChatChannel => create_direct_message()`,
      );
    }

    //immeadiately add owner and recipient to channelmembers
    const savedChannel = await this.chatChannelRepository.save(channel);

    await this.chatChannelsMembersService.create(ownerId, savedChannel.id);
    await this.chatChannelsMembersService.create(recipientId, savedChannel.id);

    return savedChannel;
  }

  async findAll() {
    const chatChannels = await this.chatChannelRepository
      .createQueryBuilder('chatChannels')
      .select(['chatChannels'])
      .getMany();

    if (chatChannels === null) {
      throw new CustomException(
        `ChatChannels table doesn't exist`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'ChatChannels => findOne()',
      );
    }

    return chatChannels;
  }

  async findOne(id: number): Promise<ChatChannel> {
    const chatChannel = await this.chatChannelRepository
      .createQueryBuilder('chatChannel')
      .where({ id: id })
      .select('chatChannel')
      .getOne();

    if (chatChannel === null) {
      throw new CustomException(
        `chatChannels with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'chatChannels => findOne()',
      );
    }

    return chatChannel;
  }

  async update(
    id: number,
    channelType: ChannelType,
    password: string,
    name: string,
  ) {
    const chatChannel = await this.findOne(id);

    const updateChannelDto = new UpdateChatChannelDto();
    updateChannelDto.name = name ?? chatChannel.name;
    updateChannelDto.channel_type = channelType ?? chatChannel.channel_type;
    updateChannelDto.password = password ?? chatChannel.password;

    //if protected and no password
    if (
      updateChannelDto.channel_type == ChannelType.PROTECTED &&
      updateChannelDto.password == null
    )
      throw new CustomException(
        'ChannelType protected must have password',
        HttpStatus.BAD_REQUEST,
        `ChatChannel => update()`,
      );

    //remove password if private or public
    if (
      updateChannelDto.channel_type !== ChannelType.PROTECTED &&
      updateChannelDto.password != null
    ) {
      updateChannelDto.password = null;
    }

    const savedChannel = await this.chatChannelRepository.update(
      { id: id },
      updateChannelDto,
    );

    if (savedChannel.affected === 0) {
      throw new CustomException(
        `ChatChannel with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'ChatChannel => update()',
      );
    }

    savedChannel.raw = await this.findOne(id);
    return savedChannel;
  }

  async remove(id: number) {
    const chatChannel = await this.chatChannelRepository
      .createQueryBuilder('chatChannel')
      .delete()
      .from(ChatChannel)
      .where('id = :id', { id: id })
      .returning('*')
      .execute();

    if (chatChannel.affected === 0) {
      throw new CustomException(
        `ChatChannel with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'ChatChannel => remove()',
      );
    }

    return chatChannel;
  }
}

//TODO: check if user is updating the channel where they are the owner
