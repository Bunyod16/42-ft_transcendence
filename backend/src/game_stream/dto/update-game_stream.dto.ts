import { PartialType } from '@nestjs/mapped-types';
import { CreateGameStreamDto } from './create-game_stream.dto';

export class UpdateGameStreamDto extends PartialType(CreateGameStreamDto) {
  id: number;
}
