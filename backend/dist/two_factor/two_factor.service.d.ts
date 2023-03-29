import { CreateTwoFactorDto } from './dto/create-two_factor.dto';
import { TwoFactor } from './entities/two_factor.entity';
import { DeleteResult, Repository } from 'typeorm';
export declare class TwoFactorService {
    private twoFactorRepository;
    constructor(twoFactorRepository: Repository<TwoFactor>);
    create(createTwoFactorDto: CreateTwoFactorDto): Promise<CreateTwoFactorDto & TwoFactor>;
    findAll(): Promise<TwoFactor[]>;
    findOne(id: number): Promise<TwoFactor>;
    remove(id: number): Promise<DeleteResult>;
}
