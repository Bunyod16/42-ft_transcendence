import { Test, TestingModule } from '@nestjs/testing';
import { GameStreamGateway } from './game_stream.gateway';
import { GameStreamService } from './game_stream.service';

describe('GameStreamGateway', () => {
  let gateway: GameStreamGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameStreamGateway, GameStreamService],
    }).compile();

    gateway = module.get<GameStreamGateway>(GameStreamGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
