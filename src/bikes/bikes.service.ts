import { Injectable } from '@nestjs/common';
import { BikeRepository } from './bike.repository';
import { Bike } from './bike.entity';
import { CreateBikeDataDto } from './dto/create-bike-data.dto';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { SearchBikesDto } from './dto/search-bikes.dto';

@Injectable()
export class BikesService {
  constructor(private bikeRepository: BikeRepository) {}

  findOne(params: FindConditions<Bike>): Promise<Bike | undefined> {
    return this.bikeRepository.findOne(params);
  }

  async search(
    params: SearchBikesDto,
  ): Promise<{ count: number; bikes: Bike[] }> {
    const { skip, take, order, ...where } = params;
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
}
