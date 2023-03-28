"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorController = void 0;
const common_1 = require("@nestjs/common");
const two_factor_service_1 = require("./two_factor.service");
const create_two_factor_dto_1 = require("./dto/create-two_factor.dto");
let TwoFactorController = class TwoFactorController {
    constructor(twoFactorService) {
        this.twoFactorService = twoFactorService;
    }
    create(createTwoFactorDto) {
        return this.twoFactorService.create(createTwoFactorDto);
    }
    findAll() {
        return this.twoFactorService.findAll();
    }
    async findOne(id) {
        const twoFactor = await this.twoFactorService.findOne(+id);
        if (!twoFactor) {
            throw new common_1.HttpException('Not Found', common_1.HttpStatus.NOT_FOUND);
        }
        return twoFactor;
    }
    remove(id) {
        return this.twoFactorService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_two_factor_dto_1.CreateTwoFactorDto]),
    __metadata("design:returntype", void 0)
], TwoFactorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TwoFactorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TwoFactorController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TwoFactorController.prototype, "remove", null);
TwoFactorController = __decorate([
    (0, common_1.Controller)('two-factor'),
    __metadata("design:paramtypes", [two_factor_service_1.TwoFactorService])
], TwoFactorController);
exports.TwoFactorController = TwoFactorController;
//# sourceMappingURL=two_factor.controller.js.map