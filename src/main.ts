import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.log('Running on PORT: ', PORT);
  await app.listen(PORT);
}
bootstrap();
