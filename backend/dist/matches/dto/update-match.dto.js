"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMatchDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_match_dto_1 = require("./create-match.dto");
class UpdateMatchDto extends (0, swagger_1.PartialType)(create_match_dto_1.CreateMatchDto) {
}
exports.UpdateMatchDto = UpdateMatchDto;
//# sourceMappingURL=update-match.dto.js.map