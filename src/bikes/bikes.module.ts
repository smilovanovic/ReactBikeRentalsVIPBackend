import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeRepository } from './bike.repository';
import { BikesService } from './bikes.service';
import { BikesController } from './bikes.controller';
import { BikeRentRepository } from './bike-rent.repository';
import { BikeRatingRepository } from './bike-rating.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BikeRepository,
      BikeRentRepository,
      BikeRatingRepository,
    ]),
  ],
  providers: [BikesService],
  exports: [BikesService],
  controllers: [BikesController],
})
export class BikesModule {}
