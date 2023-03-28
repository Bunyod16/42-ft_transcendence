"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorModule = void 0;
const common_1 = require("@nestjs/common");
const two_factor_service_1 = require("./two_factor.service");
const two_factor_controller_1 = require("./two_factor.controller");
const database_module_1 = require("../database/database.module");
const config_1 = require("@nestjs/config");
const two_factor_providers_1 = require("./two_factor.providers");
let TwoFactorModule = class TwoFactorModule {
};
TwoFactorModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, config_1.ConfigModule],
        controllers: [two_factor_controller_1.TwoFactorController],
        providers: [
            ...two_factor_providers_1.twoFactorProviders,
            two_factor_service_1.TwoFactorService
        ],
    })
], TwoFactorModule);
exports.TwoFactorModule = TwoFactorModule;
//# sourceMappingURL=two_factor.module.js.map