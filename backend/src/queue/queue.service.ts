import { HttpException, Injectable } from '@nestjs/common';
import { match } from 'assert';
import { HttpStatusCode } from 'axios';
import { MatchService } from 'src/match/match.service';
import { User } from 'src/user/entities/user.entity';
import { Socket } from 'socket.io';

@Injectable()
export class QueueService {
  constructor(private readonly matchService: MatchService) {}
  private queue: { user: User; socket: Socket }[] = [];

  addUserToQueue(user: User, socket: Socket) {
    const index = this.queue.findIndex((u) => {
      return u.user.id === user.id;
    });
    if (index !== -1) {
      return;
      // throw new HttpException(
      //   'Error: user already in queue',
      //   HttpStatusCode.BadRequest,
      // );
    }
    this.queue.push({ user, socket });
  }

  removePlayerFromQueue(user: User) {
    console.log(user);
    const index = this.queue.findIndex((u) => {
      return u.user.id === user.id;
    });
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
  }

  getQueue() {
    return this.queue;
  }
}
