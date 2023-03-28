"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoFactorProviders = void 0;
const two_factor_entity_1 = require("./entities/two_factor.entity");
exports.twoFactorProviders = [
    {
        provide: 'TWOFACTOR_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(two_factor_entity_1.TwoFactor),
        inject: ['DATA_SOURCE'],
    },
];
//# sourceMappingURL=two_factor.providers.js.map