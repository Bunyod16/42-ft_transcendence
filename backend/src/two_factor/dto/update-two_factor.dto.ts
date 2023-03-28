import { PartialType } from '@nestjs/swagger';
import { CreateTwoFactorDto } from './create-two_factor.dto';

export class UpdateTwoFactorDto extends PartialType(CreateTwoFactorDto) {}
