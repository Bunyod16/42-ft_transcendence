import { ConfigService } from "@nestjs/config";

export class JwtConfig {
    constructor(
        private readonly configService: ConfigService) {}
   
    getSecret() {
      return this.configService.get('JWT_REFRESH_TOKEN_SECRET');
    }

    getExpiry() {
        return this.configService.get('JWT_REFRESH_TOKEN_EXPIRY');
      }
}