import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const HTTP_PORT = process.env.HTTP_PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        name: 'authorization',
        type: 'apiKey',
        in: 'header',
      },
      'authorization',
    )
    .addBasicAuth({ name: 'basic', in: 'header', type: 'apiKey' })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(HTTP_PORT, () =>
    console.log(`APPLICATION IS RUNNING ON ${HTTP_PORT} PORT`),
  );
}
bootstrap();
