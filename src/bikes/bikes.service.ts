import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BikeRepository } from './bike.repository';
import { BikeRentRepository } from './bike-rent.repository';
import { Bike } from './bike.entity';
import { CreateBikeDataDto } from './dto/create-bike-data.dto';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { LessThan, MoreThan, Not } from 'typeorm';
import { SearchBikesDto } from './dto/search-bikes.dto';
import { SearchRentsDto } from './dto/search-rents.dto';
import * as moment from 'moment';
import { BikeRatingRepository } from './bike-rating.repository';
import { User } from '../users/user.entity';
import { BikeRent } from './bike-rent.entity';
import { CreateRentDto } from './dto/create-rent.dto';

@Injectable()
export class BikesService {
  constructor(
    private bikeRepository: BikeRepository,
    private bikeRentRepository: BikeRentRepository,
    private bikeRatingRepository: BikeRatingRepository,
  ) {}

  findOne(params: FindConditions<Bike>): Promise<Bike | undefined> {
    return this.bikeRepository.findOne(params);
  }

  async search(
    params: SearchBikesDto,
    user: User,
  ): Promise<{ count: number; bikes: Bike[] }> {
    const { skip, take, order, availableFrom, availableTo, ...where } = params;
    let sql = `
      SELECT b.*, br.rating as userRating from bike b
      LEFT JOIN bike_rating AS br ON br."bikeId" = b."id" AND br."userId" = '${user.id}'
    `;
    let sqlCount = 'SELECT COUNT(b.*) from bike b ';

    if (availableFrom && availableTo) {
      const momentFrom = moment(availableFrom);
      const momentTo = moment(availableTo);
      if (momentFrom.isValid() && momentTo.isValid()) {
        let minutes = Math.ceil(
          (momentTo.valueOf() - momentFrom.valueOf()) / 1000 / 60,
        );
        minutes--;
        const from = moment(availableFrom).toISOString();
        const to = moment(availableTo).toISOString();
        const sqlAddition = `
          LEFT JOIN (
            SELECT "bikeId", SUM(EXTRACT(EPOCH FROM (
              LEAST(TIMESTAMP WITH TIME ZONE '${to}', br."to") - GREATEST(TIMESTAMP WITH TIME ZONE '${from}', br."from")
            )) / 60) < ${minutes} AS available
            FROM bike_rent br
            WHERE br."from" < '${to}' AND br."to" > '${from}'
            GROUP BY br."bikeId"
          ) AS a ON a."bikeId" = b."id"
          WHERE (a."available" = true OR a."available" IS NULL)
        `;
        sql += sqlAddition;
        sqlCount += sqlAddition;
      }
    } else {
      sql += 'WHERE 1 = 1';
      sqlCount += 'WHERE 1 = 1';
    }

    const o = order ? JSON.parse(order) : { createAt: -1 };
    const orderKey = Object.keys(o)[0];
    const mappings = [take, skip];
    const wKeys = Object.keys(where);
    let w = '';
    if (wKeys.length > 0) {
      for (let i = 0; i < wKeys.length; i++) {
        let sign = '=';
        if (wKeys[i] === 'rating') sign = '>=';
        w += `AND b."${wKeys[i]}" ${sign} $${i + 3}`;
        sqlCount += `AND b."${wKeys[i]}" ${sign} $${i + 1}`;
        mappings.push(where[wKeys[i]]);
      }
    }
    console.log(o[orderKey]);
    sql += `
      ${w}
      ORDER BY b."${orderKey}" ${o[orderKey] === -1 ? 'DESC' : 'ASC'}
      LIMIT $1 OFFSET $2
    `;

    const bikes = await this.bikeRepository.query(sql, mappings);
    mappings.splice(0, 2);
    const [{ count }] = await this.bikeRepository.query(sqlCount, mappings);
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

  rents(searchRentsDto: SearchRentsDto): Promise<BikeRent[]> {
    const where = {
      from: LessThan(searchRentsDto.endDate),
      to: MoreThan(searchRentsDto.startDate),
    };
    if (searchRentsDto.bikeId) {
      where['bikeId'] = searchRentsDto.bikeId;
    }
    return this.bikeRentRepository.find({
      where,
      relations: ['user', 'bike'],
    });
  }

  rentsMany(where: FindConditions<BikeRent>): Promise<BikeRent[]> {
    return this.bikeRentRepository.find({
      where,
      order: {
        from: -1,
      },
      relations: ['bike'],
    });
  }

  async rate(bike: Bike, user: User, rating: number): Promise<Bike> {
    let bikeRating = await this.bikeRatingRepository.findOne({ bike, user });
    if (!bikeRating) {
      bikeRating = this.bikeRatingRepository.create({
        bike,
        user,
      });
    }
    bikeRating.rating = rating;
    await this.bikeRatingRepository.save(bikeRating);
    const { totalRating } = await this.bikeRatingRepository
      .createQueryBuilder('bikeRating')
      .select('SUM(bikeRating.rating) / COUNT(*)', 'totalRating')
      .where('bikeRating.bikeId = :id', { id: bike.id })
      .getRawOne();
    bike.rating = totalRating;
    await this.bikeRepository.save(bike);
    return bike;
  }

  async upsertRent(
    bike: Bike,
    user: User,
    createRentDto: CreateRentDto,
  ): Promise<BikeRent> {
    let bikeRent;
    if (createRentDto.id) {
      bikeRent = await this.bikeRentRepository.findOne({
        id: createRentDto.id,
        bike,
        user,
      });
      if (!bikeRent) throw new NotFoundException('Bike rent not found');
      bikeRent.from = createRentDto.startDate;
      bikeRent.to = createRentDto.endDate;
    }
    if (!bikeRent) {
      bikeRent = this.bikeRentRepository.create({
        bike,
        user,
        from: createRentDto.startDate,
        to: createRentDto.endDate,
      });
    }
    const where = {
      from: LessThan(createRentDto.endDate),
      to: MoreThan(createRentDto.startDate),
      bike,
    };
    if (createRentDto.id) {
      where['id'] = Not(createRentDto.id);
    }
    const exists = await this.bikeRentRepository.count(where);
    if (exists > 0) {
      throw new ConflictException(
        'Bike is not available in the selected range',
      );
    }
    await this.bikeRentRepository.save(bikeRent);
    return bikeRent;
  }

  async deleteRent(bikeId: string, user: User, id: string) {
    const bikeRent = await this.bikeRentRepository.findOne({ id });
    if (
      !bikeRent ||
      bikeRent.bikeId !== bikeId ||
      bikeRent.userId !== user.id
    ) {
      throw new NotFoundException('Bike rent not found');
    }
    const result = await this.bikeRentRepository.delete(id);
    return !!result.affected;
  }
}
