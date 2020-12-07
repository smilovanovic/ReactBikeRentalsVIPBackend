import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeRepository } from './bike.repository';
import { BikesService } from './bikes.service';
import { BikesController } from './bikes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BikeRepository])],
  providers: [BikesService],
  exports: [BikesService],
  controllers: [BikesController],
})
export class BikesModule {}
