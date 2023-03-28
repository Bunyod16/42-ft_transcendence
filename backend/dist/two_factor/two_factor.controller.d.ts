import { TwoFactorService } from './two_factor.service';
import { CreateTwoFactorDto } from './dto/create-two_factor.dto';
export declare class TwoFactorController {
    private readonly twoFactorService;
    constructor(twoFactorService: TwoFactorService);
    create(createTwoFactorDto: CreateTwoFactorDto): Promise<CreateTwoFactorDto & import("./entities/two_factor.entity").TwoFactor>;
    findAll(): Promise<import("./entities/two_factor.entity").TwoFactor[]>;
    findOne(id: string): Promise<import("./entities/two_factor.entity").TwoFactor>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
