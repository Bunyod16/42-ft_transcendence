import { CreateTwoFactorDto } from './dto/create-two_factor.dto';
import { UpdateTwoFactorDto } from './dto/update-two_factor.dto';
import { TwoFactor } from './entities/two_factor.entity';
import { Repository } from 'typeorm';
export declare class TwoFactorService {
    private twoFactorRepository;
    constructor(twoFactorRepository: Repository<TwoFactor>);
    create(createTwoFactorDto: CreateTwoFactorDto): Promise<CreateTwoFactorDto & TwoFactor>;
    findAll(): Promise<TwoFactor[]>;
    findOne(id: number): Promise<TwoFactor>;
    update(id: number, updateTwoFactorDto: UpdateTwoFactorDto): string;
    remove(id: number): string;
}
