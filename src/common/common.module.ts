import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? '.env.test'
          : ['.env.development', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
        uuidExtension: 'uuid-ossp',
        logging: !!configService.get<boolean>('database.logging'),
        logger: 'advanced-console',
        migrationsRun: true,
        migrations: [`${__dirname}/../../migrations/**/*{.ts,.js}`],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CommonModule {}
