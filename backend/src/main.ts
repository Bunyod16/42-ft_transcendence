import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomExceptionFilter } from './utils/app.exception-filter';
import { SocketIOAdapter } from './socket_io_adapter/socket-io-adapter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: ['http://localhost:8080'],
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('42 ft_transendence')
    .setDescription('The ft_transendence API description')
    .setVersion('1.0')
    .addTag('ft_transendence')
    .addCookieAuth('Authentication')
    .addCookieAuth('Refresh')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //adds a global filter so that Catch(CustomException) doesnt need to be called everywhere
  app.useGlobalFilters(new CustomExceptionFilter());

  // Commented out for the time being
  // Custom socketIO adapter for custom cors on all websockets
  // app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  await app.listen(3000);
}
bootstrap();
