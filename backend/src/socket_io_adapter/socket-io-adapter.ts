import { Logger, INestApplicationContext, ForbiddenException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from 'socket.io';
import { JwtAccessService } from 'src/jwt_access/jwt_access.service';
import { SocketWithAuthData } from 'src/utils/types';

export class SocketIOAdapter extends IoAdapter {
	private readonly logger = new Logger(SocketIOAdapter.name);

	constructor(
		private app: INestApplicationContext,
		private configService: ConfigService) {
			super(app);
	}

	createIOServer(port: number, options?: ServerOptions): any {

    const clientHost = this.configService.get('NEXT_HOST');
    const clientPort = parseInt(this.configService.get('NEXT_PORT'));

    const cors = {
      origin: [
        `http://localhost:8080`,
        `${clientHost}:${clientPort}`,
      ],
    };

    this.logger.log('Configuring SocketIO with custom cors', {
      cors,
    });

    const allOptions = {
      ...options,
      cors,
    }

    const jwtService = this.app.get(JwtAccessService);

		const server: Server = super.createIOServer(port, allOptions);

    // Socket.io middleware
    // middleware must be namespaced if gateway is namespaced!
    server.of('chat').use(createSocketTokenAuthMiddleware(jwtService, this.logger));
    // line below for game-stream since it has no defined namespace
    // server.use(createSocketTokenAuthMiddleware(jwtService, this.logger));

    return server;
	}
}

const createSocketTokenAuthMiddleware =
(jwtAccessService: JwtAccessService, logger: Logger) =>
async (socket: SocketWithAuthData, next) => {

  // socket.handshake.headers['token'] is for postman compatibility
  // Postman provides no way to append this field (socket.handshake.auth.token). Therefore, we'll pass a token header, and fall back to that.
  const token = socket.handshake.auth.token || socket.handshake.headers['token'];

  logger.debug(`Validating token before connection: ${token}`)

  try {
    const payload = await jwtAccessService.verifyAccessToken(token);
    socket.userId = payload.id;
    next();
  }
  catch {
    logger.debug('Invalid JWT');
    next(new Error('Invalid JWT'));
  }
}
