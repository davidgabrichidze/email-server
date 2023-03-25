import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // configure cors
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Email server')
    .setDescription('Angular course helper API')
    .setVersion('1.0')
    .addTag('emails')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000).then(() => {
    console.log('Listening at http://localhost:3000/swagger');
  });
}
bootstrap();
