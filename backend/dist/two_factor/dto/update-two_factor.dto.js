"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTwoFactorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_two_factor_dto_1 = require("./create-two_factor.dto");
class UpdateTwoFactorDto extends (0, swagger_1.PartialType)(create_two_factor_dto_1.CreateTwoFactorDto) {
}
exports.UpdateTwoFactorDto = UpdateTwoFactorDto;
//# sourceMappingURL=update-two_factor.dto.js.map