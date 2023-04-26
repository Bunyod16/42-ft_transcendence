import {
  IsNotEmpty,
  IsString,
  IsNumber,
} from "class-validator";

export class CreateAchievementDto {

  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;
}
