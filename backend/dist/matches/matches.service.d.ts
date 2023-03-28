import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
export declare class MatchesService {
    create(createMatchDto: CreateMatchDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateMatchDto: UpdateMatchDto): string;
    remove(id: number): string;
}
