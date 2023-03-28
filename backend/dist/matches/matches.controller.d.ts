import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
export declare class MatchesController {
    private readonly matchesService;
    constructor(matchesService: MatchesService);
    create(createMatchDto: CreateMatchDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateMatchDto: UpdateMatchDto): string;
    remove(id: string): string;
}
