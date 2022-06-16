import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { SocketService } from './socket.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);

  const logger = new Logger();
  const socketService = new SocketService(logger);
  socketService.start();
}
bootstrap();
