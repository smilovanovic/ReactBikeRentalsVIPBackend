import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';
import { UserRole } from './src/users/user.entity';
import * as faker from 'faker';
import { IsString } from 'class-validator';
import { BikesService } from './src/bikes/bikes.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const usersPromises = [];
  for (let i = 0; i < 20; i++) {
    usersPromises.push(
      usersService.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: 'P@s5word',
        roles: [
          faker.random.number(1) === 1 ? UserRole.MANAGER : UserRole.CLIENT,
        ],
        isActive: true,
      }),
    );
  }
  const users = await Promise.all(usersPromises);

  const bikesService = app.get(BikesService);
  const bikesPromises = [];
  for (let i = 0; i < 20; i++) {
    bikesPromises.push(
      bikesService.create({
        model: faker.company.companyName(),
        color: faker.commerce.color(),
        location: faker.address.city(),
      }),
    );
  }
  await Promise.all(bikesPromises);

  await app.close();
}
bootstrap()
  .then(() => {
    console.log('seeder bootstrapped');
  })
  .catch((error) => {
    console.log({ error });
    process.exit(1);
  });
