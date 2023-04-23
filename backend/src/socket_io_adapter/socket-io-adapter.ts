import { Logger, INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { JwtAccessService } from 'src/jwt_access/jwt_access.service';
import { SocketWithAuthData } from './socket-io-adapter.types';
import { parse } from 'cookie';
import type { CorsOptions } from 'cors';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);

  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const clientHost = this.configService.get('NEXT_HOST');
    const clientPort = parseInt(this.configService.get('NEXT_PORT'));

    const cors: CorsOptions = {
      origin: [`http://localhost:8080`, `${clientHost}:${clientPort}`],
      credentials: true,
    };

    this.logger.log('Configuring SocketIO with custom cors', {
      cors,
    });

    const allOptions: ServerOptions = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JwtAccessService);

    const server: Server = super.createIOServer(port, allOptions);

    // Socket.io middleware
    // Middleware should also be registered to main namespace if it requires middleware.
    server.use(createSocketTokenAuthMiddleware(jwtService, this.logger));
    // top is equivalent to
    // server
    //   .of('/')
    //   .use(createSocketTokenAuthMiddleware(jwtService, this.logger));

    // middleware must be namespaced if gateway is namespaced!
    // server
    //   .of('chatSockets')
    //   .use(createSocketTokenAuthMiddleware(jwtService, this.logger));

    // line below registers middleware for every sub-namespace
    server.on('new_namespace', (namespace) => {
      namespace.use(createSocketTokenAuthMiddleware(jwtService, this.logger));
    });

    return server;
  }
}

const createSocketTokenAuthMiddleware =
  (jwtAccessService: JwtAccessService, logger: Logger) =>
  async (socket: SocketWithAuthData, next) => {
    // socket.handshake.headers['token'] is only for postman compatibility
    // Postman provides no way to append this field (socket.handshake.auth.token). Therefore, we'll pass a token header, and fall back to that.
    const token = parse(socket.handshake.headers.cookie);

    logger.log(`Validating token before connection: ${token}`);

    try {
      const user = await jwtAccessService.verifyAccessToken(
        token.Authentication,
      );
      socket.user = user;
      next();
    } catch {
      logger.debug('Invalid JWT');
      next(new Error('Invalid JWT'));
    }
  };
