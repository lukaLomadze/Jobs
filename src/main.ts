import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('tiny'));
  

  app.enableCors({
    origin: process.env.FRONT_URL ?? 'http://localhost:3000',
  });

  const config = new DocumentBuilder()
    .setTitle('Jobs Board API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('vacancies', 'Vacancy management')
    .addTag('companies', 'Company management')
    .addTag('applications', 'Job application management')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
