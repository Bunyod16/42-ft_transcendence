import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Match } from 'src/match/entities/match.entity';
import { GameStateService } from 'src/game_state/gameState.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameStreamService {
  @WebSocketServer()
  server: Server;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private gameStateService: GameStateService,
  ) {
    console.log('12312313123');
    console.log(this.server);
  }

  add(match: Match) {
    console.log(match);
    console.log(match.id);
    const callback = async () => {
      this.server
        .to(`${match.id}`)
        .emit('updateGame', await this.gameStateService.getGame(match.id));
    };

    const interval = setInterval(callback, 1000); //TODO CHANGE SECONDS HERE
    this.schedulerRegistry.addInterval(`${match.id}`, interval);
    console.log(`match stream ${match.id} created!`);
  }

  remove(match: Match) {
    this.schedulerRegistry.deleteInterval(`${match.id}`);
    console.log(`match stream ${match.id} deleted!`);
  }
}
