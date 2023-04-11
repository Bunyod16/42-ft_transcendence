import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGameStreamDto } from './dto/create-game_stream.dto';
import { UpdateGameStreamDto } from './dto/update-game_stream.dto';
import { User } from 'src/user/entities/user.entity';
import { MatchService } from 'src/match/match.service';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

@Injectable()
export class GameStreamService {
  @WebSocketServer()
  server: Server;

  constructor(private matchService: MatchService) {}

  async connectGame(user: User) {
    
  }

  findAll() {
    return `This action returns all gameStream`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gameStream`;
  }

  update(id: number, updateGameStreamDto: UpdateGameStreamDto) {
    return `This action updates a #${id} gameStream`;
  }

  remove(id: number) {
    return `This action removes a #${id} gameStream`;
  }
}
