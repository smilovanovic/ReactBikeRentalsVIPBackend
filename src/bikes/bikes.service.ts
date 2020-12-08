import { Injectable } from '@nestjs/common';
import { BikeRepository } from './bike.repository';
import { BikeRentRepository } from './bike-rent.repository';
import { Bike } from './bike.entity';
import { CreateBikeDataDto } from './dto/create-bike-data.dto';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { SearchBikesDto } from './dto/search-bikes.dto';
import { Between, LessThan, MoreThan } from 'typeorm';
import { SearchRentsDto } from './dto/search-rents.dto';

@Injectable()
export class BikesService {
  constructor(
    private bikeRepository: BikeRepository,
    private bikeRentRepository: BikeRentRepository,
  ) {}

  findOne(params: FindConditions<Bike>): Promise<Bike | undefined> {
    return this.bikeRepository.findOne(params);
  }

  async search(
    params: SearchBikesDto,
  ): Promise<{ count: number; bikes: Bike[] }> {
    const { skip, take, order, rating, ...where } = params;
    if (rating) {
      where['rating'] = Between(Math.ceil(rating - 1), Math.ceil(rating));
    }
    const [bikes, count] = await this.bikeRepository.findAndCount({
      skip,
      take,
      order: order ? JSON.parse(order) : { createAt: -1 },
      where,
    });
    return { count, bikes };
  }

  async create(createBikeDto: CreateBikeDataDto): Promise<Bike> {
    const bike = this.bikeRepository.create(createBikeDto);
    return this.bikeRepository.save(bike);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.bikeRepository.delete(id);
    return !!result.affected;
  }

  async update(
    id: string,
    updateBikeDataDto: CreateBikeDataDto,
  ): Promise<boolean> {
    const result = await this.bikeRepository.update(id, updateBikeDataDto);
    return !!result.affected;
  }

  existingValues() {
    return ['model', 'color', 'location'].reduce(async (acc, field) => {
      const rows = await this.bikeRepository
        .createQueryBuilder('bike')
        .select(field)
        .distinct(true)
        .getRawMany();
      return { ...(await acc), [field]: rows.map((el) => el[field]) };
    }, {});
  }

  rents(searchRentsDto: SearchRentsDto) {
    return this.bikeRentRepository.find({
      where: {
        from: LessThan(searchRentsDto.endDate),
        to: MoreThan(searchRentsDto.startDate),
      },
      relations: ['user', 'bike'],
    });
  }
}
