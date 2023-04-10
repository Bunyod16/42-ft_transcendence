import { HttpException, Injectable } from '@nestjs/common';
import { match } from 'assert';
import { HttpStatusCode } from 'axios';
import { MatchService } from 'src/match/match.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class QueueService {
  constructor(private readonly matchService: MatchService) {}
  private queue: {user: User, socket_id: string}[] = [];

  addUserToQueue(user: User, socket_id: string) {
    const index = this.queue.findIndex((u) => {
      return u.user.id === user.id;
    });
    if (index !== -1) {
      return
      // throw new HttpException(
      //   'Error: user already in queue',
      //   HttpStatusCode.BadRequest,
      // );
    }
    this.queue.push({user, socket_id});
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

  findMatchForPlayer(user: User) {
    console.log(`QUEUE: ${this.queue}`);
    console.log(`QUEUE: ${this.queue[0].user.id}`);
    if (this.queue.length >= 2) {
      this.matchService.create_with_id(this.queue[0].user.id, this.queue[1].user.id);
      this.queue.pop();
      this.queue.pop();
    }
  }

  getQueue(){
    return this.queue;
  }
}
