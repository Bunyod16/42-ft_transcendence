import { Logger, INestApplicationContext } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Socket, ServerOptions } from 'socket.io';

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

		const server = super.createIOServer(port, allOptions);
		return server;
	}
}
