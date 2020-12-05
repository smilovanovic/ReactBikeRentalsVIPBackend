import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  const configService = app.get(ConfigService);
  await app.listen(configService.get('port'));
}
bootstrap()
  .then(() => {
    console.log('app bootstrapped');
  })
  .catch((error) => {
    console.log({ error });
    process.exit(1);
  });
